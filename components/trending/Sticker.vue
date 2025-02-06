<template>
  <div class="flex flex-col items-center justify-start">
    <template v-if="item.title">
      <h3 class="text-2xl font-semibold text-[var(--ui-color-primary-400)]">
        {{ $t('trending.stickers.movie') }}
      </h3>
    </template>
    <template v-else-if="item.name">
      <h3 class="text-2xl font-semibold text-[var(--ui-color-primary-400)]">
        {{ $t('trending.stickers.tv') }}
      </h3>
    </template>

    <div class="flex gap-4">
      <div class="flex-1 max-w-2xl bg-gray-100 p-6 rounded-lg shadow-md text-center">
        <h2 class="text-2xl font-semibold text-[var(--ui-color-primary-400)]">#1</h2>
        <div class="flex gap-6 mt-6">
          <div class="relative">
            <NuxtImg
              v-if="item.poster_path"
              :src="getImageUrl(item.poster_path, 'w500')"
              :alt="`${item.title || item.name} Poster`"
              class="rounded-lg shadow-xl"
              width="300"
            />
            <template v-if="item.title || item.name">
              <h2 class="text-xl font-extrabold text-black mt-4">
                {{ item.title || item.name }}
              </h2>
            </template>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div
              class="bg-white p-4 rounded-lg shadow-md w-full mt-2 border border-dashed h-58 overflow-y-auto"
            >
              <template v-if="item.overview">
                <h3 class="text-black mb-2">Synopsis</h3>
                <p class="text-[14px] text-gray-700 leading-relaxed">
                  {{ item.overview }}
                </p>
              </template>
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div
                class="bg-white p-4 rounded-lg shadow-md w-full mt-2 overflow-y-auto border-1 border-dashed"
              >
                <template v-if="item.release_date || item.first_air_date">
                  <h3 class="text-black mb-2">Date de sortie</h3>
                  <p class="text-[14px] text-gray-700 leading-relaxed">
                    {{ item.release_date || item.first_air_date }}
                  </p>
                </template>
              </div>

              <div
                class="bg-white p-4 rounded-lg shadow-md w-full mt-2 overflow-y-auto border-1 border-dashed"
              >
                <template v-if="item.vote_average">
                  <h3 class="text-black mb-2">Note moyenne</h3>
                  <UProgress :model-value="item.vote_average" :max="10" :min="0" status>
                  </UProgress>
                  <p class="text-sm text-left">
                    {{ item.vote_average.toFixed(1) }} / 10 - {{ item.vote_count }} votes
                  </p>
                </template>
              </div>

              <UButton :to="localPath(`/${type}/${item.id}`)" variant="outline" class="self-center">
                {{ $t('card.more_details') }}
              </UButton>
            </div>
          </div>
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
