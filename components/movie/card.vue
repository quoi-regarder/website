<template>
  <div
    class="flex flex-col laptop:flex-row items-center w-full h-full p-1 tablet:p-4 border-2 border-gray-200 rounded-xl dark:border-gray-500 bg-white dark:bg-gray-800"
  >
    <!-- Movie Poster -->
    <NuxtImg
      v-if="item.poster_path"
      :src="`https://image.tmdb.org/t/p/original/${item.poster_path}`"
      :alt="`${item.title || item.name} Poster`"
      class="rounded-lg shadow-xl w-full tablet:w-1/2 laptop:w-1/3"
    />

    <div v-else class="relative rounded-lg shadow-xl w-full tablet:w-1/2 laptop:w-1/3 h-[500px]">
      <USkeleton />
      <div class="absolute inset-0 flex items-center justify-center">
        <p class="text-lg font-semibold text-gray-400">
          {{ $t('card.no_poster') }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-2 w-full items-center justify-between laptop:w-2/3 p-2">
      <!-- Movie Details -->
      <div
        class="grid grid-cols-3 gap-4 p-4 auto-rows-min pr-4 mt-24 laptop:mt-0 h-[420px] overflow-y-auto border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-500"
      >
        <div v-for="(field, index) in itemDetails" :key="index" class="contents">
          <!-- Label -->
          <div class="col-span-1 pr-4 text-right">
            <p class="text-lg font-semibold text-gray-600">
              {{ field.label }}
            </p>
          </div>

          <!-- Value -->
          <div class="col-span-2">
            <!-- Render different types -->
            <template v-if="field.type === 'title'">
              <h2 class="text-xl font-semibold text-primary">
                {{ field.value }}
              </h2>
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
                    {{ $t('card.vote_count', { count: item.vote_count }) }}
                  </p>
                </template>
              </UMeter>
            </template>

            <template v-else-if="field.type === 'text'">
              <p v-if="field.value" class="text-justify">
                {{ field.value }}
              </p>
              <p v-else class="text-gray-400">
                {{ $t('card.no_overview') }}
              </p>
            </template>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <div class="size-2 rounded-full bg-gray-200 dark:bg-gray-200" />
        <div class="size-2 rounded-full bg-gray-200 dark:bg-gray-200" />
        <div class="size-2 rounded-full bg-gray-200 dark:bg-gray-200" />
      </div>
      <UButton :to="localPath(`/${type}/${item.id}`)" variant="outline">
        {{ $t('card.more_details') }}
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const localPath = useLocalePath()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  genres: {
    type: Array as PropType<Badge[]>,
    required: true
  },
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})

const itemDetails = computed(() => {
  const genreDetails = props.item.genre_ids?.map((id) =>
    props.genres.find((genre) => genre.id === id)
  )

  if (props.type === 'movie') {
    return [
      {
        label: t('card.title'),
        value: props.item.title,
        type: 'title'
      },
      {
        label: t('card.release_date'),
        value: props.item.release_date,
        type: 'date'
      },
      {
        label: t('card.vote_average'),
        value: props.item.vote_average,
        type: 'notation'
      },
      {
        label: t('card.overview'),
        value: props.item.overview,
        type: 'text'
      },
      {
        label: t('card.genres'),
        value: genreDetails?.filter(Boolean),
        type: 'badge'
      }
    ]
  } else {
    return [
      {
        label: t('card.title'),
        value: props.item.name,
        type: 'title'
      },
      {
        label: t('card.first_air_date'),
        value: props.item.first_air_date,
        type: 'date'
      },
      {
        label: t('card.vote_average'),
        value: props.item.vote_average,
        type: 'notation'
      },
      {
        label: t('card.overview'),
        value: props.item.overview,
        type: 'text'
      },
      {
        label: t('card.genres'),
        value: genreDetails?.filter(Boolean),
        type: 'badge'
      }
    ]
  }
})
</script>
