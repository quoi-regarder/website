<template>
  <div class="flex justify-center">
    <div class="flex-1 max-w-2xl bg-gray-100 p-6 rounded-lg shadow-md mt-4 flex items-center gap-4">
      <div class="flex">
        <h2 class="text-xl font-extrabold text-black flex flex-col mr-4">#2</h2>
        <div class="relative flex-shrink-0">
          <NuxtImg
            v-if="item.poster_path"
            :src="getImageUrl(item.poster_path, 'w500')"
            :alt="`${item.title || item.name} Poster`"
            class="rounded-lg shadow-xl"
            width="100"
          />
        </div>
        <div class="flex flex-col ml-4">
          <template v-if="item.title || item.name">
            <h2 class="text-xl font-extrabold text-black">
              {{ item.title || item.name }}
            </h2>
          </template>
          <template v-if="item.release_date || item.first_air_date">
            <p class="text-[14px] text-gray-700 leading-relaxed">
              {{ item.release_date || item.first_air_date }}
            </p>
          </template>
          <template v-if="item.vote_average">
            <UProgress :model-value="item.vote_average" :max="10" :min="0" status> </UProgress>
            <p class="text-sm text-left">
              {{ item.vote_average.toFixed(1) }} / 10 - {{ item.vote_count }} votes
            </p>
          </template>
          <UButton :to="localPath(`/${type}/${item.id}`)" variant="outline" class="self-center">
            {{ $t('card.more_details') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const localPath = useLocalePath()
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const type = computed(() => {
  return props.item.title ? 'movie' : 'tv'
})
</script>
