<template>
  <div
    class="p-4 rounded-md shadow-lg bg-cover bg-center bg-no-repeat space-y-8"
    :style="{
      backgroundImage: `${linearGradient}, url(${getImageUrl(collection.backdrop_path, 'original')})`
    }"
  >
    <h2 class="text-2xl font-bold text-primary">
      {{ $t('movieCollection.title') }}
    </h2>

    <div class="flex flex-col items-center space-y-2 mt-4">
      <NuxtImg
        v-if="collection.poster_path !== null"
        :src="getImageUrl(collection.poster_path, 'w300')"
        :alt="collection.name"
        class="max-w-[80vw] rounded-lg"
      />

      <ULink
        :to="localPath(`/collection/${collection.id}`)"
        class="text-lg font-bold text-primary underline hover:text-black dark:hover:text-white"
      >
        {{ collection.name }}
      </ULink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const localPath = useLocalePath()

defineProps({
  collection: {
    type: Object,
    required: true
  }
})

const linearGradient = computed(() => {
  if (colorMode.value === 'dark') {
    return 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))'
  } else {
    return 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.8))'
  }
})
</script>
