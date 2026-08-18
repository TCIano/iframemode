import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import ModalDialog from '../ModalDialog.vue'

/** ModalDialog defineExpose 暴露的方法（vue-tsc 下无 *.vue shim，显式声明类型） */
interface DialogInstance {
  show: () => Promise<boolean>
}

describe('ModalDialog', () => {
  it('初始为关闭状态', () => {
    const wrapper = mount(ModalDialog)
    expect(wrapper.find('.ant-modal').exists()).toBe(false)
    wrapper.unmount()
  })

  it('show() 后弹窗显示并渲染标题', async () => {
    const wrapper = mount(ModalDialog, { props: { title: '新建用户' } })
    await (wrapper.vm as DialogInstance).show()
    await nextTick()
    expect(document.body.textContent).toContain('新建用户')
    wrapper.unmount()
  })

  it('确认按钮触发 confirm 事件', async () => {
    const wrapper = mount(ModalDialog)
    await (wrapper.vm as DialogInstance).show()
    await nextTick()
    const okBtn = document.body.querySelector(
      '.ant-btn-primary',
    ) as HTMLButtonElement
    okBtn.click()
    await nextTick()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    wrapper.unmount()
  })
})
