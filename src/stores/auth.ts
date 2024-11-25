import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface User {
  name: string;
  id: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const router = useRouter();

  /**
   * 用户登录方法
   * @param username 用户名
   * @param password 密码
   */
  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:10001/user/login', { username, password });

      if (response.data.code === 0) {
        user.value = response.data.user;
        token.value = response.data.token;
        localStorage.setItem('token', token.value);
        console.log('登录成功');
        return true;
      } else {
        console.error('登录失败:', response.data.message);
        alert(`登录失败: ${response.data.message}`);
        return false;
      }
    } catch (error: any) {
      handleApiError(error, '登录失败');
    }
  };

  /**
   * 用户注册方法
   * @param username 用户名
   * @param password 密码
   */
  const register = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:10001/user/register', { username, password });

      if (response.data.code === 0) {
        console.log('用户注册成功');
        alert('注册成功，请登录！');
        router.push('/login');
      } else {
        console.error('注册失败:', response.data.message);
        alert(`注册失败: ${response.data.message}`);
      }
    } catch (error: any) {
      handleApiError(error, '注册失败');
    }
  };

  /**
   * 用户更新密码方法
   * @param username 用户名
   * @param oldPassword 当前密码
   * @param newPassword 新密码
   */
  const updatePassword = async (username: string, oldPassword: string, newPassword: string) => {
    try {
      const response = await axios.post('http://localhost:10001/user/updatePassword', {
        username,
        oldPassword,
        newPassword,
      });

      if (response.data.code === 0) {
        console.log('密码更新成功');
        alert('密码更新成功，请重新登录');
        logout();
      } else {
        console.error('密码更新失败:', response.data.message);
        alert(`密码更新失败: ${response.data.message}`);
      }
    } catch (error: any) {
      handleApiError(error, '密码更新失败');
    }
  };

  /**
   * 用户找回密码方法
   * @param username 用户名
   * @param newPassword 新密码
   */
  const resetPassword = async (username: string, newPassword: string) => {
    try {
      const response = await axios.post('http://localhost:10001/user/resetPassword', {
        username,
        newPassword,
      });

      if (response.data.code === 0) {
        console.log('密码找回成功');
        alert('密码已成功重置，请使用新密码登录');
        router.push('/login');
      } else {
        console.error('密码找回失败:', response.data.message);
        alert(`密码找回失败: ${response.data.message}`);
      }
    } catch (error: any) {
      handleApiError(error, '密码找回失败');
    }
  };

  /**
   * API 错误处理函数
   * @param error 错误对象
   * @param context 错误上下文
   */
  const handleApiError = (error: any, context: string) => {
    const errorMessage = error.response?.data?.message || error.message || '未知错误';
    console.error(`${context}失败:`, errorMessage);
    alert(`${context}失败: ${errorMessage}`);
  };

  /**
   * 用户登出方法
   */
  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    router.push('/login');
  };

  /**
   * 检查用户认证状态
   */
  const checkAuth = () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      token.value = savedToken;
      // 可以添加后续验证 Token 的逻辑
      console.log('用户已认证');
    } else {
      console.log('用户未登录');
      router.push('/login');
    }
  };

  return {
    user,
    token,
    login,
    register,
    updatePassword,
    resetPassword,
    logout,
    checkAuth,
  };
});