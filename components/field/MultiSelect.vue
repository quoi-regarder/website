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
        v-model="selected"
        v-model:search-term="searchTerm"
        :create-item="canCreate"
        :loading="loading"
        :items="apiToFecth ? fetchedOptions : options"
        multiple
        class="w-full"
        @update:model-value="emit('update:selectedOptions', $event)"
      >
        <template #default="{ modelValue }">
          <span v-if="modelValue?.length" class="text-wrap">
            {{ $t('multiSelect.selected', { count: modelValue.length }) }}
          </span>
          <span v-else>
            {{ $t('multiSelect.selected', { count: 0 }) }}
          </span>
        </template>

        <template #empty>
          <p v-if="apiToFecth">
            {{ $t('multiSelect.loading') }}
          </p>
          <p v-else>
            {{ $t('multiSelect.noOptions') }}
          </p>
        </template>
      </USelectMenu>
    </UFormField>

    <div class="flex items-center gap-2 mt-2 flex-wrap">
      <UBadge
        v-for="item in selected"
        :key="item.id"
        :label="item.label"
        class="cursor-pointer max-w-full"
        icon="i-heroicons-x-mark-20-solid"
        variant="outline"
        size="lg"
        @click="unselect(item)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const options = defineModel({
  default: [],
  type: Array as PropType<Option[]>
})

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  canCreate: {
    type: Boolean,
    default: false
  },
  apiToFecth: {
    type: String,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:selectedOptions'])

const selected = ref<Option[]>([])
const loading = ref(false)
const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)
const fetchedOptions = ref<Option[]>([])

const unselectAll = () => {
  selected.value = []
  emit('update:selectedOptions', [])
}

const unselect = (item: Option) => {
  selected.value = selected.value.filter((i) => i.label !== item.label)
  emit('update:selectedOptions', selected.value)
}

const search = async (query: string) => {
  loading.value = true

  const data = await $fetch(`${props.apiToFecth}?query=${query}`)
  fetchedOptions.value = data.results.map((val: any) => {
    return {
      id: val.id,
      label: val.name
    }
  })

  loading.value = false
}

watch(searchTermDebounced, async (newVal, oldVal) => {
  if (newVal !== oldVal && props.apiToFecth !== '' && newVal !== '') {
    await search(newVal)
  }
})

defineExpose({
  unselectAll
})
</script>
