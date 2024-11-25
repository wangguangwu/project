<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// 管理当前显示的表单类型
const formType = ref<'login' | 'register' | 'updatePassword'>('login')

// 表单数据和状态
const name = ref('')
const password = ref('')
const newPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

// 登录逻辑
const handleLogin = async () => {
  // 开始加载
  loading.value = true; 
  // 清空成功消息
  success.value = ''; 
  // 清空错误消息
  error.value = ''; 
  try {
    // 调用登录 API
    const response = await auth.login(name.value, password.value);

    if (response) {
      success.value = '登录成功';
      // 捕获非成功的逻辑
      router.push('/dashboard'); 
    } else {
      // 捕获非成功的逻辑
      error.value = '登录失败，请检查用户名和密码'; 
    }
  } catch (e) {
    error.value = '登录失败，请检查用户名和密码'
  } finally {
    // 捕获非成功的逻辑
    loading.value = false
  }
}

// 注册逻辑
const handleRegister = async () => {
  loading.value = true
  try {
    await auth.register(name.value, password.value)
    success.value = '注册成功，请登录'
    error.value = ''
    // 切换到登录表单
    formType.value = 'login' 
  } catch (e) {
    error.value = '注册失败，请检查用户名是否已存在'
    success.value = ''
  } finally {
    loading.value = false
  }
}

// 找回密码逻辑
const handleUpdatePassword = async () => {
  if (!name.value || !newPassword.value) {
    error.value = '用户名和新密码不能为空'
    success.value = ''
    return
  }

  loading.value = true
  try {
    // 调用找回密码 API
    await auth.resetPassword(name.value, newPassword.value)

    success.value = '密码重置成功，请重新登录'
    error.value = ''
    formType.value = 'login' // 切换回登录表单
  } catch (e) {
    error.value = '密码重置失败，请检查输入或稍后再试'
    success.value = ''
  } finally {
    loading.value = false
  }
}

// 切换表单逻辑
const switchForm = (type: 'login' | 'register' | 'updatePassword') => {
  formType.value = type
  error.value = '' // 清空错误提示
  success.value = '' // 清空成功提示
}

// 重置表单数据
const resetForm = () => {
  name.value = ''
  password.value = ''
  newPassword.value = ''
  error.value = ''
  success.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ formType === 'login' ? '登录' : formType === 'register' ? '注册' : '更新密码' }}
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
          <button class="text-sm text-blue-500 hover:text-blue-600" @click="switchForm('updatePassword')">
            忘记密码？更新密码
          </button>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-else-if="formType === 'register'" @submit.prevent="handleRegister" class="space-y-6">
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
            {{ loading ? '注册中...' : '注册' }}
          </button>
          <button type="button" class="secondary-button" @click="resetForm" :disabled="loading">
            重置
          </button>
        </div>
        <div class="mt-4 text-center">
          <button class="text-sm text-blue-500 hover:text-blue-600" @click="switchForm('login')">
            已有账户？立即登录
          </button>
        </div>
      </form>

      <!-- 更新密码表单 -->
      <form v-else @submit.prevent="handleUpdatePassword" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2 required">用户名</label>
          <input id="name" v-model="name" type="text" required class="auth-input" :disabled="loading" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2 required">当前密码</label>
          <input id="password" v-model="password" type="password" required class="auth-input" :disabled="loading" />
        </div>
        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2 required">新密码</label>
          <input id="newPassword" v-model="newPassword" type="password" required class="auth-input"
            :disabled="loading" />
        </div>
        <div v-if="error" class="text-error text-sm text-center">{{ error }}</div>
        <div v-if="success" class="text-success text-sm text-center">{{ success }}</div>
        <div class="flex gap-4">
          <button type="submit" class="primary-button" :disabled="loading">
            {{ loading ? '更新中...' : '更新密码' }}
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