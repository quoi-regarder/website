<template>
  <div class="flex gap-4">
    <UContainer class="flex-1 h-32">
      <div class="flex flex-col md:flex-row items-start gap-2">
        <!-- Movie Poster -->
        <NuxtImg
          v-if="item.poster_path"
          :src="getImageUrl(item.poster_path, 'w500')"
          :alt="`Poster`"
          class="rounded-lg shadow-xl"
          width="250"
        />
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>
