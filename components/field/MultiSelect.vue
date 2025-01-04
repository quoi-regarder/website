<template>
  <div>
    <UFormGroup
      :name="name"
      :description="description"
      :label="label"
      class="min-w-80 tablet:min-w-96 text-justify"
      size="xl"
    >
      <USelectMenu
        v-model="labels"
        :creatable="canCreate"
        :options="options"
        :searchable="search"
        :loading="loading"
        :searchable-placeholder="$t('multiSelect.search')"
        :ui="{ rounded: 'rounded-2xl' }"
        by="id"
        clear-search-on-close
        multiple
        trailing
        option-attribute="name"
      >
        <template #label>
          <span v-if="labels.length" class="text-wrap">
            {{ $t('multiSelect.selected', { count: labels.length }) }}
          </span>
          <span v-else>
            {{ $t('multiSelect.selected', { count: 0 }) }}
          </span>
        </template>
        <template #option-empty="{ query }">
          <p class="text-gray-500">
            {{ $t('multiSelect.noResults', { query }) }}
          </p>
        </template>
        <template #option-create="{ option }">
          <p class="text-gray-500">
            {{ $t('multiSelect.create', { name: option.name }) }}
          </p>
        </template>
        <template #empty>
          <p v-if="apiToFecth" class="text-gray-500">
            {{ $t('multiSelect.loading') }}
          </p>
          <p v-else class="text-gray-500">
            {{ $t('multiSelect.noOptions') }}
          </p>
        </template>
      </USelectMenu>
    </UFormGroup>

    <div class="flex items-center gap-2 mt-2 min-h-8 flex-wrap">
      <UBadge
        v-for="item in selected"
        :key="item.id"
        :label="item.name"
        class="cursor-pointer"
        icon="i-heroicons-x-mark-20-solid"
        size="lg"
        variant="outline"
        @click="unselect(item)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  options: {
    type: Array as PropType<Option[]>,
    required: true
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

const emit = defineEmits({
  'update:modelValue': {
    type: Function as PropType<(value: Option[]) => void>,
    required: true
  },
  'update:addOption': {
    type: Function as PropType<(option: Option) => void>,
    required: false
  }
})

const loading = ref(false)
const selected = ref<Option[]>([])

const labels = computed({
  get: () => selected.value,
  set: async (values: Option[]) => {
    const promises = values.map(async (val: Option) => {
      if (val.id !== undefined) {
        return val
      }

      const res: Option = {
        id: props.options.length + 1,
        name: val.name
      }

      emit('update:addOption', res)

      return res
    })

    selected.value = await Promise.all(promises)
    emit('update:modelValue', selected.value)
  }
})

const unselect = (item: Option) => {
  selected.value = selected.value.filter((i) => i.name !== item.name)
  emit('update:modelValue', selected.value)
}

const search = async (query: string) => {
  if (!props.apiToFecth) {
    return props.options.filter((val: Option) =>
      val.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  if (query.length === 0) {
    return props.options
  }

  loading.value = true
  const data = await $fetch(`${props.apiToFecth}?query=${query}`)

  loading.value = false
  return data.results.map((val: any) => {
    return {
      id: val.id,
      name: val.name
    }
  })
}
</script>
