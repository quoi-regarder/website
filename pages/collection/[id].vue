<template>
  <div class="w-full flex flex-col justify-center items-center p-4">
    <div
      v-if="collection"
      class="bg-white/85 dark:bg-black/75 w-full min-h-[88vh] rounded-lg shadow-lg bg-blend-overlay bg-cover bg-center bg-no-repeat flex flex-col items-center justify-evenly gap-y-8"
      :style="{ backgroundImage: `url(${getImageUrl(collection.backdrop_path, 'original')})` }"
    >
      <div class="w-full flex flex-col items-center gap-y-4">
        <h2 class="text-4xl text-center font-bold text-primary-400">
          {{ collection.name }}
        </h2>
        <p class="text-lg text-center">
          {{ collection.overview }}
        </p>
      </div>

      <section class="w-full flex flex-wrap items-center justify-evenly mt-4 gap-x-4 gap-y-8">
        <div
          v-for="part in collection.parts"
          :key="part.id"
          class="flex flex-col items-center w-[300px] max-w-full gap-y-1"
        >
          <NuxtImg
            v-if="part.poster_path !== null"
            :src="getImageUrl(part.poster_path, 'w300')"
            :alt="part.name"
            class="w-[150px] h-[225px] rounded-md"
          />
          <USkeleton
            v-else
            class="w-[150px] h-[225px] rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
          />

          <UButton
            variant="link"
            color="secondary"
            :to="localPath(`/movie/${part.id}`)"
            :label="part.title"
          >
            <p class="text-lg text-wrap text-center font-bold">
              {{ part.title }}
            </p>
          </UButton>

          <p class="text-sm text-center">
            {{ formatLocalDate(part.release_date) }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n()
const route = useRoute()
const localPath = useLocalePath()

useSeoMeta({
  title: t('seo.pages.detail.collection'),
  description: t('seo.descriptions.detail.collection'),
  ogTitle: t('seo.pages.detail.collection'),
  ogDescription: t('seo.descriptions.detail.collection'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineWebPage({
    name: t('seo.pages.detail.collection'),
    description: t('seo.descriptions.detail.collection'),
    inLanguage: locale.value
  })
])

const collection = ref<any>(null)

onMounted(() => {
  fetchCollection()
})

const fetchCollection = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/collection/${route.params.id}`)
  manager.add('language', locale.value)

  collection.value = await $fetch(manager.toString())
}
</script>
