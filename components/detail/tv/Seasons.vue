<template>
  <div class="p-4 rounded-md shadow-lg bg-gray-100 dark:bg-gray-800 space-y-4">
    <h2 class="text-2xl font-bold text-primary">
      {{ $t('tvSeasons.title') }}
    </h2>

    <div
      class="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 full-hd:grid-cols-5"
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

    <UDivider :ui="{ border: { base: 'border-gray-400 dark:border-gray-400' } }" class="pt-4" />

    <div>
      <h3 class="text-xl font-bold text-primary">
        {{ seasons[selectedNumber - 1]?.name }}
      </h3>

      <UCarousel
        v-if="episodes.length > 0"
        ref="carouselRef"
        :items="episodes"
        class="mt-4"
        :ui="{
          item: 'basis-full',
          indicators: { inactive: 'bg-gray-500 dark:bg-gray-200' }
        }"
        arrows
        indicators
      >
        <template #default="{ item }">
          <UCard
            :item="item"
            class="mx-auto mb-12 w-[96%] tablet:w-[80%] laptop:w-[60%] desktop:w-[60%]"
          >
            <template #header>
              <div class="flex flex-col items-center">
                <h2 class="text-l font-bold text-primary text-center">
                  {{ $t('tvSeasons.episode', { number: item.episode_number }) }} - {{ item.name }}
                </h2>
              </div>
            </template>

            <template #default>
              <div class="flex space-x-4 h-56">
                <div class="w-1/3">
                  <NuxtImg
                    v-if="item.still_path"
                    :src="getImageUrl(item.still_path, 'original')"
                    alt="episode still"
                    class="rounded-md"
                  />

                  <USkeleton
                    v-else
                    class="w-full h-56"
                    :ui="{ background: 'bg-gray-200 dark:bg-gray-700', base: '' }"
                  />
                </div>
                <div class="w-2/3 max-h-56 overflow-hidden overflow-y-auto px-1">
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
              <div class="flex flex-col space-y-2">
                <div v-if="item.vote_average" class="flex flex-col items-start">
                  <p class="text-sm">
                    {{ $t('tvSeasons.vote_average') }}
                  </p>
                  <UMeter :max="10" :min="0" :value="item.vote_average" indicator>
                    <template #label>
                      <p class="text-left">
                        {{ $t('tvSeasons.vote_count', { count: item.vote_count }) }}
                      </p>
                    </template>
                  </UMeter>
                </div>
              </div>
            </template>
          </UCard>
        </template>

        <template #next="{ onClick, disabled }">
          <UButton
            :disabled="disabled"
            :ui="{ rounded: 'rounded-full' }"
            class="absolute right-0 top-1/2"
            icon="i-heroicons-chevron-right"
            @click="onClick"
          />
        </template>
        <template #prev="{ onClick, disabled }">
          <UButton
            :disabled="disabled"
            :ui="{ rounded: 'rounded-full' }"
            class="absolute left-0 top-1/2"
            icon="i-heroicons-chevron-left"
            @click="onClick"
          />
        </template>
      </UCarousel>
    </div>
  </div>
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
const carouselRef = ref()

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

  carouselRef.value?.select(0)
}
</script>
