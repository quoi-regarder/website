<template>
  <div class="relative min-h-[92vh]">
    <NuxtImg
      alt="Background image"
      class="absolute object-cover w-full h-[92vh] opacity-30 bg-gradient-radial z-0"
      src="/img/background.webp"
      format="webp"
      preload
    />

    <div class="relative z-10 flex flex-col items-center justify-start min-h-[92vh] gap-4 pt-[5vh]">
      <h1 class="text-4xl text-[var(--ui-color-primary-400)] text-center font-bold mb-2">
        {{ $t('trending.title') }}
      </h1>
      <h2 class="text-center">
        {{ $t('trending.description') }}
      </h2>

      <div id="sticker" class="flex gap-4">
        <MovieSticker v-if="results[0]" :item="results[0]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n()

useHead({
  title: t('seo.pages.trending'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('seo.descriptions.trending')
    }
  ]
})

const selectedType = ref<'movie' | 'tv'>('movie')
const trending = ref(false)
const trend = ref<string>('')
const page = ref(1)
const totalPages = ref(0)
const results = ref([])

const trendingQuery = async (reset = false, showToast = true) => {
  if (reset) {
    page.value = 1
    results.value = []
    totalPages.value = 0
  }
  if (page.value > totalPages.value && totalPages.value !== 0) return

  let data

  try {
    trending.value = true

    if (selectedType.value === 'movie') {
      const manager = new QueryParamsManager('/api/themoviedb/movie/now_playing')
      manager.add('query', trend.value || '')
      manager.add('page', page.value)
      manager.add('language', locale.value)

      data = await $fetch(manager.toString())
    }
    console.log(data)
    page.value = data.page
    totalPages.value = data.total_pages
    results.value = [...results.value, ...data.results]
  } catch (error) {
    console.error(error)
  } finally {
    trending.value = false
  }
}

onMounted(() => {
  trendingQuery()
})
</script>
