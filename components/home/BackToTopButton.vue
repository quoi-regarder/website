<template>
  <UButton
    :class="{
      'opacity-100 visible': showButton,
      'opacity-0 invisible': !showButton
    }"
    class="fixed top-24 left-1/2 -translate-x-1/2 z-40 rounded-xl shadow-lg transition-all ease-in duration-500"
    size="xl"
    variant="solid"
    :label="$t('common.buttons.backToTop')"
    @click="scrollToTop"
  >
    <template #trailing>
      <UIcon name="i-heroicons-arrow-up" class="size-6" />
    </template>
  </UButton>
</template>

<script lang="ts" setup>
defineProps({
  showButton: Boolean
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
