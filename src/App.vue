<template>
  <a-config-provider :locale="locale">
    <a-layout style="min-height: 100vh">
      <a-layout-sider
        v-if="!isProd"
        v-model:collapsed="collapsed"
        style="background: #fff"
      >
        <a-menu
          v-model:selected-keys="selectedKeys"
          mode="inline"
          @click="onItemClick"
        >
          <a-menu-item v-for="menu in routes" :key="menu.path">
            {{ menu.meta.title }}
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <div
            :style="{
              padding: '1px',
              background: '#fff',
              height: '100vh',
              minHeight: '350px',
            }"
          >
            <router-view></router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import type { MenuItem } from 'ant-design-vue'

import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { routes } from '@/router/router.config'

import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
const locale = ref(zhCN)
const router = useRouter()
const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>([])
const isProd = import.meta.env.PROD //是否为生产环境

const onItemClick = ({ key }: typeof MenuItem) => {
  router.push(key as string)
}
</script>

<style scoped lang="less"></style>
