<template>
  <div
    class="flex flex-col laptop:flex-row items-center w-full h-full p-4 border-2 border-gray-200 rounded-xl dark:border-gray-500"
  >
    <!-- Movie Poster -->
    <NuxtImg
      v-if="movie.poster_path"
      :src="`https://image.tmdb.org/t/p/original/${movie.poster_path}`"
      :alt="`${movie.title} poster`"
      class="rounded-lg shadow-xl w-full tablet:w-1/2 laptop:w-1/3"
    />

    <div v-else class="relative rounded-lg shadow-xl w-full tablet:w-1/2 laptop:w-1/3 h-[500px]">
      <USkeleton />
      <div class="absolute inset-0 flex items-center justify-center">
        <p class="text-lg font-semibold text-gray-400">
          {{ $t('movie.no_poster') }}
        </p>
      </div>
    </div>

    <!-- Movie Details -->
    <div
      class="grid grid-cols-3 gap-4 auto-rows-min w-full laptop:w-2/3 pr-4 mt-24 laptop:mt-0 h-[600px] overflow-y-auto"
    >
      <div v-for="(field, index) in movieDetails" :key="index" class="contents">
        <!-- Label -->
        <div class="col-span-1 pr-4 text-right">
          <p class="text-lg font-semibold text-gray-600">
            {{ field.label }}
          </p>
        </div>

        <!-- Value -->
        <div class="col-span-2">
          <!-- Render different types -->
          <template v-if="field.type === 'button'">
            <UButton :to="localPath(`/movie/${movie.id}`)" variant="soft">
              {{ field.value }}
            </UButton>
          </template>

          <template v-else-if="field.type === 'date'">
            <p>{{ formatLocalDate(field.value) }}</p>
          </template>

          <template v-else-if="field.type === 'badge'">
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="genre in field.value"
                :key="genre.id"
                :color="genre.color"
                :label="genre.name"
              />
            </div>
          </template>

          <template v-else-if="field.type === 'notation'">
            <UMeter :max="10" :min="0" :value="field.value" indicator>
              <template #label>
                <p class="text-sm text-left">
                  {{ $t('movie.vote_count', { count: movie.vote_count }) }}
                </p>
              </template>
            </UMeter>
          </template>

          <template v-else-if="field.type === 'text'">
            <p v-if="field.value" class="text-justify">
              {{ field.value }}
            </p>
            <p v-else class="text-gray-400">
              {{ $t('movie.no_overview') }}
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const localPath = useLocalePath()

const props = defineProps({
  movie: {
    type: Object as PropType<Movie>,
    required: true
  },
  genres: {
    type: Array as PropType<Badge[]>,
    required: true
  }
})

const movieDetails = computed(() => {
  const genreDetails = props.movie.genre_ids?.map((id) =>
    props.genres.find((genre) => genre.id === id)
  )

  return [
    {
      label: t('movie.title'),
      value: props.movie.title,
      type: 'button'
    },
    {
      label: t('movie.release_date'),
      value: props.movie.release_date,
      type: 'date'
    },
    {
      label: t('movie.vote_average'),
      value: props.movie.vote_average,
      type: 'notation'
    },
    {
      label: t('movie.overview'),
      value: props.movie.overview,
      type: 'text'
    },
    {
      label: t('movie.genres'),
      value: genreDetails?.filter(Boolean),
      type: 'badge'
    }
  ]
})
</script>
