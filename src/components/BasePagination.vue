<script setup>
import { computed } from 'vue'

const props = defineProps({modelValue: {type: Number, required: true}, pagesQty: { type: Number, required: true}})
const emit = defineEmits(['update:model-value'])
const page = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  }
})
</script>

<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': page === 1 }"
        href="#"
        aria-label="Предыдущая страница"
        @click.prevent="page -= 1"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li v-for="pageNumber of props.pagesQty" :key="pageNumber" class="pagination__item">
      <a
        class="pagination__link"
        :class="{ 'pagination__link--current': pageNumber === page }"
        href="#"
        :aria-label="'Страница ' + pageNumber"
        @click.prevent="page = pageNumber"
      >
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': page === props.pagesQty }"
        href="#"
        aria-label="Следующая страница"
        @click.prevent="page += 1"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.pagination {
  @import '../styles/variables';
  @import '../styles/mixins';

  @include ulres;

  display: flex;
  align-items: center;
  justify-content: center;

  &__item {
    &:first-child {
      margin-right: 25px;
    }

    &:last-child {
      margin-left: 25px;
    }
  }

  &__link {
    display: block;
    padding: 13px 3px;
    height: 40px;
    min-width: 40px;

    font-size: 16px;
    line-height: 1;
    color: #d1d1d1;
    text-align: center;
    transition: $transition;

    &[href]:not(:disabled):hover,
    &[href]:not(:disabled):focus {
      color: $text-main;
    }

    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--current {
      color: $text-main;
      font-weight: 700;
    }

    &--arrow {
      border: 1px solid #e2e2e2;
      border-radius: 50%;

      &:hover,
      &:focus {
        border-color: #222;
      }
    }

    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;

      &:hover,
      &:focus {
        border-color: #e2e2e2;
      }
    }
  }
}
</style>
