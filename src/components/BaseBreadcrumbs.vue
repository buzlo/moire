<script setup>
defineProps({ items: { type: Array, required: true } })
</script>

<template>
  <ul class="breadcrumbs">
    <li v-for="item of items" :key="item.name" class="breadcrumbs__item">
      <RouterLink
        :to="{ name: item.routeName, query: item.query }"
        class="breadcrumbs__link"
        :href="item.routeName ? '#' : null"
      >
        {{ item.title }}
      </RouterLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '../styles/mixins';
@import '../styles/variables';
.breadcrumbs {
  @include ulres;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &__item {
    position: relative;

    &:not(:last-child) {
      padding-right: 35px;

      &::after {
        content: '—';
        position: absolute;
        top: 50%;
        right: 13px;
        transform: translateY(-50%);
        color: $text-light;
      }
    }
  }

  &__link {
    font-size: 14px;
    line-height: 1;
    color: $text-light;
    transition: $transition;

    &[href]:hover,
    &[href]:focus {
      color: $text-main;
    }
  }
}
</style>
