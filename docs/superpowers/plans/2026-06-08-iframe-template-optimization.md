# iframeMode Template Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add DX tooling (ESLint, Git hooks, commitlint), fix code quality issues, and unify Composition API patterns in the iframeMode Vue 3 template.

**Architecture:** Minimal-invasion approach — add dev dependencies and config files without restructuring source directories. Fix 3 bugs (resize listener leak, missing lodash, unregistered devtools). Refactor 2 components from Options API to `<script setup lang="ts">`. No runtime behavior changes.

**Tech Stack:** Vue 3 + TypeScript + Vite 5 + Ant Design Vue 4. ESLint 9 flat config + typescript-eslint v8. Husky 9 + lint-staged + commitlint.

---

### Task 1: Install Dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Add dev dependencies to package.json**

Replace current `devDependencies` block with:

```json
  "devDependencies": {
    "@commitlint/cli": "^19.3.0",
    "@commitlint/config-conventional": "^19.2.2",
    "@eslint/js": "^9.3.0",
    "@tsconfig/node18": "^18.2.2",
    "@types/node": "^18.19.3",
    "@vitejs/plugin-vue": "^4.5.2",
    "@vitejs/plugin-vue-jsx": "^3.1.0",
    "@vue/tsconfig": "^0.5.0",
    "eslint": "^9.3.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-perfectionist": "^2.10.0",
    "eslint-plugin-vue": "^9.26.0",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.2",
    "prettier": "^3.2.5",
    "typescript": "~5.3.0",
    "typescript-eslint": "^8.0.0-alpha.20",
    "vite": "^5.0.10",
    "vite-plugin-vue-devtools": "^7.2.1",
    "vue-tsc": "^1.8.25"
  }
```

Remove `npm-run-all2` from devDependencies entirely.

- [ ] **Step 2: Run install**

```bash
cd D:\project\iframeMode-template
npm install
```

Expected: All packages install cleanly, `npm-run-all2` is gone from `node_modules`.

---

### Task 2: ESLint Flat Config

**Files:**

- Create: `eslint.config.js`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Create eslint.config.js**

New file `D:\project\iframeMode-template\eslint.config.js`:

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import perfectionist from 'eslint-plugin-perfectionist'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', '*.config.*'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ['src/**/*.ts', 'src/**/*.vue'],
  })),
  {
    files: ['src/**/*.ts', 'src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        extraFileExtensions: ['.vue'],
      },
    },
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  perfectionist.configs['recommended-alphabetical'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          'newlines-between': 'always',
          'internal-pattern': ['@/**'],
        },
      ],
    },
  },
  prettier,
)
```

- [ ] **Step 2: Update package.json scripts**

Replace the scripts block in package.json:

```json
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --build --force && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --build --force",
    "lint": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,vue,css,less}\""
  },
```

Remove the `build-only` script — it's no longer needed since `run-p` is gone.

- [ ] **Step 3: Verify ESLint runs**

```bash
cd D:\project\iframeMode-template
npx eslint . --fix
```

Expected: Clean run (0 errors, 0 warnings, or only pre-existing warnings like `@typescript-eslint/no-explicit-any`).

---

### Task 3: Git Hooks + Commitlint + Lint-Staged

**Files:**

- Create: `commitlint.config.js`
- Create: `lint-staged.config.js`
- Create: `.husky/pre-commit`
- Create: `.husky/commit-msg`

- [ ] **Step 1: Create commitlint.config.js**

New file `D:\project\iframeMode-template\commitlint.config.js`:

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'revert',
      ],
    ],
    'subject-case': [0],
  },
}
```

- [ ] **Step 2: Create lint-staged.config.js**

New file `D:\project\iframeMode-template\lint-staged.config.js`:

```js
export default {
  '*.{ts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{css,less,md}': ['prettier --write'],
}
```

- [ ] **Step 3: Initialize husky and create hooks**

```bash
cd D:\project\iframeMode-template
npx husky init
```

This creates `.husky/` directory with a `pre-commit` file. Then overwrite the hooks:

`.husky/pre-commit`:

```bash
npx lint-staged
```

`.husky/commit-msg`:

```bash
npx --no -- commitlint --edit $1
```

Make hooks executable on Windows (they already are if husky init ran).

- [ ] **Step 4: Verify hooks are registered**

```bash
cd D:\project\iframeMode-template
npx husky
```

Expected: Lists `pre-commit` and `commit-msg` as active hooks.

---

### Task 4: Vite Config Updates

**Files:**

- Modify: `vite.config.ts`

- [ ] **Step 1: Register VueDevTools and add proxy**

Replace content of `vite.config.ts`:

