<template>
  <div class="w-screen">
    <div
      class="flex justify-between items-center p-4 bg-cover bg-center bg-no-repeat tablet:p-8 tablet-md:p-12 laptop:p-16"
      :style="{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.85)), url(https://image.tmdb.org/t/p/original${props.backdropPath})`
      }"
    >
      <div class="flex flex-row items-center gap-4 w-full">
        <NuxtImg
          v-if="props.posterPath !== null && props.title !== null"
          :src="`https://image.tmdb.org/t/p/original${props.posterPath}`"
          :alt="props.title"
          class="w-32 h-48 rounded-lg tablet:w-48 tablet:h-72 tablet-md:w-64 tablet-md:h-96 laptop:w-[384px] laptop:h-[576px]"
        />
        <USkeleton
          v-else
          class="w-32 h-48 rounded-lg tablet:w-48 tablet:h-72 tablet-md:w-64 tablet-md:h-96 laptop:w-[384px] laptop:h-[576px]"
        />

        <div class="h-full ml-4 flex flex-col gap-2">
          <h1 v-if="props.title !== null" class="text-2xl font-bold text-primary">
            {{ props.title }}
          </h1>

          <p v-if="props.releaseDate !== null" class="text-gray-900">
            {{ formatLocalDate(props.releaseDate) }}
          </p>

          <div class="hidden laptop:flex flex-col gap-4">
            <section>
              <h3 class="text-l font-semibold text-primary">
                {{ $t('movieHeader.vote_average') }}
              </h3>

              <UMeter :max="10" :min="0" :value="props.voteAverage" indicator>
                <template #label>
                  <p class="text-left text-gray-900">
                    {{ $t('movieHeader.vote_count', { count: props.voteCount }) }}
                  </p>
                </template>
              </UMeter>
            </section>

            <section>
              <h3 class="text-l font-semibold text-primary">
                {{ $t('movieHeader.overview') }}
              </h3>

              <p v-if="props.overview !== null && props.overview !== ''" class="text-gray-900">
                {{ props.overview }}
              </p>
              <p v-else class="text-gray-900">
                {{ $t('movieHeader.no_overview') }}
              </p>
            </section>

            <section>
              <h3 class="text-l font-semibold text-primary">
                {{ $t('movieHeader.duration') }}
              </h3>

              <p class="text-gray-900">
                {{ Math.floor(props.runtime / 60) }}h {{ props.runtime % 60 }}min
              </p>
            </section>

            <section>
              <h3 class="text-l font-semibold text-primary">
                {{ $t('movieHeader.genres') }}
              </h3>

              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="genre in props.genres"
                  :key="genre.id"
                  :color="getGenreColor(genre.id)"
                  :label="genre.name"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 p-4 laptop:hidden">
      <section>
        <h3 class="text-l font-semibold text-primary">
          {{ $t('movieHeader.vote_average') }}
        </h3>

        <UMeter :max="10" :min="0" :value="voteAverage" indicator>
          <template #label>
            <p class="text-left">
              {{ $t('movieHeader.vote_count', { count: voteCount }) }}
            </p>
          </template>
        </UMeter>
      </section>

      <section>
        <h3 class="text-l font-semibold text-primary">
          {{ $t('movieHeader.overview') }}
        </h3>

        <p v-if="props.overview !== null && props.overview !== ''">
          {{ props.overview }}
        </p>
        <p v-else>
          {{ $t('movieHeader.no_overview') }}
        </p>
      </section>

      <section>
        <h3 class="text-l font-semibold text-primary">
          {{ $t('movieHeader.duration') }}
        </h3>

        <p>{{ Math.floor(props.runtime / 60) }}h {{ props.runtime % 60 }}min</p>
      </section>

      <section>
        <h3 class="text-l font-semibold text-primary">
          {{ $t('movieHeader.genres') }}
        </h3>

        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="genre in genres"
            :key="genre.id"
            :color="getGenreColor(genre.id)"
            :label="genre.name"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  releaseDate: {
    type: String,
    required: false,
    default: null
  },
  posterPath: {
    type: String,
    required: false,
    default: null
  },
  backdropPath: {
    type: String,
    required: false,
    default: null
  },
  voteAverage: {
    type: Number,
    required: false,
    default: null
  },
  voteCount: {
    type: Number,
    required: false,
    default: null
  },
  overview: {
    type: String,
    required: false,
    default: null
  },
  genres: {
    type: Array,
    required: false,
    default: null
  },
  runtime: {
    type: Number,
    required: false,
    default: null
  }
})
</script>
