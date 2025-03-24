import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light')

  const toggleTheme = (_theme) => {
    theme.value = _theme
  }

  return { theme, toggleTheme }
})
