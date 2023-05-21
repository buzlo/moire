<script setup>
defineProps({ items: { type: Array, required: true } })
</script>

<template>
  <ul class="dictionary">
    <li v-for="item of items" :key="item.key" class="dictionary__item">
      <span class="dictionary__key"> {{ item.key }} </span>
      <span class="dictionary__value"> {{ item.value }} </span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '../styles/mixins';

.dictionary {
  @include ulres;
}

.dictionary__item {
  display: grid;
  grid-template-columns: 170px 1fr;
  grid-gap: 20px;

  font-size: 16px;
  line-height: 24px;

  &:not(:last-child) {
    margin-bottom: 30px;
  }
}

.dictionary__key {
  opacity: 0.6;

  font-weight: 300;
}
</style>
