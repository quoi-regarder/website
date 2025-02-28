<template>
  <UContainer
    class="flex flex-col w-full h-[290px] gap-y-2 p-2 border-1 justify-center rounded-xl bg-[var(--ui-bg)]"
  >
    <div class="flex flex-row justify-between">
      <h4 class="text-2xl font-semibold text-primary-400">#{{ index + 2 }}</h4>

      <div class="flex gap-2">
        <UButton
          :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
          class="self-center"
          :trailing-icon="
            computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
          "
          @click="addContentToViewedList(type, item.id)"
        >
          {{ $t('common.content.add_to_viewed_list') }}
        </UButton>

        <UButton
          v-if="computedStatus === WatchStatus.WATCHING"
          class="self-center"
          trailing-icon="i-lucide:popcorn"
          disabled
        >
          {{ $t('common.content.watching') }}
        </UButton>

        <UButton
          v-if="computedStatus !== WatchStatus.WATCHING"
          :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
          class="self-center"
          :trailing-icon="
            computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
          "
          @click="addContentToWatchlist(type, item.id)"
        >
          {{ $t('common.content.add_to_watch_list') }}
        </UButton>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-row items-center gap-2">
      <NuxtImg
        v-if="item.poster_path"
        :src="getImageUrl(item.poster_path, 'w500')"
        :alt="`${item.title || item.name} Poster`"
        class="rounded-lg shadow-xl"
        width="100"
      />

      <div v-else class="relative rounded-lg shadow-xl w-[100px] h-[150px]">
        <USkeleton
          class="w-[100px] h-full rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
        />
        <div class="absolute inset-0 flex items-center justify-center text-wrap text-center">
          <p class="text-xs font-semibold">
            {{ $t('card.no_poster') }}
          </p>
        </div>
      </div>

      <div class="grow flex flex-col w-full gap-2 p-2 h-[175px] overflow-y-auto">
        <div v-for="(field, i) in itemDetails" :key="i">
          <template v-if="field.type === 'title'">
            <h2 class="text-xl font-bold">
              {{ field.value }}
            </h2>
          </template>

          <template v-else-if="field.type === 'date'">
            <p>{{ formatLocalDate(field.value) }}</p>
          </template>

          <template v-else-if="field.type === 'badge'">
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="genre in field.value" :key="genre.id" :label="genre.label" />
            </div>
          </template>

          <template v-else-if="field.type === 'notation'">
            <UProgress :model-value="field.value" :max="10" :min="0" status> </UProgress>
            <p class="text-sm text-left">
              {{ $t('card.vote_count', { count: item.vote_count }) }}
            </p>
          </template>
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-row justify-end">
      <UButton :to="localPath(`/${type}/${item.id}`)" variant="outline" class="self-center">
        {{ $t('card.more_details') }}
      </UButton>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { getContentStatus, addContentToViewedList, addContentToWatchlist } = useContentState()
const localPath = useLocalePath()
const { t } = useI18n()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  genres: {
    type: Array as PropType<Option[]>,
    required: true
  },
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})

const computedStatus = computed(() => getContentStatus(props.type, props.item.id))

const itemDetails = computed(() => {
  const genreDetails = props.item.genre_ids?.map((id: number) =>
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
        label: t('card.genres'),
        value: genreDetails?.filter(Boolean),
        type: 'badge'
      }
    ]
  }
})
</script>
