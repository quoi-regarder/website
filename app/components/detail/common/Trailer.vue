<template>
  <UContainer
    class="w-full sm:p-4 rounded-lg shadow-lg bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]"
  >
    <h2 class="text-2xl font-bold mb-4 text-primary-400">
      {{ $t('movieTrailer.title') }}
    </h2>

    <div v-if="videos.length > 0" class="flex justify-center">
      <UCarousel
        :items="videos"
        class-names
        class="w-full"
        arrows
        wheel-gestures
        :prev="{ color: 'secondary', variant: 'solid' }"
        :next="{ color: 'secondary', variant: 'solid' }"
        :ui="{
          item:
            videos.length === 1
              ? 'basis-full'
              : 'basis-full 2xl:basis-[65%] lg:transition-opacity lg:[&:not(.is-snapped)]:opacity-30'
        }"
      >
        <template #default="{ item }">
          <div class="flex items-center flex-col">
            <ScriptYouTubePlayer :video-id="item.key" />
            <p class="text-center text-wrap mt-4">{{ item.name }}</p>
          </div>
        </template>
      </UCarousel>
    </div>

    <p v-else>
      {{ $t('movieTrailer.no_trailer') }}
    </p>
  </UContainer>
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
