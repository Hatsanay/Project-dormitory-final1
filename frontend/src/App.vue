<script setup>
import { useColorModes } from '@coreui/vue';
import { onBeforeMount } from 'vue';

import { useThemeStore } from '@/stores/theme.js';
// import { useUserStore } from '@/stores/user';


const { isColorModeSet, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme');
const currentTheme = useThemeStore();
// const userStore = useUserStore();

// userStore.initializeAuth();

onBeforeMount(() => {
  const urlParams = new URLSearchParams(window.location.search);
  let theme = urlParams.get('theme');
  if (theme && /^[A-Za-z0-9]+$/.test(theme.trim())) {
    setColorMode(theme.trim());
    return;
  }
  if (!isColorModeSet()) {
    setColorMode(currentTheme.theme);
  }
});
</script>

<template>
  <router-view />
</template>

<style lang="scss">
@import 'styles/style';
@import 'styles/examples';
</style>
