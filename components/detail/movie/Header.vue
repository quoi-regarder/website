<template>
  <div class="w-screen">
    <div
      class="flex justify-between items-center p-4 bg-cover bg-no-repeat tablet:p-8 tablet-md:p-12 laptop:p-16"
      :style="{
        backgroundImage: `${linearGradient}, url(https://image.tmdb.org/t/p/original${props.backdropPath})`
      }"
    >
      <div class="flex flex-row items-center gap-4 w-full max-w-7xl mx-auto">
        <NuxtImg
          v-if="props.posterPath !== null && props.title !== null"
          :src="`https://image.tmdb.org/t/p/original${props.posterPath}`"
          :alt="props.title"
          class="w-32 h-48 rounded-lg tablet:w-48 tablet:h-72 tablet-md:w-64 tablet-md:h-96 laptop:w-[384px] laptop:h-[576px]"
        />
        <USkeleton
          v-else
          class="w-32 h-48 rounded-lg tablet:w-48 tablet:h-72 tablet-md:w-64 tablet-md:h-96 laptop:w-[384px] laptop:h-[576px]"
        />

        <div class="h-full ml-4 flex flex-col gap-2">
          <h1 v-if="props.title !== null" class="text-2xl font-bold text-primary">
            {{ props.title }}
          </h1>

          <p v-if="props.releaseDate !== null">
            {{ formatLocalDate(props.releaseDate) }}
          </p>

          <div class="hidden laptop:block">
            <DetailPartMovieInfoContainer
              :vote-average="props.voteAverage"
              :vote-count="props.voteCount"
              :overview="props.overview"
              :runtime="props.runtime"
              :genres="props.genres"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 laptop:hidden">
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
const colorMode = useColorMode()

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

const linearGradient = computed(() => {
  if (colorMode.value === 'dark') {
    return 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))'
  } else {
    return 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.8))'
  }
})
</script>
