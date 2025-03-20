<template>
  <UCard :ui="{ body: 'p-0 sm:p-0', header: 'p-1 sm:p-1', footer: 'p-1 sm:p-1' }" class="h-full">
    <template #header>
      <ULink :to="localPath(`/${type}/${itemDetails.id}`)" class="block min-h-[3rem]">
        <h3 class="text-sm font-bold text-center line-clamp-2">
          {{ itemDetails.title }}
        </h3>
      </ULink>
    </template>

    <div class="p-0">
      <ULink :to="localPath(`/${type}/${itemDetails.id}`)" class="block">
        <div class="relative w-full aspect-[2/3] overflow-hidden">
          <USkeleton
            class="absolute inset-0 w-full h-44 animate-pulse-subtle bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
          />
          <NuxtImg
            v-if="itemDetails.posterPath"
            :src="getImageUrl(itemDetails.posterPath, 'w300')"
            width="300"
            height="450"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            loading="lazy"
            fetchpriority="low"
            :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
            @load="handleImageLoaded"
          />
        </div>
      </ULink>
    </div>

    <template #footer>
      <p class="text-sm text-[var(--ui-text-secondary)]">
        {{ formatLocalDate(itemDetails.releaseDate) }}
      </p>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const localPath = useLocalePath()
const imageLoaded = ref(false)

const props = defineProps({
  movie: {
    type: Object as PropType<Movie>,
    required: false,
    default: null
  },
  serie: {
    type: Object as PropType<Serie>,
    required: false,
    default: null
  },
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})

const itemDetails = computed(() => {
  if (props.type === 'movie') {
    return {
      id: props.movie?.tmdbId ?? '',
      title: props.movie?.title ?? '',
      posterPath: props.movie?.posterPath ?? '',
      releaseDate: props.movie?.releaseDate ?? ''
    }
  } else {
    return {
      id: props.serie?.tmdbId ?? '',
      title: props.serie?.name ?? '',
      posterPath: props.serie?.posterPath ?? '',
      releaseDate: props.serie?.firstAirDate ?? ''
    }
  }
})

const handleImageLoaded = () => {
  imageLoaded.value = true
}
</script>
