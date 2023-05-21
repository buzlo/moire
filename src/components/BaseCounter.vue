<script setup>
import { computed } from 'vue'
import { vMaska } from 'maska'

const props = defineProps({ modelValue: { type: Number, required: true } })
const emit = defineEmits(['update:modelValue'])

const count = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <div class="form__counter">
    <button
      type="button"
      aria-label="Убрать один товар"
      :disabled="count === 1"
      @click="count -= 1"
    >
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input
      v-model.number="count"
      v-maska
      data-maska="d"
      data-maska-tokens="d:\d:multiple"
      type="text"
      name="count"
    />

    <button type="button" aria-label="Добавить один товар" @click="count += 1">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
