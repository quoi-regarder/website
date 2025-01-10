<template>
  <div
    class="flex flex-col gap-4"
    :class="[mobile ? 'p-4 bg-gray-100 rounded-md shadow-lg dark:bg-gray-800' : '']"
  >
    <!-- Vote Average Section -->
    <DetailPartMovieInfoSection :title="$t('movieHeader.vote_average')">
      <UMeter
        :max="10"
        :min="0"
        :value="voteAverage"
        indicator
        :ui="{ indicator: { text: 'dark:text-white' } }"
      >
        <template #label>
          <p class="text-left">
            {{ $t('movieHeader.vote_count', { count: voteCount }) }}
          </p>
        </template>
      </UMeter>
    </DetailPartMovieInfoSection>

    <!-- Overview Section -->
    <DetailPartMovieInfoSection :title="$t('movieHeader.overview')">
      <p v-if="overview !== null && overview !== ''" class="text-justify">
        {{ overview }}
      </p>
      <p v-else>
        {{ $t('movieHeader.no_overview') }}
      </p>
    </DetailPartMovieInfoSection>

    <!-- Duration Section -->
    <DetailPartMovieInfoSection :title="$t('movieHeader.duration')">
      <p>{{ Math.floor(runtime / 60) }}h {{ runtime % 60 }}min</p>
    </DetailPartMovieInfoSection>

    <!-- Genres Section -->
    <DetailPartMovieInfoSection :title="$t('movieHeader.genres')">
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="genre in genres"
          :key="genre.id"
          :color="getGenreColor(genre.id)"
          :label="genre.name"
        />
      </div>
    </DetailPartMovieInfoSection>
  </div>
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
