<script setup lang="ts">
import type { EdgeChange, NodeChange, NodeMouseEvent } from '@vue-flow/core'

import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useVueFlow,
  VueFlow,
} from '@vue-flow/core'
import { Modal } from 'ant-design-vue'
import { computed, h, markRaw, onMounted, onUnmounted, ref, watch } from 'vue'

import type { TFlowEdge, TFlowNode, TFlowNodeType } from '@/types/data-flow'

import { applyTreeLayout } from '@/views/dataFlow/hooks/useTreeLayout'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

type DataFlowGraphProps = {
  edges: TFlowEdge[]
  editable?: boolean
  loading: boolean
  nodes: TFlowNode[]
}

const props = withDefaults(defineProps<DataFlowGraphProps>(), {
  edges: () => [],
  editable: false,
  loading: false,
  nodes: () => [],
})

type DataFlowGraphEmits = {
  'update:edges': [edges: TFlowEdge[]]
  'update:nodes': [nodes: TFlowNode[]]
}

const emit = defineEmits<DataFlowGraphEmits>()

/** 节点类型 → 颜色映射 */
const TYPE_COLOR_MAP: Record<TFlowNodeType, string> = {
  // 审批角色类型
  applicant: '#722ed1',
  ceo: '#f5222d',
  director: '#2f54eb',
  // 数据流类型
  etl: '#faad14',
  finance: '#faad14',
  hr: '#52c41a',
  legal: '#eb2f96',
  load: '#52c41a',
  manager: '#13c2c2',
  sink: '#1890ff',
  source: '#722ed1',
  supervisor: '#1890ff',
  transform: '#13c2c2',
  vp: '#fa8c16',
}

/** 节点类型 → 中文标签 */
const TYPE_LABEL_MAP: Record<TFlowNodeType, string> = {
  // 审批角色类型
  applicant: '申请人',
  ceo: 'CEO',
  director: '总监',
  // 数据流类型
  etl: 'ETL 处理',
  finance: '财务',
  hr: 'HR',
  legal: '法务',
  load: '数据加载',
  manager: '部门经理',
  sink: '目标存储',
  source: '数据源',
  supervisor: '直属主管',
  transform: '数据转换',
  vp: '副总裁',
}

/** 节点类型选项（供编辑弹窗下拉使用） */
const nodeTypeOptions = computed(() =>
  (Object.keys(TYPE_LABEL_MAP) as TFlowNodeType[]).map((value) => ({
    label: TYPE_LABEL_MAP[value],
    value,
  })),
)

/** 节点类型分组（调色板用） */
const NODE_TYPE_GROUPS: Array<{ label: string; types: TFlowNodeType[] }> = [
  { label: '数据流', types: ['source', 'transform', 'etl', 'load', 'sink'] },
  {
    label: '审批角色',
    types: [
      'applicant',
      'supervisor',
      'manager',
      'director',
      'vp',
      'ceo',
      'hr',
      'finance',
      'legal',
    ],
  },
]

