<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

// 控制更新密码弹窗显示状态
const showUpdatePasswordModal = ref(false)

// 表单数据
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

// 退出登录逻辑
const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    auth.logout()
  }
}

// 更新密码逻辑
const handleUpdatePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = '所有字段都不能为空'
    success.value = ''
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = '两次输入的新密码不一致'
    success.value = ''
    return
  }

  try {
    const response = await auth.updatePassword(oldPassword.value, newPassword.value)
    success.value = '密码更新成功，请重新登录'
    error.value = ''

    if (response) {
      success.value = '密码更新成功';
      // 自动登出
      auth.logout()
    } else {
      // 捕获非成功的逻辑
      error.value = '密码更新失败，请重试';
      success.value = '';
    }
  } catch (e) {
    error.value = '密码更新失败，请检查当前密码或稍后重试'
    success.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold">Dashboard</h1>
          </div>
          <div class="flex items-center">
            <!-- 更新密码按钮 -->
            <button @click="showUpdatePasswordModal = true"
              class="ml-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-900">
              更新密码
            </button>
            <!-- 退出登录按钮 -->
            <button @click="handleLogout" class="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-900">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
          <h2 class="text-2xl font-bold mb-4">欢迎回来，{{ auth.user?.name }}</h2>
          <p>这里是仪表板内容</p>
        </div>
      </div>
    </main>

    <!-- 更新密码弹窗 -->
    <div v-if="showUpdatePasswordModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg w-96 p-6">
        <!-- 标题 -->
        <h3 class="text-xl font-bold mb-4">更新密码</h3>

        <!-- 表单 -->
        <form @submit.prevent="handleUpdatePassword">
          <!-- 当前密码 -->
          <div class="mb-4">
            <label for="oldPassword" class="block text-sm font-medium text-gray-700">当前密码</label>
            <input id="oldPassword" v-model="oldPassword" type="password" required class="auth-input" />
          </div>

          <!-- 新密码 -->
          <div class="mb-4">
            <label for="newPassword" class="block text-sm font-medium text-gray-700">新密码</label>
            <input id="newPassword" v-model="newPassword" type="password" required class="auth-input" />
          </div>

          <!-- 确认新密码 -->
          <div class="mb-4">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">确认新密码</label>
            <input id="confirmPassword" v-model="confirmPassword" type="password" required class="auth-input" />
          </div>

          <!-- 错误和成功消息 -->
          <div v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</div>
          <div v-if="success" class="text-sm text-green-600 mb-4">{{ success }}</div>

          <!-- 按钮 -->
          <div class="flex justify-end">
            <button type="button" @click="closeModal" class="mr-4 btn-secondary">
              取消
            </button>
            <button type="submit" class="btn-primary">
              确认更新
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>