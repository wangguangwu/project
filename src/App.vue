<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

onMounted(() => {
  auth.checkAuth()
})
</script>

<template>
  <router-view></router-view>
</template>