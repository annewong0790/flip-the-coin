<script setup lang="ts">
import { computed } from 'vue'

const HEADS_SYMBOL = '$'
const TAILS_SYMBOL = 'I'

const props = defineProps<{
  result: 'Heads' | 'Tails' | null
  isFlipping: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'flip'): void
}>()

const coinSymbol = computed(() => {
  if (props.result === null) {
    return ''
  }

  if (props.result === 'Tails') {
    return TAILS_SYMBOL
  }

  return HEADS_SYMBOL
})
</script>

<template>
  <button
    type="button"
    class="coin-button"
    :class="{ flipping: isFlipping }"
    :disabled="props.disabled"
    aria-label="Flip Coin"
    @click="emit('flip')"
  >
    <span class="coin" :data-symbol="coinSymbol" aria-hidden="true"></span>
  </button>
</template>
