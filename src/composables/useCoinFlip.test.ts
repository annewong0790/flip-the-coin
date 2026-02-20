import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { useCoinFlip } from './useCoinFlip'

let restoreMatchMedia: (() => void) | null = null

const setupMatchMediaMock = (): void => {
  if (typeof window.matchMedia === 'function') {
    const spy = vi.spyOn(window, 'matchMedia')
    restoreMatchMedia = () => spy.mockRestore()
    return
  }

  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn(),
    configurable: true,
    writable: true,
  })
  restoreMatchMedia = () => {
    delete (window as Partial<Window>).matchMedia
  }
}

const mockReduceMotion = (matches: boolean): void => {
  vi.mocked(window.matchMedia).mockReturnValue({ matches } as MediaQueryList)
}

describe('useCoinFlip', () => {
  beforeEach(() => {
    setupMatchMediaMock()
    vi.useFakeTimers()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    restoreMatchMedia?.()
    restoreMatchMedia = null
  })

  it('ignores repeated flips while currently flipping', () => {
    mockReduceMotion(false)
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.2)

    const { flipCoin, isFlipping } = useCoinFlip()
    flipCoin()
    expect(isFlipping.value).toBe(true)
    expect(randomSpy).toHaveBeenCalledTimes(1)

    flipCoin()
    expect(randomSpy).toHaveBeenCalledTimes(1)
  })

  it('returns result immediately when reduced motion is enabled', () => {
    mockReduceMotion(true)
    vi.spyOn(Math, 'random').mockReturnValue(0.2)

    const { flipCoin, isFlipping, result } = useCoinFlip()
    flipCoin()

    expect(isFlipping.value).toBe(false)
    expect(result.value).toBe('Heads')
  })

  it('sets result after 700ms when reduced motion is disabled', () => {
    mockReduceMotion(false)
    vi.spyOn(Math, 'random').mockReturnValue(0.8)

    const { flipCoin, isFlipping, result } = useCoinFlip()
    flipCoin()

    expect(isFlipping.value).toBe(true)
    expect(result.value).toBeNull()

    vi.advanceTimersByTime(700)

    expect(isFlipping.value).toBe(false)
    expect(result.value).toBe('Tails')
  })
})