```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

---

### Task 5: Environment Config

**Files:**

- Create: `.env.development`
- Modify: `package.json` (engines)

- [ ] **Step 1: Create .env.development**

New file `D:\project\iframeMode-template\.env.development`:

```
VITE_BASE_URL=/api
```

- [ ] **Step 2: Add engines to package.json**

Add this block after `"type": "module",` in package.json:

```json
  "engines": {
    "node": ">=18.0.0"
  },
```

---

### Task 6: Refactor ModalDialog.vue → Composition API

**Files:**

- Modify: `src/components/ModalDialog.vue`

- [ ] **Step 1: Rewrite ModalDialog.vue with `<script setup lang="ts">`**

Replace the entire file:

```vue
<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    class="modal-dialog-wrapper"
    cancelText="取消"
    okText="确定"
    @ok="onConfirm"
    @cancel="onCancel"
  >
    <div :style="{ maxHeight: '80vh' }">
      <slot name="content"></slot>
    </div>
    <template v-for="(value, name) in slots" #[name]="slotData">
      <slot v-if="name !== 'content'" :name="name" v-bind="slotData"></slot>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, useSlots } from 'vue'

defineOptions({ name: 'ModalDialog' })

const props = withDefaults(
  defineProps<{
    title?: string
    contentHeight?: string
    width?: string
  }>(),
  {
    title: '操作',
    contentHeight: '30vh',
    width: '',
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const slots = useSlots()
const visible = ref(false)

function toggle() {
  visible.value = !visible.value
  return Promise.resolve(visible.value)
}

function show() {
  visible.value = true
  return Promise.resolve(true)
}

function close() {
  visible.value = false
  return Promise.resolve(false)
}

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  visible.value = false
  emit('cancel')
}

defineExpose({ show, close, toggle })
</script>
```

Note: Template section stays identical. Only script block changes from Options API to `<script setup lang="ts">`.

---

### Task 7: Refactor DrawerDialog.vue → Composition API

**Files:**

- Modify: `src/components/DrawerDialog.vue`

- [ ] **Step 1: Rewrite DrawerDialog.vue with `<script setup lang="ts">`**

Replace the file:

```vue
<template>
  <a-drawer
    :width="width"
    v-model:visible="visible"
    :title="title"
    class="drawer-dialog-wrapper"
    @close="onCancel"
  >
    <template #extra>
      <a-space>
        <a-button @click="onCancel">取消</a-button>
        <a-button @click="onConfirm" type="primary">确定</a-button>
      </a-space>
    </template>
    <div>
      <slot name="content"></slot>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'DrawerDialog' })

