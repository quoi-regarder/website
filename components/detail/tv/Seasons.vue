<template>
  <UContainer
    class="w-full p-4 rounded-lg shadow-lg bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] gap-y-4"
  >
    <h2 class="text-2xl font-bold mb-4 text-[var(--ui-color-primary-400)]">
      {{ $t('tvSeasons.title') }}
    </h2>

    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 full-hd:grid-cols-5"
    >
      <LazyDetailPartSeasonCard
        v-for="(season, index) in seasons"
        :key="index"
        :season="season"
        :is-selected="selectedNumber === index + 1"
        @select="handleSeasonSelection(index + 1)"
      />

      <USkeleton v-if="seasons.length === 0" class="w-full h-96" />
    </div>

    <USeparator class="pt-4" />

    <div v-if="episodes.length > 0">
      <h3 class="text-xl font-bold mb-4 text-[var(--ui-color-primary-400)]">
        {{ seasons[selectedNumber - 1]?.name }}
      </h3>

      <div class="flex justify-center">
        <UCarousel
          ref="carousel"
          :items="episodes"
          class-names
          class="max-w-[75vw] w-11/12"
          arrows
          :ui="{
            item: 'basis-full lg:basis-[60%] lg:transition-opacity lg:[&:not(.is-snapped)]:opacity-30'
          }"
        >
          <template #default="{ item }">
            <UCard :item="item" class="mx-auto w-11/12">
              <template #header>
                <div class="flex flex-col items-center">
                  <h2 class="text-l font-bold text-[var(--ui-color-primary-400)] text-center">
                    {{ $t('tvSeasons.episode', { number: item.episode_number }) }} - {{ item.name }}
                  </h2>
                </div>
              </template>

              <template #default>
                <div class="flex flex-col lg:flex-row justify-center-center">
                  <div class="lg:w-1/3">
                    <NuxtImg
                      v-if="item.still_path"
                      :src="getImageUrl(item.still_path, 'original')"
                      alt="episode still"
                      class="rounded-md mx-auto"
                    />

                    <USkeleton
                      v-else
                      class="w-full h-32 rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
                    />
                  </div>

                  <div class="h-56 overflow-hidden overflow-y-auto px-1 lg:w-2/3 lg:h-32">
                    <p v-if="item.overview" class="text-sm text-justify">
                      {{ item.overview }}
                    </p>
                    <p v-else class="text-sm text-justify">
                      {{ $t('tvSeasons.no_overview') }}
                    </p>
                  </div>
                </div>
              </template>

              <template #footer>
                <div class="flex flex-col gap-y-2">
                  <div v-if="item.vote_average" class="flex flex-col items-start">
                    <p class="text-sm">
                      {{ $t('tvSeasons.vote_average') }}
                    </p>
                    <UProgress
                      :model-value="item.vote_average"
                      :max="10"
                      :min="0"
                      status
                      :ui="{ base: 'dark:bg-[var(--ui-bg-muted)]', status: 'text-[var(--ui-text)' }"
                    >
                    </UProgress>
                    <p class="text-left text-sm mt-2">
                      {{ $t('tvSeasons.vote_count', { count: item.vote_count }) }}
                    </p>
                  </div>
                </div>
              </template>
            </UCard>
          </template>
        </UCarousel>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const route = useRoute()
const { locale } = useI18n()
defineProps({
  seasons: {
    type: Array as PropType<any[]>,
    required: true
  }
})

const selectedNumber = ref<number | null>(1)
const episodes = ref<any[]>([])
const carousel = useTemplateRef('carousel')

onMounted(async () => {
  await fetchSeasons()
})

const handleSeasonSelection = async (seasonNumber: number) => {
  selectedNumber.value = selectedNumber.value === seasonNumber ? null : seasonNumber
  fetchSeasons()
}

const fetchSeasons = async () => {
  const manager = new QueryParamsManager(
    `/api/themoviedb/tv/${route.params.id}/season/${selectedNumber.value}`
  )
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  episodes.value = data.episodes

  carousel.value?.emblaApi?.scrollTo(0)
}
</script>
