<template>
  <div class="w-screen">
    <div
      class="bg-white/85 dark:bg-black/75 w-full p-4 rounded-lg shadow-lg bg-blend-overlay bg-cover bg-center bg-no-repeat flex flex-col items-center justify-evenly gap-y-8"
      :style="{ backgroundImage: `url(${getImageUrl(props.backdropPath, 'original')})` }"
    >
      <div class="max-w-6xl flex flex-row items-center justify-evenly w-full gap-x-2">
        <NuxtImg
          v-if="props.posterPath !== null && props.title !== null"
          :src="getImageUrl(props.posterPath, 'original')"
          :alt="props.title"
          class="w-32 h-48 rounded-lg sm:w-48 sm:h-72 md:w-64 md:h-96 lg:w-[384px] lg:h-[576px]"
          loading="lazy"
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
                {{ t('common.content.add_to_viewed_list') }}
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
                {{ t('common.content.add_to_watch_list') }}
              </UButton>
              <UTooltip
                :text="computedFavorite ? t('common.favorite.remove') : t('common.favorite.add')"
              >
                <UButton
                  :variant="computedFavorite ? 'solid' : 'outline'"
                  color="primary"
                  :trailing-icon="
                    computedFavorite
                      ? 'i-material-symbols:favorite'
                      : 'i-material-symbols:heart-plus-outline'
                  "
                  class="transition-all duration-300 hover:scale-105"
                  @click="addFavorite('movie', movieId)"
                >
                </UButton>
              </UTooltip>

              <UTooltip :text="$t('movieHeader.viewing_details')">
                <UButton
                  variant="subtle"
                  color="secondary"
                  trailing-icon="i-lucide:message-square-text"
                  :disabled="computedStatus !== WatchStatus.WATCHED"
                  @click="openViewingDetails"
                >
                </UButton>
              </UTooltip>
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
          <div class="flex justify-center pt-0 lg:pt-4">
            <PopinShare
              :id="movieId"
              :title="props.title"
              type="movie"
              :overview="props.overview"
            />
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
const { isFavorite, addFavorite } = useFavoriteState()
const { t } = useI18n()

const overlay = useOverlay()
const route = useRoute()

const props = defineProps<{
  title: string
  releaseDate: string
  posterPath: string
  backdropPath: string
  voteAverage: number
  voteCount: number
  overview: string
  genres: string[]
  runtime: number
  providerIds: number[]
}>()

const movieId = ref(Number(route.params.id))

const computedStatus = computed(() => getContentStatus('movie', movieId.value))
const computedFavorite = computed(() => isFavorite('movie', movieId.value))

const openViewingDetails = () => {
  const viewingDetailsModal = overlay.create(
    defineAsyncComponent(() => import('~/components/popin/ViewingDetails.vue')),
    {
      props: {
        contextType: 'movie',
        contextId: movieId.value.toString(),
        providerIds: props.providerIds
      }
    }
  )

  viewingDetailsModal.open()
}
</script>
