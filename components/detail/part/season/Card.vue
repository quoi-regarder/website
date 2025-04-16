<template>
  <UCard
    :class="[
      'transition-all duration-200 ease-in-out',
      isRealeased(season.air_date) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
      isSelected
        ? 'ring-4 ring-primary-400'
        : isRealeased(season.air_date)
          ? 'hover:ring-1 hover:ring-primary-400/70'
          : ''
    ]"
    @click="toggleSelection"
  >
    <template #header>
      <div class="flex flex-col items-center gap-y-2">
        <UTooltip :text="season.name" :disabled="!season.name || season.name.length < 30">
          <h2 class="text-xl font-bold text-primary-400 text-center line-clamp-2">
            {{ season.name }}
          </h2>
        </UTooltip>
        <UBadge v-if="isRealeased(season.air_date)" color="success" variant="subtle" size="sm">
          {{ $t('tvSeasons.released') }}
        </UBadge>
        <UBadge v-else color="warning" variant="subtle" size="sm">
          {{ $t('tvSeasons.not_released') }}
        </UBadge>
      </div>

      <div class="flex flex-wrap gap-2 justify-center mt-4">
        <UButton
          :disabled="!isRealeased(season.air_date)"
          :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
          size="xs"
          color="primary"
          class="transition-all duration-300 hover:scale-105"
          :trailing-icon="
            computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
          "
          @click="addContentToViewedList('season', tvId, season.id)"
        >
          {{ $t('common.content.add_to_viewed_list') }}
        </UButton>

        <UButton
          v-if="computedStatus === WatchStatus.WATCHING"
          size="xs"
          color="secondary"
          trailing-icon="i-lucide:popcorn"
          class="transition-all duration-300"
          disabled
        >
          {{ $t('common.content.watching') }}
        </UButton>

        <UButton
          v-if="computedStatus !== WatchStatus.WATCHING"
          :disabled="!isRealeased(season.air_date)"
          :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
          size="xs"
          color="secondary"
          class="transition-all duration-300 hover:scale-105"
          :trailing-icon="
            computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
          "
          @click="addContentToWatchlist('season', tvId, season.id)"
        >
          {{ $t('common.content.add_to_watch_list') }}
        </UButton>

        <UTooltip :text="$t('tvSeasons.season_viewing_details')">
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
      <div class="flex flex-col sm:flex-row gap-x-1 h-28">
        <div class="w-full sm:w-1/3 flex justify-center sm:justify-start">
          <NuxtImg
            v-if="season.poster_path"
            :src="getImageUrl(season.poster_path, 'w300')"
            alt="season poster"
            class="rounded-md w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          <div
            v-else
            class="w-full h-28 bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)] flex items-center justify-center rounded-md"
          >
            <p class="text-sm font-semibold text-center px-2">
              {{ $t('card.no_poster') }}
            </p>
          </div>
        </div>

        <div class="w-full sm:w-2/3 max-h-28 overflow-hidden overflow-y-auto px-1">
          <p class="text-sm text-justify text-[var(--ui-text)]">
            {{ season.overview || $t('tvSeasons.no_overview') }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col gap-y-2 mt-2">
        <div v-if="season.vote_average" class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide:star" class="text-amber-500 size-5" />
            <span class="font-semibold">{{ (season.vote_average * 10).toFixed(0) }}%</span>
          </div>
        </div>

        <span
          v-if="season.episode_count && isRealeased(season.air_date)"
          class="text-sm font-semibold"
        >
          {{ $t('tvSeasons.episodes', { count: season.episode_count }) }}
        </span>

        <div class="text-xs text-[var(--ui-text)]">
          <p>{{ $t('tvSeasons.air_date') }}: {{ formatLocalDate(season.air_date) }}</p>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const { getContentStatus, addContentToViewedList, addContentToWatchlist } = useContentState()
const route = useRoute()
const overlay = useOverlay()
const props = defineProps({
  season: {
    type: Object as PropType<any>,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['select'])

const tvId = ref(Number(route.params.id))

const computedStatus = computed(() => getContentStatus('season', props.season.id))

function toggleSelection () {
  if (!props.isSelected && isRealeased(props.season.air_date)) {
    emit('select', props.season.id)
  }
}

const isRealeased = (date: string) => {
  if (!date) return false
  return new Date(date) < new Date()
}

const openViewingDetails = () => {
  const viewingDetailsModal = overlay.create(
    defineAsyncComponent(() => import('~/components/popin/ViewingDetails.vue')),
    {
      props: {
        contextType: 'season',
        contextId: props.season.id.toString()
      }
    }
  )

  viewingDetailsModal.open()
}
</script>
