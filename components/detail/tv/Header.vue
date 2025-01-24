<template>
  <div class="w-screen">
    <div
      class="flex justify-center items-center p-4 bg-cover bg-no-repeat sm:p-8 md:p-12 lg:p-16"
      :style="{
        backgroundImage: `${linearGradient}, url(${getImageUrl(props.backdropPath, 'original')})`
      }"
    >
      <div class="max-w-6xl flex flex-row items-center justify-evenly w-full gap-x-2">
        <NuxtImg
          v-if="props.posterPath !== null && props.name !== null"
          :src="getImageUrl(props.posterPath, 'original')"
          :alt="props.name"
          class="w-32 h-48 rounded-lg sm:w-48 sm:h-72 md:w-64 md:h-96 lg:w-[384px] lg:h-[576px]"
        />
        <USkeleton
          v-else
          class="w-32 h-48 rounded-lg sm:w-48 sm:h-72 md:w-64 md:h-96 lg:w-[384px] lg:h-[576px]"
        />

        <div class="h-full flex flex-col gap-2">
          <div class="flex flex-col items-center">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
              <h1
                v-if="props.name !== null"
                class="text-2xl font-bold text-[var(--ui-color-primary-400)]"
              >
                {{ props.name }}
              </h1>
              <UBadge v-if="props.inProduction" color="success" class="text-xs">
                {{ $t('tvHeader.in_production') }}
              </UBadge>

              <UBadge v-else color="warning" class="text-xs">
                {{ $t('tvHeader.finished') }}
              </UBadge>
            </div>

            <div class="ring-1 ring-[var(--ui-color-primary-400)]/70 rounded-3xl gap-y-1 py-2 px-4">
              <div
                v-if="props.firstAirDate !== null"
                class="flex flex-col items-start sm:flex-row sm:items-center gap-x-1.5"
              >
                <div class="flex items-center gap-x-0.5">
                  <UIcon name="i-heroicons-calendar" class="w-6 h-6" />
                  <p class="text-[var(--ui-color-primary-400)] md:text-lg">
                    {{ $t('tvHeader.first_air_date') }}
                  </p>
                </div>
                <p>
                  {{ formatLocalDate(props.firstAirDate) }}
                </p>
              </div>

              <div
                v-if="props.lastAirDate !== null"
                class="flex flex-col items-start sm:flex-row sm:items-center gap-x-1.5"
              >
                <div class="flex items-center gap-x-0.5">
                  <UIcon name="i-heroicons-calendar" class="w-6 h-6" />
                  <p class="text-[var(--ui-color-primary-400)] md:text-lg">
                    {{ $t('tvHeader.last_air_date') }}
                  </p>
                </div>
                <p>
                  {{ formatLocalDate(props.lastAirDate) }}
                </p>
              </div>
            </div>

            <div class="flex gap-2 pr-2 justify-end mt-2">
              <UButton
                :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
                class="self-center"
                :trailing-icon="
                  computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
                "
                @click="addContentToViewedList('tv', tvId)"
              >
                {{ $t('common.content.add_to_viewed_list') }}
              </UButton>

              <UButton
                :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
                class="self-center"
                :trailing-icon="
                  computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
                "
                @click="addContentToWatchlist('tv', tvId)"
              >
                {{ $t('common.content.add_to_watch_list') }}
              </UButton>
            </div>
          </div>

          <div class="hidden lg:block">
            <DetailPartTvInfoContainer
              :vote-average="props.voteAverage"
              :vote-count="props.voteCount"
              :overview="props.overview"
              :genres="props.genres"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="pt-4 lg:hidden">
      <DetailPartTvInfoContainer
        :vote-average="props.voteAverage"
        :vote-count="props.voteCount"
        :overview="props.overview"
        :genres="props.genres"
        mobile
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getContentStatus, addContentToViewedList, addContentToWatchlist } = useContentState()

const colorMode = useColorMode()
const route = useRoute()

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  firstAirDate: {
    type: String,
    required: false,
    default: null
  },
  lastAirDate: {
    type: String,
    required: false,
    default: null
  },
  posterPath: {
    type: String,
    required: false,
    default: null
  },
  backdropPath: {
    type: String,
    required: false,
    default: null
  },
  voteAverage: {
    type: Number,
    required: false,
    default: null
  },
  voteCount: {
    type: Number,
    required: false,
    default: null
  },
  overview: {
    type: String,
    required: false,
    default: null
  },
  inProduction: {
    type: Boolean,
    required: false,
    default: false
  },
  genres: {
    type: Array,
    required: false,
    default: () => []
  }
})

const tvId = ref(Number(route.params.id))

const computedStatus = computed(() => getContentStatus('tv', tvId.value))

const linearGradient = computed(() => {
  if (colorMode.value === 'dark') {
    return 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))'
  } else {
    return 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.8))'
  }
})
</script>
