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
          v-if="props.posterPath !== null && props.title !== null"
          :src="getImageUrl(props.posterPath, 'original')"
          :alt="props.title"
          class="w-32 h-48 rounded-lg sm:w-48 sm:h-72 md:w-64 md:h-96 lg:w-[384px] lg:h-[576px]"
        />
        <USkeleton
          v-else
          class="w-32 h-48 rounded-lg sm:w-48 sm:h-72 md:w-64 md:h-96 lg:w-[384px] lg:h-[576px]"
        />

        <div class="h-full flex flex-col gap-2">
          <div class="flex flex-col items-center mb-8">
            <h1 v-if="props.title !== null" class="text-3xl font-bold text-center text-primary-400">
              {{ props.title }}
            </h1>

            <p v-if="props.releaseDate !== null" class="text-sm text-center">
              {{ formatLocalDate(props.releaseDate) }}
            </p>

            <div class="flex gap-2 pr-2 justify-end mt-2">
              <UButton
                :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
                class="self-center"
                :trailing-icon="
                  computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
                "
                @click="addContentToViewedList('movie', movieId)"
              >
                {{ $t('common.content.add_to_viewed_list') }}
              </UButton>

              <UButton
                :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
                color="secondary"
                class="self-center"
                :trailing-icon="
                  computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
                "
                @click="addContentToWatchlist('movie', movieId)"
              >
                {{ $t('common.content.add_to_watch_list') }}
              </UButton>
            </div>
          </div>

          <div class="hidden lg:block">
            <DetailPartMovieInfoContainer
              :vote-average="props.voteAverage"
              :vote-count="props.voteCount"
              :overview="props.overview"
              :runtime="props.runtime"
              :genres="props.genres"
            />
          </div>
          <div class="flex justify-center pt-4">
            <PopinShare :title="props.title" />
          </div>
        </div>
      </div>
    </div>

    <div class="pt-4 lg:hidden">
      <DetailPartMovieInfoContainer
        :vote-average="props.voteAverage"
        :vote-count="props.voteCount"
        :overview="props.overview"
        :runtime="props.runtime"
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
  title: {
    type: String,
    required: true
  },
  releaseDate: {
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
  genres: {
    type: Array,
    required: false,
    default: () => []
  },
  runtime: {
    type: Number,
    required: false,
    default: null
  }
})

const movieId = ref(Number(route.params.id))

const computedStatus = computed(() => getContentStatus('movie', movieId.value))

const linearGradient = computed(() => {
  if (colorMode.value === 'dark') {
    return 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))'
  } else {
    return 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.8))'
  }
})
</script>
