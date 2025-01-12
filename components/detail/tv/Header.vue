<template>
  <div class="w-screen">
    <div
      class="flex justify-between items-center p-4 bg-cover bg-no-repeat tablet:p-8 tablet-md:p-12 laptop:p-16"
      :style="{
        backgroundImage: `${linearGradient}, url(${getImageUrl(props.backdropPath, 'original')})`
      }"
    >
      <div class="flex flex-row items-center gap-4 w-full max-w-7xl mx-auto">
        <NuxtImg
          v-if="props.posterPath !== null && props.name !== null"
          :src="getImageUrl(props.posterPath, 'original')"
          :alt="props.name"
          class="w-32 h-48 rounded-lg tablet:w-48 tablet:h-72 tablet-md:w-64 tablet-md:h-96 laptop:w-[384px] laptop:h-[576px]"
        />
        <USkeleton
          v-else
          class="w-32 h-48 rounded-lg tablet:w-48 tablet:h-72 tablet-md:w-64 tablet-md:h-96 laptop:w-[384px] laptop:h-[576px]"
        />

        <div class="h-full ml-4 flex flex-col gap-2">
          <div class="flex flex-col items-start gap-2 laptop:flex-row laptop:items-center">
            <h1 v-if="props.name !== null" class="text-2xl font-bold text-primary">
              {{ props.name }}
            </h1>
            <UBadge
              v-if="props.inProduction"
              color="green"
              class="text-xs"
              :ui="{ rounded: 'rounded-full' }"
            >
              {{ $t('tvHeader.in_production') }}
            </UBadge>

            <UBadge v-else color="orange" class="text-xs" :ui="{ rounded: 'rounded-full' }">
              {{ $t('tvHeader.finished') }}
            </UBadge>
          </div>

          <div
            v-if="props.firstAirDate !== null || props.lastAirDate !== null"
            class="flex flex-col items-start gap-2"
          >
            <div class="flex flex-col items-start laptop:flex-row laptop:items-center">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                <p v-if="props.firstAirDate !== null" class="text-primary mr-2">
                  {{ $t('tvHeader.first_air_date') }}
                </p>
              </div>
              <p v-if="props.firstAirDate !== null">
                {{ formatLocalDate(props.firstAirDate) }}
              </p>
            </div>

            <div class="flex flex-col items-start laptop:flex-row laptop:items-center">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                <p v-if="props.lastAirDate !== null" class="text-primary mr-2">
                  {{ $t('tvHeader.last_air_date') }}
                </p>
              </div>
              <p v-if="props.lastAirDate !== null">
                {{ formatLocalDate(props.lastAirDate) }}
              </p>
            </div>
          </div>

          <div class="hidden laptop:block">
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

    <div class="p-4 laptop:hidden">
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
const colorMode = useColorMode()

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

const linearGradient = computed(() => {
  if (colorMode.value === 'dark') {
    return 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))'
  } else {
    return 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.8))'
  }
})
</script>
