<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue: { type: Number, required: true },
  colors: { type: Array, required: true }
})
const emit = defineEmits(['update:model-value'])

const currentColor = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  }
})
</script>

<template>
  <ul class="colors colors--black">
    <li v-for="(color, index) of colors" :key="index" class="colors__item">
      <label class="colors__label">
        <input
          v-model="currentColor"
          class="colors__radio sr-only"
          type="radio"
          :value="index"
          :aria-label="color.color.title"
        />
        <span
          class="colors__value"
          :style="{
            backgroundColor: color.color.code,
            border: color.color.code === '#ffffff' ? '1px solid gray' : null
          }"
        >
        </span>
      </label>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '../styles/mixins';
@import '../styles/variables';
.colors {
  @include ulres;
  --border-color: #fff;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &--black {
    --border-color: #222;
  }
}

.colors__item {
  &:not(:last-child) {
    margin-right: 4px;
  }
}

.colors__label {
  position: relative;
  cursor: pointer;
  display: block;
  border-radius: 50%;
  padding: 3px;
}

.colors__value {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: $transition;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid transparent;
    transition: $transition;
  }
}

.colors__label:hover .colors__value::before,
.colors__label:focus .colors__value::before,
.colors__radio:checked ~ .colors__value::before {
  border-color: var(--border-color);
}

.colors__radio:focus ~ .colors__value::before {
  opacity: 0.7;
}
</style>
