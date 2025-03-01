<template>
  <UContainer
    class="flex flex-col gap-4"
    :class="[
      mobile
        ? 'w-full p-4 rounded-lg shadow-lg bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]'
        : ''
    ]"
  >
    <!-- Vote Average Section -->
    <DetailPartInfoSection :title="$t('tvHeader.vote_average')">
      <UProgress
        :model-value="voteAverage"
        :max="10"
        :min="0"
        status
        :ui="{ status: 'text-[var(--ui-text)' }"
      >
      </UProgress>
      <p class="text-left text-sm mt-2">
        {{ $t('tvHeader.vote_count', { count: voteCount }) }}
      </p>
    </DetailPartInfoSection>

    <!-- Overview Section -->
    <DetailPartInfoSection :title="$t('tvHeader.overview')">
      <p v-if="overview !== null && overview !== ''" class="text-justify">
        {{ overview }}
      </p>
      <p v-else>
        {{ $t('tvHeader.no_overview') }}
      </p>
    </DetailPartInfoSection>

    <!-- Genres Section -->
    <DetailPartInfoSection :title="$t('tvHeader.genres')">
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="genre in genres"
          :key="genre.id"
          :label="genre.name"
          color="secondary"
          variant="subtle"
          icon="i-lucide:tag"
        />
      </div>
    </DetailPartInfoSection>
  </UContainer>
</template>

<script lang="ts" setup>
defineProps({
  voteAverage: {
    type: Number,
    required: true
  },
  voteCount: {
    type: Number,
    required: true
  },
  overview: {
    type: String,
    required: false,
    default: null
  },
  genres: {
    type: Array,
    required: true
  },
  mobile: {
    type: Boolean,
    default: false
  }
})
</script>
