import type { TFlowEdge, TFlowNode } from '@/types/data-flow'

/**
 * 树布局参数
 */
type TreeLayoutOptions = {
  /** 兄弟节点间距（px） */
  horizontalSpacing?: number
  /** 起始 X 偏移 */
  offsetX?: number
  /** 起始 Y 偏移 */
  startY?: number
  /** 层高间距（px） */
  verticalSpacing?: number
}

/**
 * 根据边关系将节点按树形排列（自上而下）
 *
 * 1. 从 edges 构建父子关系
 * 2. 找根节点（无入边的节点）
 * 3. BFS 计算每个节点的 depth
 * 4. 按 depth 分组 → 分配坐标
 */
export function applyTreeLayout(
  nodes: TFlowNode[],
  edges: TFlowEdge[],
  options: TreeLayoutOptions = {},
): TFlowNode[] {
  if (nodes.length === 0) return nodes

  const {
    horizontalSpacing = 200,
    offsetX = 240,
    startY = 40,
    verticalSpacing = 130,
  } = options

  // 1. 构建父子索引
  const childrenMap = new Map<string, string[]>()
  const parentMap = new Map<string, string>()
  const idSet = new Set(nodes.map((n) => n.id))

  for (const e of edges) {
    if (!idSet.has(e.source) || !idSet.has(e.target)) continue
    if (!childrenMap.has(e.source)) childrenMap.set(e.source, [])
    childrenMap.get(e.source)!.push(e.target)
    parentMap.set(e.target, e.source)
  }

  // 未在 edges 中出现的孤立节点也视为根
  const roots = nodes.filter((n) => !parentMap.has(n.id))

  // 2. BFS 算深度
  const depthMap = new Map<string, number>()
  const queue: Array<{ depth: number; id: string }> = roots.map((r) => ({
    depth: 0,
    id: r.id,
  }))
  let head = 0
  while (head < queue.length) {
    const { depth, id } = queue[head++]
    if (depthMap.has(id)) continue
    depthMap.set(id, depth)
    const kids = childrenMap.get(id) ?? []
    for (const kid of kids) {
      queue.push({ depth: depth + 1, id: kid })
    }
  }

  // fallback：仍未分配到深度的节点平铺到第 0 层
  for (const n of nodes) {
    if (!depthMap.has(n.id)) depthMap.set(n.id, 0)
  }

  // 3. 按 depth 分组
  const depthGroups = new Map<number, string[]>()
  for (const [id, depth] of depthMap) {
    if (!depthGroups.has(depth)) depthGroups.set(depth, [])
    depthGroups.get(depth)!.push(id)
  }

  // 4. 分配坐标
  return nodes.map((n) => {
    const depth = depthMap.get(n.id) ?? 0
    const group = depthGroups.get(depth) ?? []
    const idx = group.indexOf(n.id)
    const half = ((group.length - 1) * horizontalSpacing) / 2

    return {
      ...n,
      position: {
        x: idx * horizontalSpacing - half + offsetX,
        y: depth * verticalSpacing + startY,
      },
    }
  })
}
