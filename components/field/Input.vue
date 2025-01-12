<template>
  <UFormGroup
    :hint="required || !displayHint ? undefined : $t('common.hint.optional')"
    :label="label"
    :name="name"
    :required="required"
    class="min-h-32 text-justify"
    size="xl"
  >
    <template #default="{ error }">
      <UInput
        v-model="model as string"
        :disabled="disabled"
        :icon="icon"
        :placeholder="placeholder"
        :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
        :type="type"
      />
    </template>

    <template #error="{ error }">
      <span class="text-red-500 text-wrap">{{ error }}</span>
    </template>
  </UFormGroup>
</template>

<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    required: false,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  displayHint: {
    type: Boolean,
    default: true
  },
  type: {
    type: String as PropType<'email' | 'password' | 'input' | 'tel' | 'number'>,
    default: 'input'
  }
})
const model = defineModel<string | number | null>()

const icon = computed(() => {
  if (props.type === 'email') {
    return 'i-heroicons-at-symbol-solid'
  } else if (props.type === 'password') {
    return 'i-heroicons-lock-closed'
  } else if (props.type === 'input' || props.type === 'number') {
    return 'i-heroicons-pencil'
  } else if (props.type === 'tel') {
    return 'i-heroicons-phone'
  } else {
    return ''
  }
})

watchEffect(() => {
  if (model.value === '') {
    model.value = null
  }
})
</script>
