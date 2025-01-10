<template>
  <USlideover :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <UCard :ui="cardUI">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">{{ title }}</h3>
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="$emit('update:modelValue', false)"
          />
        </div>
      </template>

      <div class="overflow-y-auto overflow-x-hidden whitespace-nowrap p-4 h-[90vh]">
        <DetailPartPersonGrid
          :people="people"
          :image-path="imagePath"
          :role-field="roleField"
          :department-field="departmentField"
          :is-character="isCharacter"
          expanded
        />
      </div>
    </UCard>
  </USlideover>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  people: {
    type: Array,
    required: true
  },
  imagePath: {
    type: String,
    default: 'profile_path'
  },
  roleField: {
    type: String,
    default: 'character'
  },
  departmentField: {
    type: String,
    default: 'known_for_department'
  },
  isCharacter: {
    type: Boolean,
    default: false
  },
  cardUI: {
    type: Object,
    default: () => ({
      body: { base: 'flex-1' },
      ring: ''
    })
  }
})

defineEmits(['update:modelValue'])
</script>
