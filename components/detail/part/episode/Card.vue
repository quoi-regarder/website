<template>
  <UCard :item="episode" class="mx-auto w-11/12">
    <template #header>
      <div class="flex flex-col items-center">
        <h2 class="text-l font-bold text-[var(--ui-color-primary-400)] text-center">
          {{ $t('tvSeasons.episode', { number: episode.episode_number }) }} - {{ episode.name }}
        </h2>
      </div>

      <div class="flex gap-2 pr-2 justify-center mt-2">
        <UButton
          :variant="computedStatus === WatchStatus.WATCHED ? 'solid' : 'outline'"
          class="self-center"
          :trailing-icon="
            computedStatus === WatchStatus.WATCHED ? 'i-lucide:check' : 'i-lucide:eye'
          "
          @click="addContentToViewedList('episode', serieId, episode.id, episode.season_number)"
        >
          {{ $t('common.content.add_to_viewed_list') }}
        </UButton>

        <UButton
          :variant="computedStatus === WatchStatus.TO_WATCH ? 'solid' : 'outline'"
          class="self-center"
          :trailing-icon="
            computedStatus === WatchStatus.TO_WATCH ? 'i-lucide:check' : 'i-lucide:plus'
          "
          @click="addContentToWatchlist('episode', serieId, episode.id, episode.season_number)"
        >
          {{ $t('common.content.add_to_watch_list') }}
        </UButton>
      </div>
    </template>

    <template #default>
      <div class="flex flex-col lg:flex-row justify-center-center">
        <div class="lg:w-1/3">
          <NuxtImg
            v-if="episode.still_path"
            :src="getImageUrl(episode.still_path, 'original')"
            alt="episode still"
            class="rounded-md mx-auto"
          />

          <USkeleton
            v-else
            class="w-full h-32 rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
          />
        </div>

        <div class="h-56 overflow-hidden overflow-y-auto px-1 lg:w-2/3 lg:h-32">
          <p v-if="episode.overview" class="text-sm text-justify">
            {{ episode.overview }}
          </p>
          <p v-else class="text-sm text-justify">
            {{ $t('tvSeasons.no_overview') }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col gap-y-2">
        <div v-if="episode.vote_average" class="flex flex-col items-start">
          <p class="text-sm">
            {{ $t('tvSeasons.vote_average') }}
          </p>
          <UProgress
            :model-value="episode.vote_average"
            :max="10"
            :min="0"
            status
            :ui="{ base: 'dark:bg-[var(--ui-bg-muted)]', status: 'text-[var(--ui-text)' }"
          >
          </UProgress>
          <p class="text-left text-sm mt-2">
            {{ $t('tvSeasons.vote_count', { count: episode.vote_count }) }}
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const { getContentStatus, addContentToViewedList, addContentToWatchlist } = useContentState()
const props = defineProps({
  episode: {
    type: Object as PropType<any>,
    required: true
  }
})

const route = useRoute()
const serieId = Number(route.params.id)

const computedStatus = computed(() => getContentStatus('episode', props.episode.id))
</script>
