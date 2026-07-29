// @ts-check

/** @param {import('plop').NodePlopAPI} plop */
export default function (plop) {
  // ── API 模块 ──────────────────────────────────────────
  plop.setGenerator('api', {
    description: '生成 API 模块（api/xxx.ts + types/xxx.ts）',
    prompts: [
      { type: 'input', name: 'name', message: '模块名（如 report）：' },
    ],
    actions: (data) => {
      const name = data?.name
      if (!name) throw new Error('模块名不能为空')

      return [
        {
          type: 'add',
          path: 'src/api/{{name}}.ts',
          templateFile: 'templates/api/api.hbs',
        },
        {
          type: 'add',
          path: 'src/types/{{name}}.ts',
          templateFile: 'templates/api/types.hbs',
        },
        {
          type: 'modify',
          path: 'src/types/index.ts',
          pattern: /$/,
          template: `export * from './{{name}}'\n`,
          transform: (/** @type {string} */ fileContent) => {
            return fileContent.replace(/$/, `export * from './${name}'\n`)
          },
        },
      ]
    },
  })

  // ── 页面模块 ──────────────────────────────────────────
  plop.setGenerator('page', {
    description: '生成页面（views/xxx/ + hooks + services）',
    prompts: [
      { type: 'input', name: 'name', message: '页面名（如 user-list）：' },
    ],
    actions: (data) => {
      const name = data?.name
      if (!name) throw new Error('页面名不能为空')

      return [
        {
          type: 'add',
          path: 'src/views/{{camelCase name}}/index.vue',
          templateFile: 'templates/page/index.hbs',
        },
        {
          type: 'add',
          path: 'src/views/{{camelCase name}}/hooks/use{{pascalCase name}}.ts',
          templateFile: 'templates/page/hook.hbs',
        },
        {
          type: 'add',
          path: 'src/views/{{camelCase name}}/services/{{camelCase name}}.ts',
          templateFile: 'templates/page/service.hbs',
        },
        {
          type: 'add',
          path: 'src/views/{{camelCase name}}/components/.gitkeep',
          template: '',
        },
      ]
    },
  })

  // ── 通用组件 ──────────────────────────────────────────
  plop.setGenerator('component', {
    description: '生成通用组件（src/components/xxx.vue）',
    prompts: [
      { type: 'input', name: 'name', message: '组件名（PascalCase，如 BasicTable）：' },
    ],
    actions: (data) => {
      const name = data?.name
      if (!name) throw new Error('组件名不能为空')

      return [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}.vue',
          templateFile: 'templates/component/component.hbs',
        },
      ]
    },
  })
}
