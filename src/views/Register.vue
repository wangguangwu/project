<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  try {
    await auth.register(name.value, password.value)
  } catch (e) {
    error.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  name.value = ''
  password.value = ''
  confirmPassword.value = ''
  error.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800">注册</h2>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2 required">
            用户名
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="auth-input"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2 required">
            密码
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="auth-input"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2 required">
            确认密码
          </label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            required
            class="auth-input"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="text-error text-sm text-center">{{ error }}</div>

        <div class="flex gap-4">
          <button type="submit" class="primary-button" :disabled="loading">
            {{ loading ? '注册中...' : '提交' }}
          </button>
          <button type="button" class="secondary-button" @click="handleReset" :disabled="loading">
            重置
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/login" class="text-sm text-blue-500 hover:text-blue-600">
          已有账户？立即登录
        </router-link>
      </div>
    </div>
  </div>
</template>