<template>
  <div>
    <UFormGroup :name="name" class="min-w-80 tablet:min-w-96 text-justify" size="xl">
      <USelectMenu
        v-model="labels"
        :creatable="canCreate"
        :options="options"
        :placeholder="placeholder"
        :searchable-placeholder="$t('multiSelect.search')"
        :ui="{ rounded: 'rounded-2xl' }"
        by="id"
        clear-search-on-close
        multiple
        option-attribute="name"
        searchable
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
          <p class="text-gray-500">
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
  placeholder: {
    type: String,
    default: ''
  },
  options: {
    type: Array as PropType<Option[]>,
    required: true
  },
  canCreate: {
    type: Boolean,
    default: false
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
}
</script>
