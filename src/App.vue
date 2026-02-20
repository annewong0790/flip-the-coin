<script setup lang="ts">
import Coin from './components/Coin.vue'
import { useCoinFlip } from './composables/useCoinFlip'

const { result, isFlipping, flipCoin } = useCoinFlip()
</script>

<template>
  <main class="coin-app">
    <h1>Flip the coin</h1>
    <p class="subtitle">Press the coin or button to flip the coin</p>
    <Coin
      :result="result"
      :is-flipping="isFlipping"
      :disabled="isFlipping"
      @flip="flipCoin"
    />
    <p class="result" aria-live="polite">{{ result ?? '\u00A0' }}</p>
    <button type="button" :disabled="isFlipping" @click="flipCoin">FLIP COIN</button>
  </main>
</template>
