<script setup>
import BaseHeader from './components/BaseHeader.vue'
import BaseFooter from './components/BaseFooter.vue'
</script>

<template>
  <BaseHeader></BaseHeader>
  <router-view></router-view>
  <BaseFooter></BaseFooter>
</template>