/** 自定义节点组件 — 「Editorial Minimal」 */
const CustomNode = {
  props: ['data'],
  setup(props: {
    data: {
      approver?: string
      comment?: string
      description: string
      label: string
      nodeType: TFlowNodeType
    }
  }) {
    const color = computed(() => TYPE_COLOR_MAP[props.data.nodeType] || '#666')
    const typeLabel = computed(
      () => TYPE_LABEL_MAP[props.data.nodeType] || props.data.nodeType,
    )

    return () => {
      const children: ReturnType<typeof h>[] = []

      // 首行：圆点 + 类型标签 + 名称
      children.push(
        h(
          'div',
          {
            style: {
              alignItems: 'center',
              display: 'flex',
              gap: '6px',
              marginBottom:
                props.data.approver || props.data.description ? '7px' : '0',
            },
          },
          [
            h('span', {
              style: {
                background: color.value,
                borderRadius: '50%',
                display: 'inline-block',
                flexShrink: 0,
                height: '7px',
                width: '7px',
              },
            }),
            h(
              'span',
              {
                style: {
                  color: '#999',
                  flexShrink: 0,
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                },
              },
              typeLabel.value,
            ),
            h(
              'span',
              {
                style: {
                  color: '#111',
                  fontSize: '13px',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              },
              props.data.label,
            ),
          ],
        ),
      )

      // 审批人
      if (props.data.approver) {
        children.push(
          h(
            'div',
            {
              style: {
                color: '#555',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: '1.4',
                marginBottom: props.data.description ? '3px' : '0',
              },
            },
            `👤 ${props.data.approver}`,
          ),
        )
      }

      // 描述
      if (props.data.description) {
        children.push(
          h(
            'div',
            {
              style: {
                color: '#aaa',
                fontSize: '11px',
                lineHeight: '1.4',
              },
            },
            props.data.description,
          ),
        )
      }

      return h(
        'div',
        {
          class: 'node-card',
          style: {
            background: '#fff',
            border: '1px solid #e4e7ec',
            borderRadius: '6px',
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, -apple-system, sans-serif',
            minWidth: '148px',
            padding: '10px 13px',
          },
        },
        children,
      )
    }
  },
}

/** 注册自定义节点类型 */
const nodeTypes = {
  'process-node': markRaw(CustomNode),
  'source-node': markRaw(CustomNode),
}

/** VueFlow 实例 */
const { fitView } = useVueFlow('data-flow-graph')

// ==================== 编辑模式 ====================
/** 编辑态本地副本（避免直接修改 prop） */
const editNodes = ref<TFlowNode[]>([])
const editEdges = ref<TFlowEdge[]>([])
/** 是否已完成首次从 props → 本地状态同步 */
const editInitialized = ref(false)
/** 新节点自增 ID（组件级，保证同一会话内唯一） */
let nodeIdSeq = 0

/**
 * 编辑模式下：当外部 props 首次到达时，克隆到本地状态并应用树布局。
 */
watch(
  [() => props.nodes, () => props.edges],
  ([nodes, edges]) => {
    if (props.editable && !editInitialized.value && nodes.length > 0) {
      const laidOut = applyTreeLayout(nodes, edges)
      editNodes.value = JSON.parse(JSON.stringify(laidOut)) as TFlowNode[]
      editEdges.value = JSON.parse(JSON.stringify(edges)) as TFlowEdge[]
      editInitialized.value = true
    }
  },
  { deep: true },
)

/** 编辑模式：节点拖动/删除变化 */
function onNodesChange(changes: NodeChange[]) {
  if (!props.editable) return
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  editNodes.value = applyNodeChanges(
    changes,
    editNodes.value as any,
  ) as unknown as TFlowNode[]
  emit('update:nodes', editNodes.value)
}

/** 编辑模式：边的拖动/删除变化 */
function onEdgesChange(changes: EdgeChange[]) {
  if (!props.editable) return

  editEdges.value = applyEdgeChanges(
    changes,
    editEdges.value as any,
  ) as unknown as TFlowEdge[]
  emit('update:edges', editEdges.value)
}

/** 编辑模式：新建连接 */
function onConnect(connection: { source: string; target: string }) {
  if (!props.editable) return
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-assertion
  editEdges.value = addEdge(connection, editEdges.value as any) as TFlowEdge[]
  emit('update:edges', editEdges.value)
}

// ==================== 节点 CRUD ====================

/** 调色板折叠态 */
const paletteCollapsed = ref(false)

/** 右键菜单状态 */
const contextMenu = ref<{
  node: null | TFlowNode
  visible: boolean
  x: number
  y: number
}>({
  node: null,
  visible: false,
  x: 0,
  y: 0,
})

/** 节点编辑弹窗状态 */
const editorVisible = ref(false)
const editingNodeId = ref('')
const editorForm = ref<{
  approver: string
  description: string
  label: string
  nodeType: TFlowNodeType
}>({
  approver: '',
  description: '',
  label: '',
  nodeType: 'applicant',
})

/** 生成唯一节点 ID */
function genNodeId(): string {
  nodeIdSeq++
  return `node-${Date.now()}-${nodeIdSeq}`
}

/** 计算新节点放置位置（当前最底节点下方） */
function getNewNodePos(): { x: number; y: number } {
  if (editNodes.value.length === 0) return { x: 300, y: 80 }
  const maxY = Math.max(...editNodes.value.map((n) => n.position.y))
  return { x: 280, y: maxY + 140 }
}

/** 添加节点 */
function addNode(type: TFlowNodeType) {
  const pos = getNewNodePos()
  const node: TFlowNode = {
    data: {
      approver: '',
      description: '',
      label: TYPE_LABEL_MAP[type] || type,
      nodeType: type,
    },
    id: genNodeId(),
    position: pos,
    type: 'process-node',
  }
  editNodes.value = [...editNodes.value, node]
  emit('update:nodes', editNodes.value)
  // 新节点入图后自适应视图
  setTimeout(() => {
    void fitView?.({ duration: 300, padding: 0.3 })
  }, 100)
}

/** 打开节点编辑弹窗 */
function openEditor(node: TFlowNode) {
  editingNodeId.value = node.id
  editorForm.value = {
    approver: node.data.approver ?? '',
    description: node.data.description ?? '',
    label: node.data.label,
    nodeType: node.data.nodeType,
  }
  editorVisible.value = true
}

/** 保存节点编辑 */
function saveEditor() {
  const idx = editNodes.value.findIndex((n) => n.id === editingNodeId.value)
  if (idx === -1) return
  editNodes.value[idx].data.label = editorForm.value.label
  editNodes.value[idx].data.nodeType = editorForm.value.nodeType
  editNodes.value[idx].data.approver = editorForm.value.approver || undefined
  editNodes.value[idx].data.description = editorForm.value.description
  editNodes.value = [...editNodes.value] // 触发响应式
  emit('update:nodes', editNodes.value)
  editorVisible.value = false
}

/** 删除节点（连带关联边一并移除） */
function deleteNode(id: string) {
  editNodes.value = editNodes.value.filter((n) => n.id !== id)
  editEdges.value = editEdges.value.filter(
    (e) => e.source !== id && e.target !== id,
  )
  emit('update:nodes', editNodes.value)
  emit('update:edges', editEdges.value)
}

/** 右键菜单：节点上 */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
function onNodeContextMenu(payload: NodeMouseEvent) {
  const ev = payload.event as MouseEvent
  ev.preventDefault()
  contextMenu.value = {
    node: payload.node as unknown as TFlowNode,
    visible: true,
    x: ev.clientX,
    y: ev.clientY,
  }
}
/* eslint-enable @typescript-eslint/no-unnecessary-type-assertion */

/** 右键菜单：空白面板 */
function onPaneContextMenu(event: MouseEvent) {
  event.preventDefault()
  contextMenu.value = {
    node: null,
    visible: true,
    x: event.clientX,
    y: event.clientY,
  }
}

/** 右键菜单：编辑 */
function onCtxEdit() {
  if (contextMenu.value.node) openEditor(contextMenu.value.node)
  contextMenu.value.visible = false
}

/** 右键菜单：删除（带确认） */
function onCtxDelete() {
  const n = contextMenu.value.node
  contextMenu.value.visible = false
  if (!n) return
  Modal.confirm({
    content: `确认删除节点「${n.data.label}」？关联连线将同时移除。`,
    onOk() {
      deleteNode(n.id)
    },
    title: '删除节点',
    type: 'warning',
  })
}

/** 点击页面其它区域时关闭右键菜单 */
function onDocClick() {
  contextMenu.value.visible = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

// ==================== 显示数据源 ====================
/**
 * 将外部 nodes 转为 VueFlow 格式。
 * 只读模式自动应用树布局，编辑模式取用户拖拽后的本地副本。
 */
const flowNodes = computed(() => {
  let source: TFlowNode[]
  if (props.editable) {
    source = editNodes.value
  } else {
    source = applyTreeLayout(props.nodes, props.edges)
  }
  return source.map((n) => ({
    ...n,
    type: 'process-node',
  }))
})

const flowEdges = computed(() => {
  const source = props.editable ? editEdges.value : props.edges
  const nodeIds = new Set(flowNodes.value.map((n) => n.id))
  return source
    .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
    .map((e) => ({
      ...e,
      animated: true,
      style: { stroke: '#88909c', strokeWidth: 1.5 },
    }))
})

/** 自适应视图 — mount 时调用 */
function onGraphLoaded() {
  setTimeout(() => {
    void fitView({ duration: 300, padding: 0.3 })
  }, 100)
}

/** 异步数据到达后自适应视图（初始空 → 节点到达） */
watch(flowNodes, (curr, prev) => {
  if ((prev?.length ?? 0) === 0 && curr.length > 0) {
    setTimeout(() => {
      void fitView({ duration: 300, padding: 0.3 })
    }, 150)
  }
})
</script>

<template>
  <div :style="{ height: '420px', position: 'relative', width: '100%' }">
    <a-spin :spinning="loading" style="height: 100%; width: 100%">
      <VueFlow
        id="data-flow-graph"
        :default-edge-options="{ animated: true }"
        :edges="flowEdges"
        :edges-focusable="editable"
        :edges-removable="editable"
        :edges-updatable="editable"
        :fit-view-on-init="true"
        :min-zoom="0.3"
        :nodes="flowNodes"
        :node-types="nodeTypes"
        :nodes-connectable="editable"
        :nodes-draggable="editable"
        :max-zoom="2"
        @connect="onConnect"
        @edges-change="onEdgesChange"
        @nodes-change="onNodesChange"
        @node-context-menu="onNodeContextMenu"
        @pane-context-menu="onPaneContextMenu"
        @nodes-initialized="onGraphLoaded"
      >
        <Background :gap="24" pattern-color="#e8e8e8" />
        <Controls :show-interactive="false" position="bottom-right" />

        <!-- 编辑模式提示 -->
        <template v-if="editable">
          <div class="edit-hint">
            <span>拖拽调整 · 拖出连线 · <kbd>Delete</kbd> 删除 · 右键编辑</span>
          </div>
        </template>
      </VueFlow>

      <!-- 节点调色板（编辑模式） -->
      <div
        v-if="editable"
        class="node-palette"
        :class="{ collapsed: paletteCollapsed }"
      >
        <div
          class="palette-header"
          @click="paletteCollapsed = !paletteCollapsed"
        >
          <span>节点面板</span>
          <span class="palette-toggle">{{
            paletteCollapsed ? '▶' : '◀'
          }}</span>
        </div>
        <div v-show="!paletteCollapsed" class="palette-body">
          <div
            v-for="group in NODE_TYPE_GROUPS"
            :key="group.label"
            class="palette-group"
          >
            <div class="palette-group-label">{{ group.label }}</div>
            <div
              v-for="type in group.types"
              :key="type"
              class="palette-item"
              @click="addNode(type)"
            >
              <span
                class="palette-dot"
                :style="{ background: TYPE_COLOR_MAP[type] }"
              />
              <span>{{ TYPE_LABEL_MAP[type] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右键菜单 -->
      <div
        v-if="contextMenu.visible"
        class="ctx-menu"
        :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      >
        <template v-if="contextMenu.node">
          <div class="ctx-item" @click="onCtxEdit">✏️ 编辑属性</div>
          <div class="ctx-item ctx-danger" @click="onCtxDelete">
            🗑️ 删除节点
          </div>
        </template>
        <template v-else>
          <div class="ctx-item disabled">空白区域</div>
        </template>
      </div>

      <!-- 节点编辑弹窗 -->
      <a-modal
        v-model:open="editorVisible"
        :width="480"
        cancel-text="取消"
        destroy-on-close
        ok-text="保存"
        title="编辑节点"
        @ok="saveEditor"
      >
        <a-form layout="vertical">
          <a-form-item label="节点名称" required>
            <a-input
              v-model:value="editorForm.label"
              placeholder="输入节点名称"
            />
          </a-form-item>
          <a-form-item label="节点类型" required>
            <a-select v-model:value="editorForm.nodeType">
              <a-select-option
                v-for="opt in nodeTypeOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="审批人">
            <a-input
              v-model:value="editorForm.approver"
              placeholder="审批人姓名（可选）"
            />
          </a-form-item>
          <a-form-item label="描述">
            <a-textarea
              v-model:value="editorForm.description"
              :rows="2"
              placeholder="节点描述（可选）"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-spin>
  </div>
</template>

<style scoped lang="less">
// ==========================================================
// 设计系统 — Editorial Minimal
// ==========================================================
@font-stack:
  'PingFang SC',
  'Microsoft YaHei',
  'Noto Sans SC',
  system-ui,
  -apple-system,
  sans-serif;

@color-bg: #f8f9fb;
@color-border: #e4e7ec;
@color-border-strong: #d0d5dd;
@color-text: #111;
@color-text-secondary: #555;
@color-text-muted: #aaa;

// ==========================================================
// Spin 容器
// ==========================================================
:deep(.ant-spin-nested-loading) {
  height: 100%;
}
:deep(.ant-spin-container) {
  height: 100%;
}

// ==========================================================
// 编辑模式提示
// ==========================================================
.edit-hint {
  position: absolute;
  left: 170px;
  top: 12px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  border: 1px solid @color-border;
  font-size: 11px;
  font-family: @font-stack;
  color: @color-text-secondary;
  padding: 5px 11px;

  kbd {
    display: inline-block;
    background: #f0f2f5;
    border-radius: 3px;
    border: 1px solid @color-border-strong;
    font-family: inherit;
    font-size: 10px;
    line-height: 1;
    padding: 1px 4px;
    margin: 0 1px;
    color: @color-text;
  }
}

// ==========================================================
// VueFlow 主题覆盖
// ==========================================================
:deep(.vue-flow__node) {
  cursor: pointer;
}

:deep(.vue-flow__node .node-card) {
  transition: border-color 0.15s ease;

  &:hover {
    border-color: @color-border-strong;
  }
}

:deep(.vue-flow__handle) {
  background: #d0d5dd;
  border: 1.5px solid #fff;
  width: 7px;
  height: 7px;
  transition: background 0.15s;

  &:hover {
    background: #88909c;
  }
}

:deep(.vue-flow__edge-path) {
  stroke: #c0c6d0;
  stroke-width: 1.5;
}

:deep(.vue-flow__background) {
  background-color: @color-bg;
}

// ==========================================================
// 节点调色板
// ==========================================================
.node-palette {
  position: absolute;
  left: 14px;
  bottom: 52px;
  z-index: 10;
  width: 148px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid @color-border;
  font-size: 12px;
  font-family: @font-stack;
  overflow: hidden;
  user-select: none;

  &.collapsed {
    width: auto;

    .palette-body {
      display: none;
    }
  }

  .palette-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 11px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    color: @color-text;
    border-bottom: 1px solid #f0f2f5;
    background: #fafbfc;
    letter-spacing: 0.2px;

    .palette-toggle {
      font-size: 9px;
      color: #c0c6d0;
    }
  }

  .palette-body {
    padding: 6px;
  }

  .palette-group {
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }

    .palette-group-label {
      font-size: 10px;
      color: #c0c6d0;
      font-weight: 500;
      padding: 0 6px 3px;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }

    .palette-item {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 5px 7px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.12s;
      color: @color-text-secondary;
      font-size: 12px;

      &:hover {
        background: #f0f2f5;
        color: @color-text;
      }

      .palette-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
      }
    }
  }
}

// ==========================================================
// 右键菜单
// ==========================================================
.ctx-menu {
  position: fixed;
  z-index: 1000;
  background: #fff;
  border-radius: 6px;
  border: 1px solid @color-border;
  min-width: 130px;
  padding: 4px 0;
  font-size: 12px;
  font-family: @font-stack;

  .ctx-item {
    padding: 6px 12px;
    cursor: pointer;
    transition: background 0.1s;
    color: @color-text-secondary;

    &:hover {
      background: #f0f2f5;
      color: @color-text;
    }

    &.ctx-danger:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    &.disabled {
      color: #d0d5dd;
      cursor: default;

      &:hover {
        background: transparent;
      }
    }
  }
}
</style>
