import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BasicUpload from '../BasicUpload.vue'

function mountUpload(accept?: string) {
  return mount(BasicUpload, {
    global: {
      stubs: {
        AButton: true,
        AUpload: {
          name: 'AUpload',
          props: ['beforeUpload'],
          template: '<div><slot /></div>',
        },
      },
    },
    props: { accept },
  })
}

function getBeforeUpload(wrapper: ReturnType<typeof mountUpload>) {
  return wrapper.findComponent({ name: 'AUpload' }).props('beforeUpload') as (
    file: File,
  ) => boolean
}

describe('BasicUpload', () => {
  it('接受 image/* 规则下的图片 MIME 类型', () => {
    const wrapper = mountUpload()
    const beforeUpload = getBeforeUpload(wrapper)

    beforeUpload(new File(['image'], 'chart.png', { type: 'image/png' }))

    expect(wrapper.emitted('handleUpload')).toHaveLength(1)
    wrapper.unmount()
  })

  it('接受 accept 中声明的扩展名', () => {
    const wrapper = mountUpload('.csv,application/json')
    const beforeUpload = getBeforeUpload(wrapper)

    beforeUpload(new File(['name'], 'users.CSV', { type: '' }))

    expect(wrapper.emitted('handleUpload')).toHaveLength(1)
    wrapper.unmount()
  })
})
