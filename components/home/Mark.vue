<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('mark.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <UIcon
          v-for="i in maxMark"
          :key="i"
          :name="i <= mark ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
          class="cursor-pointer text-primary size-8"
          @click="mark = i"
        />
        <span>{{ $t('mark.labels.mark', { count: mark }) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const mark = ref<number>(1)
const maxMark = 5

const emit = defineEmits(['update:selected-mark'])

watch(mark, (value) => {
  emit('update:selected-mark', value)
})
</script>
