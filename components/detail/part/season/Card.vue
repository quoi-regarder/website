<template>
  <UCard
    :class="[
      'transition-all duration-200 ease-in-out',
      isRealeased(season.air_date) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
      isSelected
        ? 'ring-4 ring-[var(--ui-color-primary-400)]'
        : isRealeased(season.air_date)
          ? 'hover:ring-1 hover:ring-[var(--ui-color-primary-400)]/70'
          : ''
    ]"
    @click="toggleSelection"
  >
    <template #header>
      <div class="flex flex-col items-center">
        <h2 class="text-2xl font-bold text-primary-400 text-center">
          {{ season.name }}
        </h2>
        <UBadge v-if="isRealeased(season.air_date)" color="success" class="mt-2 text-sm">
          {{ $t('tvSeasons.released') }}
        </UBadge>
        <UBadge v-else color="warning" class="mt-2 text-sm">
          {{ $t('tvSeasons.not_released') }}
        </UBadge>
      </div>

      <div class="flex gap-2 pr-2 justify-center mt-2">
        <UButton
          :disabled="!isRealeased(season.air_date)"
          :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
          class="self-center"
          :trailing-icon="
            computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
          "
          @click="addContentToViewedList('season', tvId, season.id)"
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
          :disabled="!isRealeased(season.air_date)"
          :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
          class="self-center"
          :trailing-icon="
            computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
          "
          @click="addContentToWatchlist('season', tvId, season.id)"
        >
          {{ $t('common.content.add_to_watch_list') }}
        </UButton>
      </div>
    </template>

    <template #default>
      <div class="flex gap-x-4 h-48">
        <div class="w-1/3">
          <NuxtImg
            v-if="season.poster_path"
            :src="getImageUrl(season.poster_path, 'w300')"
            alt="season poster"
            class="rounded-md"
          />

          <USkeleton
            v-else
            class="w-20 h-28 rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
          />
        </div>
        <div class="w-2/3 max-h-48 overflow-hidden overflow-y-auto px-1">
          <p v-if="season.overview" class="text-sm text-justify">
            {{ season.overview }}
          </p>
          <p v-else class="text-sm text-justify">
            {{ $t('tvSeasons.no_overview') }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col justify-between gap-y-2">
        <div v-if="season.vote_average" class="flex flex-col items-center justify-between">
          <p class="text-sm">
            {{ $t('tvSeasons.vote_average') }}
          </p>
          <UProgress
            :model-value="season.vote_average"
            :max="10"
            :min="0"
            :value="season.vote_average"
            status
            :ui="{ base: 'dark:bg-[var(--ui-bg-muted)]', status: 'text-[var(--ui-text)' }"
          >
          </UProgress>

          <USeparator class="pt-4" />
        </div>

        <div>
          <span
            v-if="season.episode_count && isRealeased(season.air_date)"
            class="text-sm font-semibold"
          >
            {{ $t('tvSeasons.episodes', { count: season.episode_count }) }}
          </span>
        </div>
        <div>
          <p class="text-sm">
            {{ $t('tvSeasons.air_date') }}: {{ formatLocalDate(season.air_date) }}
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const { getContentStatus, addContentToViewedList, addContentToWatchlist } = useContentState()
const route = useRoute()
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
</script>
