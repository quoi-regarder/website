<template>
  <div class="relative min-h-[92vh]">
    <div
      class="bg-white/85 dark:bg-black/82 min-h-[95vh] w-full bg-[url('/background.webp')] bg-blend-overlay bg-cover bg-center bg-no-repeat absolute z-0"
    />

    <div class="relative z-10 flex flex-col items-center justify-center min-h-[95vh] gap-4">
      <div class="flex flex-col items-center justify-center gap-4 py-8">
        <h1
          class="text-2xl md:text-4xl lg:text-5xl py-2 bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent text-center font-bold"
        >
          {{ $t('popular.title', { platform: selectedPlatform?.label }) }}
        </h1>
        <h2 class="text-lg md:text-xl lg:text-2xl text-center font-semibold">
          {{ $t('popular.description', { platform: selectedPlatform?.label }) }}
        </h2>
      </div>

      <UContainer
        class="flex flex-col items-center gap-4 px-0 min-h-[72vh] justify-evenly pt-16 sm:pt-6"
      >
        <div class="flex flex-col items-center gap-4 w-full max-w-7xl">
          <HomeFilterType v-model="selectedType" />

          <LazyFieldSingleSelect
            id="filter-platform"
            v-model="platforms"
            v-model:selected-model="selectedPlatform"
            name="platforms"
            :label="t('popular.platforms')"
            class="w-full max-w-md"
          />

          <div
            v-if="isLoading && results.length === 0"
            class="flex flex-wrap justify-center gap-6 w-full"
          >
            <div
              v-for="item in 12"
              :key="item"
              class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]"
            >
              <div class="relative flex items-center flex-col min-h-[350px]">
                <USkeleton
                  class="w-full h-[700px] rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
                  :ui="{ base: 'rounded-lg' }"
                />
                <USkeleton
                  class="w-3/4 h-6 mt-4 rounded-md animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
                  :ui="{ base: 'rounded-lg' }"
                />
                <USkeleton
                  class="w-1/2 h-4 mt-2 rounded-md animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
                  :ui="{ base: 'rounded-lg' }"
                />
              </div>
            </div>
          </div>

          <div v-else-if="results.length === 0" class="text-center py-8">
            {{ $t('common.noResults') }}
          </div>

          <div v-else class="flex flex-wrap justify-center gap-6 w-full my-4">
            <Suspense>
              <LazyTrendingCard
                v-for="(result, index) in results"
                :key="result.id"
                :item="result"
                :type="selectedType"
                :genres="genres"
                :rank="index + 1"
                class="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]"
              />
            </Suspense>
          </div>

          <div
            v-if="!isLoading && results.length > 0 && page >= totalPages"
            class="text-center mt-8 text-gray-500 dark:text-gray-400"
          >
            {{ $t('common.endOfResults') }}
          </div>
        </div>
      </UContainer>

      <UButton
        icon="i-heroicons-arrow-up"
        color="primary"
        size="xl"
        class="fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl hover:scale-110 hover:rotate-[-4deg]"
        :class="showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
        :label="$t('common.buttons.backToTop')"
        @click="scrollToTop"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { locale, t } = useI18n()
const localPath = useLocalePath()

const selectedType = ref<'movie' | 'tv'>((route.query.type as 'movie' | 'tv') || 'movie')
const selectedPlatform = ref<Option | undefined>(undefined)
const { platforms, refresh: refreshPlatforms } = useTmdbPlatforms(
  computed(() => selectedType.value)
)
const results = ref<any[]>([])
const page = ref(1)
const totalPages = ref(0)
const isLoading = ref(false)
const isInitialLoad = ref(true)
const showBackToTop = ref(false)
const platformSelectorRef = ref<HTMLElement | null>(null)

const { genres } = useTmdbGenres(selectedType.value)

useSeoMeta({
  title: t('seo.pages.popular'),
  description: t('seo.descriptions.popular'),
  ogTitle: t('seo.pages.popular'),
  ogDescription: t('seo.descriptions.popular'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineWebPage({
    name: t('seo.pages.popular'),
    description: t('seo.descriptions.popular'),
    inLanguage: locale.value
  })
])

const updateSeo = (platform: Option, type: 'movie' | 'tv', results: any[]) => {
  if (!platform?.label || !results?.length) return

  const title = t('seo.pages.popular', { platform: platform.label })
  const description = t('seo.descriptions.popular', { platform: platform.label })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    twitterCard: 'summary_large_image'
  })

  useSchemaOrg([
    defineWebPage({
      name: title,
      description,
      inLanguage: locale.value
    }),
    defineItemList({
      name: title,
      description,
      itemListElement: results.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': type === 'movie' ? 'Movie' : 'TVSeries',
          name: item.title || item.name,
          description: item.overview,
          image: getImageUrl(item.poster_path, 'original'),
          url: `/${type}/${item.id}`,
          datePublished: item.release_date || item.first_air_date,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: item.vote_average,
            ratingCount: item.vote_count
          }
        }
      }))
    })
  ])
}

const checkPlatformSelectorVisibility = () => {
  if (!platformSelectorRef.value) return

  const rect = platformSelectorRef.value.getBoundingClientRect()
  showBackToTop.value = rect.bottom < 0
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

  const threshold = Math.min(0.95, 0.7 + results.value.length / 1000)

  if (scrollPercentage > threshold && !isLoading.value && page.value < totalPages.value) {
    page.value++
    fetchPopular()
  }

  checkPlatformSelectorVisibility()
}

const updateUrl = (platformId: number) => {
  navigateTo(localPath(`/popular/${platformId}?type=${selectedType.value}`), { replace: true })
}

const fetchPlatforms = async () => {
  const foundPlatform = platforms.value?.find((p) => p.id === Number(route.params.id))
  selectedPlatform.value = foundPlatform || platforms.value?.[0]
  if (!foundPlatform && platforms.value?.length > 0) {
    updateUrl(Number(platforms.value[0].id))
  }
}

const fetchPopular = async () => {
  if (!selectedPlatform.value) return

  isLoading.value = true

  try {
    const manager = new QueryParamsManager(`/api/themoviedb/discover/${selectedType.value}`)
    manager.add('language', locale.value)
    manager.add('page', page.value)
    manager.add('with_watch_providers', selectedPlatform.value.id)
    manager.add('watch_region', locale.value.toUpperCase())
    manager.add('sort_by', 'popularity.desc')

    const data = await $fetch(manager.toString())

    if (!data.results || data.results.length === 0) {
      throw new Error(t('common.noResults'))
    }

    totalPages.value = data.total_pages
    results.value = page.value === 1 ? data.results : [...results.value, ...data.results]
  } catch (err) {
    console.error('Error fetching popular content.')
  } finally {
    isLoading.value = false
  }
}

const resetAndFetch = async () => {
  page.value = 1
  results.value = []
  await fetchPopular()
}

onMounted(async () => {
  await refreshPlatforms()
  await fetchPlatforms()
  await resetAndFetch()
  isInitialLoad.value = false
  window.addEventListener('scroll', handleScroll)
  platformSelectorRef.value = document.querySelector('.max-w-md')
  updateSeo(selectedPlatform.value!, selectedType.value, results.value)
})

watch(selectedType, async (newType) => {
  if (isInitialLoad.value) return
  await refreshPlatforms()
  await fetchPlatforms()
  await resetAndFetch()
  updateSeo(selectedPlatform.value!, newType, results.value)
})

watch(selectedPlatform, (newPlatform) => {
  if (newPlatform && results.value?.length) {
    resetAndFetch()
    updateUrl(Number(newPlatform.id))
    updateSeo(newPlatform, selectedType.value, results.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
