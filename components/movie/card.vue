<template>
  <div
    class="flex flex-col w-full border-1 rounded-xl bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]"
  >
    <div class="flex flex-col items-center lg:flex-row gap-6 xl:gap-12 p-3">
      <NuxtImg
        v-if="item.poster_path"
        :src="getImageUrl(item.poster_path, 'w500')"
        :alt="`${title} Poster`"
        class="rounded-lg shadow-xl self-center max-w-[250px] w-full h-auto object-cover"
        loading="lazy"
      />
      <div v-else class="relative rounded-lg shadow-xl w-[250px] h-[375px]">
        <USkeleton
          class="w-[250px] h-full rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
        />
        <div class="absolute inset-0 flex items-center justify-center text-wrap">
          <p class="text-lg font-semibold">
            {{ $t('card.no_poster') }}
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-4 border-1 border-dashed rounded-lg p-2 w-full">
        <!-- Rating and Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-between">
          <!-- Rating Section -->
          <div class="flex items-center gap-4 order-2 sm:order-1">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide:star" class="text-amber-500 size-6 sm:size-7" />
              <p class="text-left text-base sm:text-lg font-semibold">
                {{ formattedRating }}
              </p>
            </div>

            <span
              class="h-0.5 w-4 rounded-full bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-inverted)]"
            ></span>

            <p class="text-sm sm:text-base">
              {{ $t('card.votes', { count: item.vote_count }) }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 justify-end order-1 sm:order-2">
            <UButton
              :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
              size="sm"
              :trailing-icon="
                computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
              "
              @click="handleAddToViewed"
            >
              {{ $t('common.content.add_to_viewed_list') }}
            </UButton>

            <UButton
              v-if="computedStatus === WatchStatus.WATCHING"
              size="sm"
              trailing-icon="i-lucide:popcorn"
              disabled
            >
              {{ $t('common.content.watching') }}
            </UButton>

            <UButton
              v-if="computedStatus !== WatchStatus.WATCHING"
              :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
              size="sm"
              :trailing-icon="
                computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
              "
              @click="handleAddToWatchlist"
            >
              {{ $t('common.content.add_to_watch_list') }}
            </UButton>
          </div>
        </div>

        <!-- Title Section -->
        <div class="h-60 overflow-y-auto flex flex-col justify-between">
          <div>
            <div class="w-full">
              <!-- Main Title -->
              <h2
                class="text-left text-2xl sm:text-3xl font-semibold text-primary-400 break-words hyphens-auto mb-1"
              >
                {{ title }}
              </h2>

              <!-- Original Title (if different) -->
              <div
                v-if="originalTitle !== title"
                class="text-left text-sm sm:text-base text-[var(--ui-text-muted)]"
              >
                <span>{{ $t('card.original_title', { title: originalTitle }) }}</span>
              </div>
            </div>

            <!-- Overview Section -->
            <div class="flex-grow mt-4">
              <p class="text-sm sm:text-base text-justify line-clamp-4 text-[var(--ui-text)]">
                {{ item.overview || $t('card.no_overview') }}
              </p>
            </div>
          </div>

          <!-- Genres Section -->
          <div class="flex flex-wrap gap-2 mt-auto">
            <UBadge
              v-for="genre in genreDetails"
              :key="genre.id"
              :label="genre.label"
              color="secondary"
              variant="subtle"
              size="md"
              icon="i-lucide:tag"
            />
          </div>
        </div>

        <USeparator />

        <!-- Details Button -->
        <div class="flex justify-center">
          <UButton
            :to="localPath(`/${type}/${item.id}`)"
            variant="subtle"
            size="sm"
            class="sm:text-base"
            :label="$t('card.more_details')"
            trailing-icon="i-lucide:ticket-check"
          />
        </div>
      </div>
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
  }
})

const title = computed(() => props.item.title || props.item.name || '')
const originalTitle = computed(() => props.item.original_title || props.item.original_name || '')
const formattedRating = computed(() => `${(props.item.vote_average * 10).toFixed(0)} %`)
const computedStatus = computed(() => getContentStatus(props.type, props.item.id))

const genreDetails = computed(() => {
  return props.item.genre_ids
    ?.map((genreId: number) => props.genres.find((g) => g.id === genreId))
    .filter(Boolean)
})

const handleAddToViewed = () => addContentToViewedList(props.type, props.item.id)
const handleAddToWatchlist = () => addContentToWatchlist(props.type, props.item.id)
</script>
