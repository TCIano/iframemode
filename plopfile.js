// @ts-check

/** @param {import('plop').NodePlopAPI} plop */
export default function (plop) {
  // ── API 模块 ──────────────────────────────────────────
  plop.setGenerator('api', {
    actions: (data) => {
      const rawName = String(data?.name || '')
        .trim()
        .replace(/\\/g, '/')
      const segments = rawName.split('/').filter(Boolean)
      const moduleName = segments.at(-1)

      if (!moduleName) throw new Error('模块名不能为空')

      data.name = segments.join('/')
      data.moduleName = moduleName
      const exportPath = data.name

      return [
        {
          path: 'src/api/{{name}}.ts',
          templateFile: 'templates/api/api.hbs',
          type: 'add',
        },
        {
          path: 'src/types/{{name}}.ts',
          templateFile: 'templates/api/types.hbs',
          type: 'add',
        },
        {
          path: 'src/types/index.ts',
          pattern: /$/,
          template: '',
          transform: (fileContent) => {
            // 去重追加：已存在同名 export 则不重复写入
            const line = `export * from './${exportPath}'\n`
            return fileContent.includes(line)
              ? fileContent
              : fileContent.replace(/$/, line)
          },
          type: 'modify',
        },
      ]
    },
    description:
      '生成 API 模块（api/xxx.ts + types/xxx.ts，支持 domain/module）',
    prompts: [
      {
        message: '模块名（如 report 或 system/user）：',
        name: 'name',
        type: 'input',
      },
    ],
  })

  // ── 页面模块 ──────────────────────────────────────────
  plop.setGenerator('page', {
    actions: (data) => {
      const name = data?.name
      if (!name) throw new Error('页面名不能为空')

      return [
        {
          path: 'src/views/{{camelCase name}}/index.vue',
          templateFile: 'templates/page/index.hbs',
          type: 'add',
        },
        {
          path: 'src/views/{{camelCase name}}/components/.gitkeep',
          template: '',
          type: 'add',
        },
      ]
    },
    description: '生成页面骨架（views/xxx/ + components）',
    prompts: [
      { message: '页面名（如 user-list）：', name: 'name', type: 'input' },
    ],
  })

  // ── 通用组件 ──────────────────────────────────────────
  plop.setGenerator('component', {
    actions: (data) => {
      const name = data?.name
      if (!name) throw new Error('组件名不能为空')

      return [
        {
          path: 'src/components/{{pascalCase name}}.vue',
          templateFile: 'templates/component/component.hbs',
          type: 'add',
        },
      ]
    },
    description: '生成通用组件（src/components/xxx.vue）',
    prompts: [
      {
        message: '组件名（PascalCase，如 BasicTable）：',
        name: 'name',
        type: 'input',
      },
    ],
  })
}
