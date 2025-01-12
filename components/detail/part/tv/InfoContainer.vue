<template>
  <div
    class="flex flex-col gap-4"
    :class="[mobile ? 'p-4 bg-gray-100 rounded-md shadow-lg dark:bg-gray-800' : '']"
  >
    <!-- Vote Average Section -->
    <DetailPartInfoSection :title="$t('tvHeader.vote_average')">
      <UMeter
        :max="10"
        :min="0"
        :value="voteAverage"
        indicator
        :ui="{ indicator: { text: 'dark:text-white text-dark' } }"
      >
        <template #label>
          <p class="text-left">
            {{ $t('tvHeader.vote_count', { count: voteCount }) }}
          </p>
        </template>
      </UMeter>
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
          :color="getGenreColor(genre.id)"
          :label="genre.name"
        />
      </div>
    </DetailPartInfoSection>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
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
