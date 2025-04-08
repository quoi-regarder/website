<template>
  <div
    class="flex flex-col w-full border-1 rounded-xl bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
  >
    <div class="flex flex-col items-center lg:flex-row gap-6 p-3">
      <div class="relative flex-shrink-0 group">
        <div class="relative rounded-lg shadow-xl max-w-[250px] w-full h-[375px] overflow-hidden">
          <NuxtImg
            v-if="item.poster_path"
            :src="getImageUrl(item.poster_path, 'w500')"
            :alt="`${title} Poster`"
            class="rounded-lg shadow-xl transition-all duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            fetchpriority="high"
          />
          <div
            v-if="!item.poster_path"
            class="absolute inset-0 flex items-center justify-center text-wrap"
          >
            <p class="text-lg font-semibold text-center px-4">
              {{ t('card.no_poster') }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col gap-2.5 border-1 border-dashed rounded-lg p-2 md:p-4 w-full overflow-hidden"
      >
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row sm:justify-between gap-3">
          <!-- Share Button -->
          <div class="flex justify-end sm:justify-start">
            <PopinShare
              :id="props.item.id"
              :title="title"
              type="movie"
              :overview="props.item.overview"
            />
          </div>

          <!-- Watch Buttons -->
          <div class="flex flex-wrap gap-2 justify-end">
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
              v-if="computedStatus === WatchStatus.WATCHING"
              color="secondary"
              size="sm"
              trailing-icon="i-lucide:popcorn"
              class="transition-all duration-300 hover:scale-105"
              disabled
            >
              {{ t('common.content.watching') }}
            </UButton>

            <UButton
              v-if="computedStatus !== WatchStatus.WATCHING"
              :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
              color="secondary"
              size="sm"
              :trailing-icon="
                computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
              "
              class="transition-all duration-300 hover:scale-105"
              @click="handleAddToWatchlist"
            >
              {{ t('common.content.add_to_watch_list') }}
            </UButton>

            <UTooltip
              :text="computedFavorite ? t('common.favorite.remove') : t('common.favorite.add')"
            >
              <UButton
                :variant="computedFavorite ? 'solid' : 'outline'"
                size="sm"
                color="primary"
                :trailing-icon="
                  computedFavorite
                    ? 'i-material-symbols:favorite'
                    : 'i-material-symbols:heart-plus-outline'
                "
                class="transition-all duration-300 hover:scale-105"
                @click="addFavorite(props.type, props.item.id)"
              >
              </UButton>
            </UTooltip>
          </div>
        </div>
        <USeparator />

        <!-- Title Section -->
        <div class="overflow-hidden">
          <!-- Main Title -->
          <h2
            class="text-left text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-400 break-words hyphens-auto mb-1 line-clamp-2 overflow-hidden text-ellipsis"
          >
            {{ title }}
          </h2>

          <!-- Original Title -->
          <div
            class="text-left text-xs sm:text-sm text-[var(--ui-text-muted)] overflow-hidden text-ellipsis"
          >
            <span>{{ t('card.original_title', { title: originalTitle }) }}</span>
          </div>
        </div>
        <!-- Rating Section (for non-mobile) -->
        <div class="hidden sm:flex items-center gap-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide:star" class="text-amber-500 size-6" />
            <p class="text-left text-base font-semibold">
              {{ formattedRating }}
            </p>
          </div>

          <span
            class="h-0.5 w-4 rounded-full bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-inverted)]"
          ></span>

          <p class="text-sm">
            {{ t('card.votes', { count: item.vote_count }) }}
          </p>
        </div>
        <!-- Genres Section -->
        <div
          class="flex flex-wrap gap-1 justify-center lg:justify-start overflow-hidden h-[3.5rem] md:h-fit"
        >
          <UBadge
            v-for="genre in genreDetails?.slice(0, 3)"
            :key="genre.id"
            :label="genre.label"
            color="secondary"
            variant="subtle"
            size="sm"
            icon="i-lucide:tag"
            class="text-xs h-fit"
          />
          <UBadge
            v-if="genreDetails && genreDetails.length > 3"
            color="secondary"
            variant="subtle"
            size="sm"
            icon="i-lucide:tag"
            class="text-xs h-fit"
            :label="`+${genreDetails.length - 3}`"
          />
        </div>

        <!-- Overview Section -->
        <div class="h-[5rem] overflow-hidden">
          <p
            class="text-xs sm:text-sm line-clamp-3 sm:line-clamp-4 text-[var(--ui-text)] overflow-hidden text-ellipsis text-justify"
          >
            {{ item.overview || t('card.no_overview') }}
          </p>
        </div>

        <USeparator />

        <!-- Details Button -->
        <div class="flex justify-end">
          <UButton
            :to="localPath(`/${type}/${item.id}`)"
            variant="ghost"
            size="xs"
            class="text-xs sm:text-sm transition-all duration-300 hover:translate-x-1"
            :label="t('card.more_details')"
            trailing-icon="i-lucide:arrow-right"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getContentStatus, addContentToViewedList, addContentToWatchlist } = useContentState()
const { isFavorite, addFavorite } = useFavoriteState()
const localPath = useLocalePath()
const { t } = useI18n()

const props = defineProps({
  item: {
    type: Object,
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

const title = computed(() => props.item.title || props.item.name || '')
const originalTitle = computed(() => props.item.original_title || props.item.original_name || '')
const formattedRating = computed(() => `${(props.item.vote_average * 10).toFixed(0)}%`)
const computedStatus = computed(() => getContentStatus(props.type, props.item.id))
const computedFavorite = computed(() => isFavorite(props.type, props.item.id))

const genreDetails = computed(() => {
  return props.item.genre_ids
    ?.map((genreId: number) => props.genres.find((g) => g.id === genreId))
    .filter(Boolean)
})

const handleAddToViewed = () => addContentToViewedList(props.type, props.item.id)
const handleAddToWatchlist = () => addContentToWatchlist(props.type, props.item.id)
</script>
