<template>
  <div>
    <UFormField
      :name="name"
      :description="description"
      :label="label"
      class="text-justify w-full"
      size="xl"
    >
      <USelectMenu
        v-model="selectedModel"
        v-model:search-term="searchTerm"
        :loading="loading"
        :items="model"
        class="w-full"
      >
        <template #default="{ modelValue }">
          <div v-if="modelValue?.avatar" class="flex items-center gap-2">
            <NuxtImg
              v-if="modelValue.avatar"
              :src="modelValue.avatar.src"
              :alt="modelValue.avatar.alt"
              class="w-6 h-6 rounded-full"
              loading="lazy"
            />
            {{ modelValue.label }}
          </div>
          <div v-else-if="modelValue?.icon" class="flex items-center gap-2">
            <UIcon :name="modelValue.icon" />
            {{ modelValue.label }}
          </div>
          <span
            v-else-if="modelValue?.label && modelValue?.label !== ''"
            class="text-wrap truncate"
          >
            {{ modelValue?.label }}
          </span>
          <span v-else class="text-wrap truncate">
            {{ $t('multiSelect.noOptions') }}
          </span>
        </template>

        <template #empty>
          <p>{{ $t('multiSelect.noOptions') }}</p>
        </template>
      </USelectMenu>
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  name: string
  label?: string
  description?: string
}>()

const model = defineModel<Option[]>({
  default: []
})

const selectedModel = defineModel<Option>('selectedModel', {
  default: undefined
})

const loading = ref(false)
const searchTerm = ref('')
</script>
