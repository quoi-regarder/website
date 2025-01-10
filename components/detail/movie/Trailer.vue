<template>
  <div class="p-4 rounded-md shadow-lg bg-gray-100 dark:bg-gray-800">
    <h2 class="text-2xl font-bold text-primary">
      {{ $t('movieTrailer.title') }}
    </h2>

    <UCarousel
      v-if="videos.length > 0"
      :items="videos"
      :ui="{ item: 'basis-full' }"
      class="w-full mt-4"
      arrows
    >
      <template #default="{ item }">
        <div class="flex flex-col max-w-[75vw] mx-auto">
          <ScriptYouTubePlayer :video-id="item.key" />
          <p class="text-center text-wrap mt-4">{{ item.name }}</p>
        </div>
      </template>
      <template #next="{ onClick, disabled }">
        <UButton
          :disabled="disabled"
          :ui="{ rounded: 'rounded-full' }"
          class="absolute right-2 top-1/2"
          icon="i-heroicons-chevron-right"
          @click="onClick"
        />
      </template>
      <template #prev="{ onClick, disabled }">
        <UButton
          :disabled="disabled"
          :ui="{ rounded: 'rounded-full' }"
          class="absolute left-2 top-1/2"
          icon="i-heroicons-chevron-left"
          @click="onClick"
        />
      </template>
    </UCarousel>

    <p v-else>
      {{ $t('movieTrailer.no_trailer') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  videos: {
    type: Object as PropType<any>,
    required: false,
    default: null
  }
})
</script>
