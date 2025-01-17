<template>
  <UFormField
    :hint="required || !displayHint ? undefined : $t('common.hint.optional')"
    :label="label"
    :name="name"
    :required="required"
    class="text-justify w-full"
    :class="minHeight"
  >
    <template #default="{ error }">
      <UInput
        v-model="model as string"
        :disabled="disabled"
        :placeholder="placeholder"
        :type="comptuedType"
        class="w-full"
        size="xl"
      >
        <template #leading>
          <UIcon :name="icon" class="size-6" />
        </template>

        <template #trailing>
          <UButton
            v-if="props.type === 'password'"
            variant="link"
            color="neutral"
            size="sm"
            :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            aria-label="show ? 'Hide password' : 'Show password'"
            :aria-pressed="show"
            aria-controls="password"
            @click="show = !show"
          />

          <UIcon
            v-else-if="error"
            name="i-heroicons-exclamation-triangle-20-solid"
            class="text-[var(--ui-error)] size-6"
          />
        </template>
      </UInput>
    </template>

    <template #error="{ error }">
      <span class="text-wrap">{{ error }}</span>
    </template>
  </UFormField>
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
  },
  minHeight: {
    type: String,
    default: 'min-h-32'
  }
})
const model = defineModel<string | number | null>()
const show = ref(false)

const comptuedType = computed(() => {
  if (show.value === true) {
    return 'text'
  } else {
    return props.type
  }
})

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
