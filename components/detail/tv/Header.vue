<template>
  <div class="w-screen">
    <div
      class="bg-white/85 dark:bg-black/75 w-full p-4 rounded-lg shadow-lg bg-blend-overlay bg-cover bg-center bg-no-repeat flex flex-col items-center justify-evenly gap-y-8"
      :style="{ backgroundImage: `url(${getImageUrl(props.backdropPath, 'original')})` }"
    >
      <div class="max-w-6xl flex flex-row items-center justify-evenly w-full gap-x-2">
        <NuxtImg
          v-if="props.posterPath !== null && props.name !== null"
          :src="getImageUrl(props.posterPath, 'original')"
          :alt="props.name"
          class="w-32 h-48 rounded-lg sm:w-48 sm:h-72 md:w-64 md:h-96 lg:w-[384px] lg:h-[576px]"
        />
        <USkeleton
          v-else
          class="w-32 h-48 rounded-lg sm:w-48 sm:h-72 md:w-64 md:h-96 lg:w-[384px] lg:h-[576px]"
        />

        <div class="h-full flex flex-col gap-2">
          <div class="flex flex-col items-center">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2">
              <h1 v-if="props.name !== null" class="text-2xl font-bold text-primary-400">
                {{ props.name }}
              </h1>
              <UBadge v-if="props.inProduction" color="success" class="text-xs">
                {{ $t('tvHeader.in_production') }}
              </UBadge>

              <UBadge v-else color="warning" class="text-xs">
                {{ $t('tvHeader.finished') }}
              </UBadge>
            </div>

            <div class="ring-1 ring-primary-400/70 rounded-3xl gap-y-1 py-2 px-4">
              <div
                v-if="props.firstAirDate !== null"
                class="flex flex-col items-start sm:flex-row sm:items-center gap-x-1.5"
              >
                <div class="flex items-center gap-x-0.5">
                  <UIcon name="i-lucide:calendar" class="w-6 h-6" />
                  <p class="text-primary-400 md:text-lg">
                    {{ $t('tvHeader.first_air_date') }}
                  </p>
                </div>
                <p>
                  {{ formatLocalDate(props.firstAirDate) }}
                </p>
              </div>

              <div
                v-if="props.lastAirDate !== null"
                class="flex flex-col items-start sm:flex-row sm:items-center gap-x-1.5"
              >
                <div class="flex items-center gap-x-0.5">
                  <UIcon name="i-lucide:calendar" class="w-6 h-6" />
                  <p class="text-primary-400 md:text-lg">
                    {{ $t('tvHeader.last_air_date') }}
                  </p>
                </div>
                <p>
                  {{ formatLocalDate(props.lastAirDate) }}
                </p>
              </div>
            </div>

            <div class="flex gap-2 pr-2 justify-end mt-2 flex-wrap">
              <UButton
                :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
                class="self-center"
                :trailing-icon="
                  computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
                "
                @click="addContentToViewedList('tv', tvId)"
              >
                {{ $t('common.content.add_to_viewed_list') }}
              </UButton>

              <UButton
                v-if="computedStatus === WatchStatus.WATCHING"
                color="secondary"
                class="self-center"
                trailing-icon="i-lucide:popcorn"
                disabled
              >
                {{ $t('common.content.watching') }}
              </UButton>

              <UButton
                v-if="computedStatus !== WatchStatus.WATCHING"
                color="secondary"
                :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
                class="self-center"
                :trailing-icon="
                  computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
                "
                @click="addContentToWatchlist('tv', tvId)"
              >
                {{ $t('common.content.add_to_watch_list') }}
              </UButton>
              <UTooltip
                :text="computedFavorite ? $t('common.favorite.remove') : $t('common.favorite.add')"
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
                  @click="addFavorite('tv', tvId)"
                >
                </UButton>
              </UTooltip>

              <UTooltip :text="$t('tvHeader.viewing_details')">
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
            <DetailPartTvInfoContainer
              :vote-average="props.voteAverage"
              :vote-count="props.voteCount"
              :overview="props.overview"
              :genres="props.genres"
            />
          </div>
          <div class="flex justify-center pt-0 lg:pt-4">
            <PopinShare :id="tvId" :title="props.name" type="tv" :overview="props.overview" />
          </div>
        </div>
      </div>
    </div>

    <div class="pt-4 lg:hidden">
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
const { getContentStatus, addContentToViewedList, addContentToWatchlist } = useContentState()
const { isFavorite, addFavorite } = useFavoriteState()

const overlay = useOverlay()
const route = useRoute()

const props = defineProps<{
  name: string
  firstAirDate: string
  lastAirDate: string
  posterPath: string
  backdropPath: string
  voteAverage: number
  voteCount: number
  overview: string
  genres: string[]
  inProduction: boolean
  providerIds: number[]
}>()

const tvId = ref(Number(route.params.id))

const computedStatus = computed(() => getContentStatus('tv', tvId.value))
const computedFavorite = computed(() => isFavorite('tv', tvId.value))

const openViewingDetails = () => {
  const viewingDetailsModal = overlay.create(
    defineAsyncComponent(() => import('~/components/popin/ViewingDetails.vue')),
    {
      props: {
        contextType: 'tv',
        contextId: tvId.value.toString(),
        providerIds: props.providerIds
      }
    }
  )

  viewingDetailsModal.open()
}
</script>
