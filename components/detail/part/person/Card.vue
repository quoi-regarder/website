<template>
  <div class="flex flex-col items-center space-y-2">
    <NuxtImg
      v-if="imagePath !== null"
      :src="getImageUrl(imagePath, 'w92')"
      :alt="name"
      class="rounded-md shadow-lg w-16"
    />
    <USkeleton
      v-else
      class="w-16 h-24 rounded-md shadow-lg animate-none bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
    />
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
