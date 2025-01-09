<template>
  <div
    class="w-full max-w-7xl space-y-4 p-4 tablet:p-8 tablet-md:p-12 laptop:p-16 bg-gray-100 shadow-lg dark:bg-gray-800"
  >
    <h2 class="text-2xl font-bold text-primary">
      {{ $t('movieTrailer.title') }}
    </h2>

    <UCarousel
      v-if="videos.length > 0"
      :items="videos"
      :ui="{ item: 'basis-full' }"
      class="mt-16"
      arrows
    >
      <template #default="{ item }">
        <div class="flex flex-col gap-4 max-w-[100vw] mx-auto">
          <ScriptYouTubePlayer :video-id="item.key" />
          <p class="text-center text-gray-800">{{ item.name }}</p>
        </div>
      </template>
    </UCarousel>

    <p v-else>
      {{ $t('movieTrailer.no_trailer') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  videos: {
    type: Object as PropType<any>,
    required: false,
    default: null
  }
})
</script>
