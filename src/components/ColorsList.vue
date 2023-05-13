<script setup>
import { computed } from 'vue'
const props = defineProps(['modelValue', 'colors'])
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
    <li v-for="(color, index) of colors" class="colors__item" :key="color.id">
      <label class="colors__label">
        <input
          class="colors__radio sr-only"
          type="radio"
          :name="color.color.title"
          :value="index"
          v-model="currentColor"
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
.colors {
  @import '../styles/mixins';
  @import '../styles/variables';

  @include ulres;

  --border-color: #fff;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &__item {
    &:not(:last-child) {
      margin-right: 4px;
    }
  }

  &__label {
    position: relative;
    cursor: pointer;
    display: block;
    border-radius: 50%;
    padding: 3px;
  }

  &__value {
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

  &__label:hover &__value::before,
  &__label:focus &__value::before,
  &__radio:checked ~ &__value::before {
    border-color: var(--border-color);
  }

  &__radio:focus ~ &__value::before {
    opacity: 0.7;
  }

  &--black {
    --border-color: #222;
  }
}
</style>
