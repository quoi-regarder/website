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
        :create-item="canCreate"
        :loading="loading"
        :items="apiToFecth ? fetchedOptions : model"
        multiple
        class="w-full"
      >
        <template #default="{ modelValue }">
          <span v-if="modelValue?.length" class="text-wrap truncate">
            {{ $t('multiSelect.selected', { count: modelValue.length }) }}
          </span>
          <span v-else class="text-wrap truncate">
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
        v-for="item in selectedModel"
        :key="item.id"
        :label="item.label"
        :avatar="
          item?.avatar?.src
            ? {
              src: item.avatar.src
            }
            : undefined
        "
        class="cursor-pointer max-w-full truncate"
        trailing-icon="i-lucide:x"
        variant="outline"
        size="lg"
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

const model = defineModel({
  default: [],
  type: Array as PropType<Option[]>
})

const selectedModel = defineModel('selectedOptions', {
  default: [],
  type: Array as PropType<Option[]>
})

const loading = ref(false)
const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 200)
const fetchedOptions = ref<Option[]>([])

const unselect = (item: Option) => {
  selectedModel.value = selectedModel.value.filter((i) => i.label !== item.label)
}

const search = async (query: string) => {
  loading.value = true

  const data: any = await $fetch(`${props.apiToFecth}?query=${query}`)
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
</script>
