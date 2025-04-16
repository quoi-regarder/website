<template>
  <UCard :item="episode">
    <template #header>
      <div class="flex flex-col items-center gap-y-2">
        <UTooltip :text="episode.name">
          <h2 class="text-l font-bold text-primary-400 text-center line-clamp-1">
            {{ episode.name }}
          </h2>
        </UTooltip>
      </div>

      <div class="flex flex-wrap gap-2 justify-center mt-4">
        <UButton
          :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
          size="xs"
          color="primary"
          class="transition-all duration-300 hover:scale-105"
          :trailing-icon="
            computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
          "
          @click="addContentToViewedList('episode', serieId, episode.id, episode.season_number)"
        >
          {{ $t('common.content.add_to_viewed_list') }}
        </UButton>

        <UButton
          :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
          size="xs"
          color="secondary"
          class="transition-all duration-300 hover:scale-105"
          :trailing-icon="
            computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
          "
          @click="addContentToWatchlist('episode', serieId, episode.id, episode.season_number)"
        >
          {{ $t('common.content.add_to_watch_list') }}
        </UButton>

        <UTooltip :text="$t('tvSeasons.episode_viewing_details')">
          <UButton
            variant="subtle"
            color="secondary"
            trailing-icon="i-lucide:message-square-text"
            size="xs"
            :disabled="computedStatus !== WatchStatus.WATCHED"
            @click="openViewingDetails"
          />
        </UTooltip>
      </div>
    </template>

    <template #default>
      <div class="flex flex-col gap-y-2">
        <div class="relative aspect-video w-full group overflow-hidden">
          <NuxtImg
            v-if="episode.still_path"
            :src="getImageUrl(episode.still_path, 'w300')"
            alt="episode still"
            class="rounded-md w-full h-full object-cover"
            loading="lazy"
          />

          <div
            v-else
            class="absolute inset-0 bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)] flex items-center justify-center rounded-md"
          >
            <p class="text-sm font-semibold text-center px-2">
              {{ $t('card.no_poster') }}
            </p>
          </div>
        </div>

        <div class="h-28 overflow-hidden overflow-y-auto">
          <p class="text-sm text-justify text-[var(--ui-text)]">
            {{ episode.overview || $t('tvSeasons.no_overview') }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col gap-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide:star" class="text-amber-500 size-5" />
            <span
              v-if="episode.vote_average"
              class="font-medium"
            >{{ (episode.vote_average * 10).toFixed(0) }}%</span
            >
            <span v-else class="font-medium">{{ $t('card.no_vote') }}</span>
          </div>
        </div>

        <span class="text-xs text-[var(--ui-text-muted)]">
          {{ $t('tvSeasons.vote_count', { count: episode.vote_count }) }}
        </span>

        <div class="text-xs text-[var(--ui-text)]">
          <p>{{ $t('tvSeasons.air_date') }}: {{ formatLocalDate(episode.air_date) }}</p>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const { getContentStatus, addContentToViewedList, addContentToWatchlist } = useContentState()
const props = defineProps<{
  episode: any
  providerIds: number[]
}>()

const route = useRoute()
const serieId = Number(route.params.id)
const overlay = useOverlay()

const computedStatus = computed(() => getContentStatus('episode', props.episode.id))

const openViewingDetails = () => {
  const viewingDetailsModal = overlay.create(
    defineAsyncComponent(() => import('~/components/popin/ViewingDetails.vue')),
    {
      props: {
        contextType: 'episode',
        contextId: props.episode.id.toString(),
        providerIds: props.providerIds
      }
    }
  )

  viewingDetailsModal.open()
}
</script>
