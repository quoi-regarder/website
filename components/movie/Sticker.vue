<template>
  <div class="flex gap-4">
    <UContainer class="flex-1 max-w-sm">
      <div class="flex flex-col items-center gap-2">
        <NuxtImg
          v-if="item.poster_path"
          :src="getImageUrl(item.poster_path, 'w500')"
          :alt="`${item.title || item.name} Poster`"
          class="rounded-lg shadow-xl"
          width="250"
        />
        <!-- <p v-if="item.title || item.name" class="text-center text-lg font-semibold mt-2">
          {{ item.title || item.name }}
        </p> -->
        <template v-if="item.title || item.name">
          <h2>
            {{ item.title || item.name }}
          </h2>
        </template>

        <!-- Synopsis -->
        <div>
          <template v-if="item.overview">
            <p class="text-center text-sm mt-1 px-4">
              {{ item.overview }}
            </p>
          </template>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>
