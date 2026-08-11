import { ref } from 'vue'

const isDark = ref(document.documentElement.dataset.theme !== 'light')

function apply() {
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
}

function toggle() {
  isDark.value = !isDark.value
  apply()
}

export function useTheme() {
  return { isDark, toggle }
}
