import { onUnmounted, ref } from 'vue'

export function useTypewriter(fullText: string, opts: { speedMs?: number } = {}) {
  const speedMs = opts.speedMs ?? 32
  const text = ref('')
  const done = ref(false)

  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let timer: ReturnType<typeof setInterval> | null = null

  if (reduceMotion) {
    text.value = fullText
    done.value = true
  } else {
    let i = 0
    timer = setInterval(() => {
      i++
      text.value = fullText.slice(0, i)
      if (i >= fullText.length) {
        done.value = true
        if (timer) clearInterval(timer)
      }
    }, speedMs)
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { text, done }
}
