<template>
  <div
    class="flex flex-col laptop:flex-row items-center w-full p-4 border-2 border-gray-200 rounded-xl dark:border-gray-500"
  >
    <!-- Movie Poster -->
    <NuxtImg
      :src="`https://image.tmdb.org/t/p/original/${movie.poster_path}`"
      :alt="`${movie.title} poster`"
      class="rounded-lg shadow-xl w-full tablet:w-1/2 laptop:w-1/3"
    />

    <!-- Movie Details -->
    <div
      class="grid grid-cols-3 gap-4 auto-rows-min w-full laptop:w-2/3 pr-4 mt-6 laptop:mt-0 h-[600px] max-h-[600px] tablet:h-96 tablet:max-h-96 laptop:max-h-[calc((1/3)*100vw)] overflow-y-auto"
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
                size="sm"
              />
            </div>
          </template>

          <template v-else-if="field.type === 'notation'">
            <UMeter :max="10" :min="0" :value="field.value" indicator>
              <template #indicator>
                <p class="text-sm text-right">
                  {{ Number.parseFloat(field.value).toFixed(2) }} / 10
                </p>
              </template>
              <template #label>
                <p class="text-sm text-left">
                  {{ $t('movie.vote_count', { count: movie.vote_count }) }}
                </p>
              </template>
            </UMeter>
          </template>

          <template v-else-if="field.type === 'text'">
            <p class="text-justify">
              {{ field.value }}
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
  const genreDetails = props.movie.genre_ids.map((id) =>
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
      value: genreDetails.filter(Boolean),
      type: 'badge'
    }
  ]
})
</script>
