<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// 管理当前显示的表单类型
const formType = ref<'login' | 'register' | 'updatePassword' | 'resetPassword'>('login')

// 表单数据和状态
const name = ref('')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

// 登录逻辑
const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const response = await auth.login(name.value, password.value)
    if (response) {
      success.value = '登录成功'
      router.push('/dashboard')
    } else {
      error.value = '登录失败，请检查用户名和密码'
    }
  } catch (e) {
    error.value = '登录失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 注册逻辑
const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const response = await auth.register(name.value, password.value)
    if (response) {
      success.value = '注册成功，请登录'
      formType.value = 'login'
    } else {
      error.value = '注册失败，请稍后再试'
    }
  } catch (e) {
    error.value = '注册失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 更新密码逻辑
const handleUpdatePassword = async () => {
  if (!name.value || !password.value || !newPassword.value) {
    error.value = '所有字段均不能为空'
    success.value = ''
    return
  }

  loading.value = true
  try {
    const response = await auth.resetPassword(name.value, newPassword.value)
    if (response) {
      success.value = '密码更新成功，请重新登录'
      formType.value = 'login'
    } else {
      error.value = '密码更新失败，请稍后再试'
    }
  } catch (e) {
    error.value = '密码更新失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 找回密码逻辑
const handleResetPassword = async () => {
  if (!name.value || !newPassword.value || !confirmPassword.value) {
    error.value = '所有字段均不能为空'
    success.value = ''
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = '两次输入的新密码不一致'
    success.value = ''
    return
  }

  loading.value = true
  try {
    const response = await auth.resetPassword(name.value, newPassword.value)
    if (response) {
      success.value = '密码重置成功，请重新登录'
      formType.value = 'login'
    } else {
      error.value = '密码重置失败，请稍后再试'
    }
  } catch (e) {
    error.value = '密码重置失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 切换表单逻辑
const switchForm = (type: 'login' | 'register' | 'updatePassword' | 'resetPassword') => {
  formType.value = type
  error.value = ''
  success.value = ''
}

// 重置表单数据
const resetForm = () => {
  name.value = ''
  password.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  error.value = ''
  success.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ formType === 'login' ? '登录' : formType === 'register' ? '注册' : formType === 'updatePassword' ? '更新密码' : '找回密码' }}
        </h2>
      </div>

      <!-- 登录表单 -->
      <form v-if="formType === 'login'" @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2 required">用户名</label>
          <input id="name" v-model="name" type="text" required class="auth-input" :disabled="loading" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2 required">密码</label>
          <input id="password" v-model="password" type="password" required class="auth-input" :disabled="loading" />
        </div>
        <div v-if="error" class="text-error text-sm text-center">{{ error }}</div>
        <div v-if="success" class="text-success text-sm text-center">{{ success }}</div>
        <div class="flex gap-4">
          <button type="submit" class="primary-button" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
          <button type="button" class="secondary-button" @click="resetForm" :disabled="loading">
            重置
          </button>
        </div>
        <div class="mt-4 text-center">
          <button class="text-sm text-blue-500 hover:text-blue-600" @click="switchForm('register')">
            没有账户？立即注册
          </button>
        </div>
        <div class="mt-2 text-center">
          <button class="text-sm text-blue-500 hover:text-blue-600" @click="switchForm('resetPassword')">
            忘记密码？找回密码
          </button>
        </div>
      </form>

      <!-- 找回密码表单 -->
      <form v-else-if="formType === 'resetPassword'" @submit.prevent="handleResetPassword" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2 required">用户名</label>
          <input id="name" v-model="name" type="text" required class="auth-input" :disabled="loading" />
        </div>
        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2 required">新密码</label>
          <input id="newPassword" v-model="newPassword" type="password" required class="auth-input"
            :disabled="loading" />
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2 required">确认新密码</label>
          <input id="confirmPassword" v-model="confirmPassword" type="password" required class="auth-input"
            :disabled="loading" />
        </div>
        <div v-if="error" class="text-error text-sm text-center">{{ error }}</div>
        <div v-if="success" class="text-success text-sm text-center">{{ success }}</div>
        <div class="flex gap-4">
          <button type="submit" class="primary-button" :disabled="loading">
            {{ loading ? '重置中...' : '重置密码' }}
          </button>
          <button type="button" class="secondary-button" @click="resetForm" :disabled="loading">
            重置
          </button>
        </div>
        <div class="mt-4 text-center">
          <button class="text-sm text-blue-500 hover:text-blue-600" @click="switchForm('login')">
            返回登录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>