<template>
  <div class="flex flex-col items-center space-y-2">
    <h3 class="text-lg text-center text-gray-700 dark:text-gray-300">
      {{ $t('filter.type') }}
    </h3>

    <FieldDualToggle
      v-model="modelValue"
      :left-value="$t('filter.options.movie')"
      :left-model-value="'movie'"
      :right-value="$t('filter.options.tv')"
      :right-model-value="'tv'"
      @update:model-value="setValue"
    />
  </div>
</template>

<script lang="ts" setup>
const modelValue = ref<'movie' | 'tv'>('movie')

const emit = defineEmits({
  'update:modelValue': {
    type: Function as PropType<(value: 'movie' | 'tv') => void>,
    required: true
  }
})

const setValue = (value: 'movie' | 'tv') => {
  emit('update:modelValue', value)
}

const reset = () => {
  modelValue.value = 'movie'
  emit('update:modelValue', 'movie')
}

defineExpose({
  reset
})
</script>
