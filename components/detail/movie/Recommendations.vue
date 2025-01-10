<template>
  <div class="tablet:p-4 rounded-md shadow-lg bg-gray-100 dark:bg-gray-800">
    <h2 class="text-2xl p-4 tablet:p-0 font-bold text-primary">
      {{ $t('movieRecommandations.title') }}
    </h2>

    <UCarousel
      v-if="recommandations?.length > 0"
      :items="recommandations"
      :ui="{ item: 'basis-full' }"
      arrows
      class="w-full mt-4"
    >
      <template #default="{ item }">
        <div class="mx-auto h-fit tablet:w-10/12 flex flex-col items-start">
          <MovieCard :genres="genres" :item="item" class="h-full" type="movie" />
        </div>
      </template>
      <template #next="{ onClick, disabled }">
        <UButton
          :disabled="disabled"
          :ui="{ rounded: 'rounded-full' }"
          class="absolute right-2 top-[calc(3/2*100vw-1rem)] tablet:top-[calc((3/2*100vw-1rem)/2)] laptop:top-1/2"
          icon="i-heroicons-chevron-right"
          @click="onClick"
        />
      </template>
      <template #prev="{ onClick, disabled }">
        <UButton
          :disabled="disabled"
          :ui="{ rounded: 'rounded-full' }"
          class="absolute left-2 top-[calc(3/2*100vw-1rem)] tablet:top-[calc((3/2*100vw-1rem)/2)] laptop:top-1/2"
          icon="i-heroicons-chevron-left"
          @click="onClick"
        />
      </template>
    </UCarousel>

    <p v-else>
      {{ $t('movieRecommandations.no_recommandation') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  recommandations: {
    type: Object as PropType<any>,
    required: false,
    default: null
  },
  genres: {
    type: Array as PropType<Badge[]>,
    required: true
  }
})
</script>
