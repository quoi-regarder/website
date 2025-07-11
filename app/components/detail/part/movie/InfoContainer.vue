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
    <DetailPartInfoSection :title="$t('movieHeader.vote_average')">
      <UProgress
        :model-value="voteAverage"
        :max="10"
        :min="0"
        status
        :ui="{ status: 'text-[var(--ui-text)' }"
      >
      </UProgress>
      <p class="text-left text-sm mt-2">
        {{ $t('movieHeader.vote_count', { count: voteCount }) }}
      </p>
    </DetailPartInfoSection>

    <!-- Overview Section -->
    <DetailPartInfoSection :title="$t('movieHeader.overview')">
      <p v-if="overview !== null && overview !== ''" class="text-justify">
        {{ overview }}
      </p>
      <p v-else>
        {{ $t('movieHeader.no_overview') }}
      </p>
    </DetailPartInfoSection>

    <!-- Duration Section -->
    <DetailPartInfoSection :title="$t('movieHeader.duration')">
      <p>{{ Math.floor(runtime / 60) }}h {{ runtime % 60 }}min</p>
    </DetailPartInfoSection>

    <!-- Genres Section -->
    <DetailPartInfoSection :title="$t('movieHeader.genres')">
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="genre in genres"
          :key="genre.id"
          :label="genre.name"
          variant="subtle"
          color="secondary"
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
  runtime: {
    type: Number,
    required: true
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
