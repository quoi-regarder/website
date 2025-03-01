<template>
  <div class="flex flex-col items-center gap-y-2">
    <div class="relative w-16 h-24 rounded-md overflow-hidden">
      <USkeleton
        class="absolute inset-0 w-full h-full rounded-md shadow-lg animate-pulse-subtle bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
      />
      <NuxtImg
        v-if="imagePath !== null"
        :src="getImageUrl(imagePath, 'w92')"
        :alt="name"
        class="absolute inset-0 w-full h-full object-cover rounded-md shadow-lg transition-opacity duration-300"
        loading="lazy"
        fetchpriority="low"
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
