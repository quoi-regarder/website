<template>
  <div class="w-screen flex flex-col justify-center items-center p-4">
    <div
      v-if="collection"
      class="w-full min-h-[74vh] rounded-md p-4 shadow-lg bg-cover bg-center bg-no-repeat flex flex-col items-center justify-evenly gap-y-8"
      :style="{
        backgroundImage: `${linearGradient}, url(${getImageUrl(collection.backdrop_path, 'original')})`
      }"
    >
      <div class="w-full flex flex-col items-center gap-y-4">
        <h2 class="text-4xl font-bold text-primary-400">
          {{ collection.name }}
        </h2>
        <p class="text-lg text-center">
          {{ collection.overview }}
        </p>
      </div>

      <section class="w-full flex flex-wrap items-center justify-evenly mt-4 gap-4">
        <div
          v-for="part in collection.parts"
          :key="part.id"
          class="flex flex-col items-center w-[300px] max-w-full gap-y-2"
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
            class="text-xl text-wrap text-center font-bold"
            :label="part.title"
          />

          <p>{{ formatLocalDate(part.release_date) }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n()
const route = useRoute()
const colorMode = useColorMode()
const localPath = useLocalePath()

useHead({
  title: t('seo.pages.detail.collection'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('seo.descriptions.detail.collection')
    }
  ]
})

const collection = ref<any>(null)

onMounted(() => {
  fetchCollection()
})

const fetchCollection = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/collection/${route.params.id}`)
  manager.add('language', locale.value)

  collection.value = await $fetch(manager.toString())
}

const linearGradient = computed(() => {
  if (colorMode.value === 'dark') {
    return 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))'
  } else {
    return 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.8))'
  }
})
</script>