withDefaults(
  defineProps<{
    width?: number
    title?: string
    contentHeight?: string
  }>(),
  {
    width: 378,
    title: '操作',
    contentHeight: '100vh',
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = ref(false)

function toggle() {
  visible.value = !visible.value
  return Promise.resolve(visible.value)
}

function show() {
  visible.value = true
  return Promise.resolve(true)
}

function close() {
  visible.value = false
  return Promise.resolve(false)
}

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  visible.value = false
  emit('cancel')
}

defineExpose({ show, close, toggle })
</script>

<style lang="less" scoped>
.drawer-dialog-wrapper {
  ::deep(.ant-drawer-body) {
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    -moz-scrollbar: none;
    -ms-overflow-style: none;
  }
}
</style>
```

Note: Template and `<style>` sections identical. Only script block changes.

---

### Task 8: Fix BasicChart.vue Resize Listener Leak

**Files:**

- Modify: `src/components/BasicChart.vue`

- [ ] **Step 1: Fix the window resize listener**

In `BasicChart.vue`, change the `init()` function and `onBeforeUnmount` hook:

Current problem (lines 89-91 and 130-132):

```ts
// init() — anonymous function, can't be removed
window.addEventListener('resize', () => {
  echartInstance.resize()
})

// onBeforeUnmount — different anonymous function, removal ineffective
window.removeEventListener('resize', () => {
  echartInstance.resize()
})
```

Fix — store resize handler as named variable in module scope:

Replace the `init` function and `onBeforeUnmount`:

```ts
// Replace the section after init() declaration:
let echartInstance: any = null
let timer: any = null
let resizeHandler: (() => void) | null = null

const init = async () => {
  echartInstance = useEcharts(comChart.value as HTMLDivElement)
  echartInstance.on('finished', () => {
    setTimeout(() => {
      spinning.value = false
    }, 100)
  })

  //触发点击事件
  echartInstance.getZr().on('click', (params: any) => {
    //获取点击位置的像素坐标
    const pointInPixel = [params.offsetX, params.offsetY]
    if (echartInstance.containPixel('grid', pointInPixel)) {
      emit('onAxisClick', params)
    }
  })
  resizeHandler = () => {
    echartInstance.resize()
  }
  window.addEventListener('resize', resizeHandler)
  echartInstance.setOption(await props.option)
}
```

And:

```ts
onBeforeUnmount(() => {
  clearTimeout(timer)
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  echartInstance && disposeDom()
})
```

Also remove the `import { dispose }` line at top if not used elsewhere (it IS used in `disposeDom()`, keep it).

Full replacement file `src/components/BasicChart.vue`:

```vue
<template>
  <a-spin :spinning="spinning" size="large">
    <div id="comChart" ref="comChart" :style="style" />
  </a-spin>
</template>

<script lang="ts" setup>
import { dispose } from 'echarts/core'
import useEcharts from '@/hooks/useEcharts'

import {
  type HTMLAttributes,
  onActivated,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  withDefaults,
} from 'vue'
import type { chartOption } from '@/types/echarts'

interface Props {
  option: chartOption | any
  styleOp?: any
}

interface Emit {
  (e: 'onAxisClick', params: any): void
}

const props = withDefaults(defineProps<Props>(), {
  option: () => {
    return {}
  },
  styleOp: () => {
    return {}
  },
})
const emit = defineEmits<Emit>()
const style = ref<HTMLAttributes>(props.styleOp)
const comChart = ref<HTMLDivElement | null>(null)
const spinning = ref<boolean>(true)

watch(
  () => props.option,
  (value) => {
    if (echartInstance) {
      echartInstance.setOption(value, true)
    } else {
      init()
    }
  },
)

let echartInstance: any = null
let timer: any = null
let resizeHandler: (() => void) | null = null

const init = async () => {
  echartInstance = useEcharts(comChart.value as HTMLDivElement)
  echartInstance.on('finished', () => {
    setTimeout(() => {
      spinning.value = false
    }, 100)
  })

  //触发点击事件
  echartInstance.getZr().on('click', (params: any) => {
    //获取点击位置的像素坐标
    const pointInPixel = [params.offsetX, params.offsetY]
    if (echartInstance.containPixel('grid', pointInPixel)) {
      emit('onAxisClick', params)
    }
  })
  resizeHandler = () => {
    echartInstance.resize()
  }
  window.addEventListener('resize', resizeHandler)
  echartInstance.setOption(await props.option)
}

const disposeDom = () => {
  echartInstance && dispose(comChart.value as HTMLElement)
  echartInstance = null
}

const updateOption = (data: chartOption | any, opt = {}) => {
  echartInstance?.setOption(data, opt)
}

const resize = () => {
  echartInstance.resize()
}

const setWidth = () => {
  //  const dom = document.querySelector('#comChart')
}

defineExpose({
  disposeDom,
  echartInstance,
  init,
  updateOption,
  resize,
  setWidth,
})

onMounted(() => {
  init()
})

onActivated(() => {
  // resize()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  echartInstance && disposeDom()
})
</script>

<style lang="less" scoped></style>
```

---

### Task 9: Replace lodash in useTreeShowWatcher.ts

**Files:**

- Modify: `src/hooks/useTreeShowWatcher.ts`

- [ ] **Step 1: Replace lodash import with local isArray**

Replace the entire file content:

```ts
import { inject, nextTick, type Ref, watch } from 'vue'
import type BasicChart from 'src/components/BasicChart.vue'

/**
 * 混入echarts手动更新布局方法
 * @param chart echarts实例
 */
export const useTreeShowWatcher = (
  chart: Ref<InstanceType<typeof BasicChart> | undefined>,
) => {
  const isShowTree: Ref<boolean> | undefined = inject('isShowTree')
  watch(
    () => isShowTree?.value,
    () => {
      nextTick(() => {
        if (Array.isArray(chart.value)) {
          chart.value?.map((item) => {
            item.resize()
          })
        } else {
          chart.value?.resize()
        }
      })
    },
  )
}
```

Key change: `import { isArray } from 'lodash'` → native `Array.isArray()`.

---

### Task 10: Final Verification

- [ ] **Step 1: Type check**

```bash
cd D:\project\iframeMode-template
npx vue-tsc --build --force
```

Expected: Clean pass, no errors.

- [ ] **Step 2: Lint**

```bash
cd D:\project\iframeMode-template
npx eslint . --fix
```

Expected: Clean run. May have some `@typescript-eslint/no-explicit-any` warnings on pre-existing `any` types — these are expected and acceptable.

- [ ] **Step 3: Build**

```bash
cd D:\project\iframeMode-template
npx vite build
```

Expected: Build succeeds, output in `dist/`.

- [ ] **Step 4: Dev server**

```bash
cd D:\project\iframeMode-template
npx vite
```

Expected: Dev server starts on http://localhost:5173. Vue DevTools icon visible in browser.

- [ ] **Step 5: Commit hooks test**

```bash
cd D:\project\iframeMode-template
git add -A
git commit -m "test: verify commit hook"
```

Expected: lint-staged runs ESLint + Prettier on staged files, then commitlint passes message.
