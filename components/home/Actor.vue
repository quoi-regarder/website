<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('actor.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <field-multi-select
          :can-create="true"
          :options="actors"
          :placeholder="$t('actor.placeholder')"
          name="actor"
          @update:model-value="selectedActors = $event"
          @update:add-option="actors.push($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:selected-actors'])

const selectedActors = ref<Option[]>([])

watch(selectedActors, (value) => {
  emit('update:selected-actors', value)
})

// TODO: Fetch actors from the API
const actors = ref<Option[]>([
  { id: 1, name: 'Actor 1' },
  { id: 2, name: 'Actor 2' },
  { id: 3, name: 'Actor 3' },
  { id: 4, name: 'Actor 4' },
  { id: 5, name: 'Actor 5' },
  { id: 6, name: 'Actor 6' },
  { id: 7, name: 'Actor 7' },
  { id: 8, name: 'Actor 8' },
  { id: 9, name: 'Actor 9' }
])
</script>
