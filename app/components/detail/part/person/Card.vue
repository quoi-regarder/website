<template>
  <div class="flex flex-col items-center gap-y-2">
    <div class="relative w-16 h-24 rounded-md overflow-hidden flex items-center justify-center">
      <NuxtImg
        v-if="imagePath !== null"
        :src="getImageUrl(imagePath, 'w92')"
        :alt="name"
        fetchpriority="low"
        class="w-full h-fit object-cover bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)] rounded-md"
      />
      <USkeleton
        v-else
        class="w-20 h-28 rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
      />
    </div>
    <span class="text-sm text-center text-wrap font-medium">{{ name }}</span>

    <span v-if="role" class="text-xs text-center text-wrap">
      {{ isCharacter ? $t('casting.as', { character: role }) : role }}
    </span>

    <span v-if="department" class="text-xs text-center text-wrap">
      {{ department }}
    </span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  isCharacter: {
    type: Boolean,
    default: false
  }
})
</script>
