import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface User {
  name: string;
  id: number;
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
        // 提取 token 和 user 数据
        const { token: tokenValue, user: userData } = response.data.data;

        // 确保 user 数据符合类型定义
        const { name, id } = userData;

        // 更新状态
        user.value = { name, id };
        token.value = tokenValue;

        // 存储到 localStorage
        localStorage.setItem('user', JSON.stringify(user.value));
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
        // 注册成功返回 true
        return true;
      } else {
        console.error('注册失败:', response.data.message);
        alert(`注册失败: ${response.data.message}`);
        // 注册失败返回 false
        return false;
      }
    } catch (error: any) {
      handleApiError(error, '注册失败');
    }
  };

  /**
   * 用户更新密码方法
   * 
   * 如果用户已登录，直接从存储中读取用户名，而不是手动传入。
   * @param oldPassword 当前密码
   * @param newPassword 新密码
   */
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      // 从 localStorage 获取用户数据
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        console.error('更新密码失败：用户数据不存在');
        alert('更新密码失败：请先登录');
        return false;
      }

      // 解析用户数据
      let username: string | undefined;
      try {
        const parsedUser = JSON.parse(storedUser); // 解析 JSON 数据
        username = parsedUser.name; // 获取用户名
      } catch (parseError) {
        console.error('解析用户数据失败:', parseError);
        alert('更新密码失败：用户数据无效，请重新登录');
        return false;
      }

      if (!username) {
        console.error('更新密码失败：用户名不存在');
        alert('更新密码失败：请先登录');
        return false;
      }


    // 打印调试信息
    console.info('准备调用更新密码 API，传递的参数:', {
      username,
      oldPassword,
      newPassword,
    });

      // 调用更新密码的 API
      const response = await axios.post('http://localhost:10001/user/updatePassword', {
        username,
        oldPassword,
        newPassword,
      });

      if (response.data.code === 0) {
        console.log('密码更新成功');
        alert('密码更新成功，请重新登录');
        return true;
      } else {
        console.error('密码更新失败:', response.data.message);
        alert(`密码更新失败: ${response.data.message}`);
        return false;
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
      // 调用后端找回密码 API
      const response = await axios.post('http://localhost:10001/user/resetPassword', {
        username,
        newPassword,
      });

      if (response.data.code === 0) {
        console.log('密码找回成功');
        // 找回密码成功返回 true
        return true;
      } else {
        console.error('密码找回失败:', response.data.message);
        alert(`密码找回失败: ${response.data.message}`);
        return false;
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