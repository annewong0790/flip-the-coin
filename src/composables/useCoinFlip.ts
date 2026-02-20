import { onBeforeUnmount, ref, type Ref } from 'vue'

export type CoinSide = 'Heads' | 'Tails'
export type CoinResult = CoinSide | null

type UseCoinFlipResult = {
  result: Ref<CoinResult>
  isFlipping: Ref<boolean>
  flipCoin: () => void
}

const DEFAULT_FLIP_DURATION_MS = 700

type CoinFlipEnvironment = {
  prefersReducedMotion: () => boolean
  scheduleFrame: (callback: () => void) => void
  scheduleTimeout: (callback: () => void, delayMs: number) => number
  clearScheduledTimeout: (id: number) => void
}

const createBrowserEnvironment = (): CoinFlipEnvironment => {
  return {
    prefersReducedMotion: () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    },
    scheduleFrame: (callback) => {
      requestAnimationFrame(callback)
    },
    scheduleTimeout: (callback, delayMs) => {
      return window.setTimeout(callback, delayMs)
    },
    clearScheduledTimeout: (id) => {
      window.clearTimeout(id)
    },
  }
}

export const useCoinFlip = (): UseCoinFlipResult => {
  const env = createBrowserEnvironment()
  const result = ref<CoinResult>(null)
  const isFlipping = ref(false)
  let flipAnimationTimeout: number | null = null

  const clearFlipTimeout = (): void => {
    if (flipAnimationTimeout !== null) {
      env.clearScheduledTimeout(flipAnimationTimeout)
      flipAnimationTimeout = null
    }
  }

  const flipCoin = (): void => {
    if (isFlipping.value) {
      return
    }

    const nextResult: CoinSide = Math.random() < 0.5 ? 'Heads' : 'Tails'

    clearFlipTimeout()
    result.value = null

    if (env.prefersReducedMotion()) {
      isFlipping.value = false
      result.value = nextResult
      return
    }

    isFlipping.value = false
    env.scheduleFrame(() => {
      isFlipping.value = true
    })

    flipAnimationTimeout = env.scheduleTimeout(() => {
      isFlipping.value = false
      result.value = nextResult
    }, DEFAULT_FLIP_DURATION_MS)
  }

  onBeforeUnmount(() => {
    clearFlipTimeout()
  })

  return { result, isFlipping, flipCoin }
}
