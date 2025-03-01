<template>
  <div
    class="flex flex-col w-full h-full min-h-[32rem] max-w-[320px] border-1 rounded-xl bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-5px]"
  >
    <div class="relative">
      <!-- Rank Badge -->
      <div
        v-if="rank"
        class="absolute top-2 left-2 z-10 bg-secondary-500/90 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg"
      >
        #{{ rank }}
      </div>

      <!-- Poster Image -->
      <div class="relative w-full aspect-[2/3] overflow-hidden group">
        <NuxtImg
          v-if="item.poster_path"
          :src="getImageUrl(item.poster_path, 'w500')"
          :alt="`${title} Poster`"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          fetchpriority="high"
        />
        <div
          v-if="!item.poster_path"
          class="absolute inset-0 bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)] flex items-center justify-center"
        >
          <p class="text-lg font-semibold text-center px-4">
            {{ t('card.no_poster') }}
          </p>
        </div>

        <!-- Rating Overlay -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-3 py-2 flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide:star" class="text-amber-500 size-5" />
            <span class="font-semibold">{{ formattedRating }}</span>
          </div>
          <span class="text-xs">{{ t('card.votes', { count: item.vote_count }) }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col p-3 flex-grow overflow-hidden">
      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 my-2 p-1 justify-end overflow-hidden">
        <UButton
          :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
          size="sm"
          color="primary"
          :trailing-icon="
            computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
          "
          class="transition-all duration-300 hover:scale-105"
          @click="handleAddToViewed"
        >
          {{ t('common.content.add_to_viewed_list') }}
        </UButton>

        <UButton
          v-if="computedStatus !== WatchStatus.WATCHING"
          :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
          size="sm"
          color="secondary"
          :trailing-icon="
            computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
          "
          class="transition-all duration-300 hover:scale-105"
          @click="handleAddToWatchlist"
        >
          {{ t('common.content.add_to_watch_list') }}
        </UButton>

        <UButton v-else size="sm" color="secondary" trailing-icon="i-lucide:popcorn" disabled>
          {{ t('common.content.watching') }}
        </UButton>
      </div>

      <USeparator />

      <!-- Title Section - Fixed Height -->
      <div class="h-[3.5rem] overflow-hidden">
        <!-- Title -->
        <h3
          class="text-lg font-semibold text-primary-400 line-clamp-2 overflow-hidden text-ellipsis"
        >
          {{ title }}
        </h3>

        <!-- Original Title -->
        <div class="text-xs text-[var(--ui-text-muted)] mt-1 overflow-hidden text-ellipsis">
          <span>{{ t('card.original_title', { title: originalTitle }) }}</span>
        </div>
      </div>

      <!-- Genres -->
      <div class="flex flex-wrap justify-center items-center my-1 gap-1 overflow-hidden h-[3rem]">
        <UBadge
          v-for="genre in genreDetails?.slice(0, 2)"
          :key="genre.id"
          :label="genre.label"
          color="secondary"
          variant="subtle"
          size="xs"
          class="text-xs h-fit"
          icon="i-lucide:tag"
        />
        <UBadge
          v-if="genreDetails && genreDetails.length > 2"
          color="secondary"
          variant="subtle"
          size="xs"
          icon="i-lucide:tag"
          class="text-xs h-fit"
          :label="`+${genreDetails.length - 2}`"
        />
      </div>

      <!-- Overview -->
      <div class="h-[5rem] mb-3">
        <p
          class="text-sm text-[var(--ui-text)] line-clamp-4 overflow-hidden text-ellipsis text-justify"
        >
          {{ item.overview || t('card.no_overview') }}
        </p>
      </div>

      <USeparator />

      <!-- Details Button -->
      <UButton
        :to="localPath(`/${type}/${item.id}`)"
        variant="ghost"
        size="xs"
        class="mt-2 w-fit self-end transition-all duration-300 hover:translate-x-1"
        :label="t('card.more_details')"
        trailing-icon="i-lucide:arrow-right"
      />
    </div>
  </div>
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
  genres: {
    type: Array as PropType<{ id: number; label: string }[]>,
    required: true
  },
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  },
  rank: {
    type: Number,
    default: null
  }
})

const title = computed(() => props.item.title || props.item.name || '')
const originalTitle = computed(() => props.item.original_title || props.item.original_name || '')
const formattedRating = computed(() => `${(props.item.vote_average * 10).toFixed(0)}%`)
const computedStatus = computed(() => getContentStatus(props.type, props.item.id))

const genreDetails = computed(() => {
  return props.item.genre_ids
    ?.map((genreId: number) => props.genres.find((g) => g.id === genreId))
    .filter(Boolean)
})

const handleAddToViewed = () => addContentToViewedList(props.type, props.item.id)
const handleAddToWatchlist = () => addContentToWatchlist(props.type, props.item.id)
</script>
