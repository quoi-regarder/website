<template>
  <div class="flex flex-col items-center space-y-2">
    <NuxtImg
      v-if="imagePath !== null"
      :src="getImageUrl(imagePath, 'w92')"
      :alt="name"
      class="rounded-md shadow-lg"
    />
    <USkeleton
      v-else
      class="w-16 h-16 rounded-md shadow-lg"
      :ui="{ background: 'bg-gray-200 dark:bg-gray-700', base: '' }"
    />
    <span class="text-sm text-center text-wrap font-medium">{{ name }}</span>

    <span v-if="role" class="text-xs text-center text-wrap text-gray-500 dark:text-gray-400">
      {{ isCharacter ? $t('casting.as', { character: role }) : role }}
    </span>

    <span v-if="department" class="text-xs text-center text-wrap text-gray-700 dark:text-gray-300">
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
