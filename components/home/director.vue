<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('director.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <field-multi-select
          :can-create="true"
          :options="directors"
          :placeholder="$t('director.placeholder')"
          name="director"
          @update:model-value="selectedDirectors = $event"
          @update:add-option="directors.push($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:selected-directors'])

const selectedDirectors = ref<Option[]>([])

watch(selectedDirectors, (value) => {
  emit('update:selected-directors', value)
})

// TODO: Fetch directors from the API
const directors = ref<Option[]>([
  { id: 1, name: 'Director 1' },
  { id: 2, name: 'Director 2' },
  { id: 3, name: 'Director 3' },
  { id: 4, name: 'Director 4' },
  { id: 5, name: 'Director 5' },
  { id: 6, name: 'Director 6' },
  { id: 7, name: 'Director 7' },
  { id: 8, name: 'Director 8' },
  { id: 9, name: 'Director 9' }
])
</script>
