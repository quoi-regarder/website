<template>
  <UFormField
    :label="label"
    :name="name"
    class="w-full h-40 flex flex-col items-center justify-start"
    size="xl"
  >
    <input ref="fileInput" :name="name" class="hidden" type="file" @change="onFileChange" />

    <div class="flex justify-center items-center gap-x-4">
      <div
        class="w-fit h-fit flex items-center justify-center rounded-full"
        @click="triggerFileInput"
      >
        <UAvatar v-if="model" :src="model" class="cursor-pointer" size="3xl" />
        <UAvatar v-else class="cursor-pointer" size="3xl" icon="i-lucide-image" />
      </div>

      <UButton
        v-if="model"
        :label="$t('avatar.buttons.remove')"
        size="sm"
        type="button"
        @click="() => emit('update:file', null)"
      />
      <UButton v-else :label="$t('avatar.buttons.upload')" size="sm" @click="triggerFileInput" />
    </div>

    <UContainer v-if="error" class="text-[var(--ui-error)] text-justify text-sm mt-2">
      {{ error }}
    </UContainer>
  </UFormField>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const props = defineProps({
  label: {
    type: String,
    required: true,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  supportedFormats: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  },
  supportedSize: {
    type: Number,
    required: false,
    default: 5
  }
})
const model = defineModel<string | null>()
const emit = defineEmits(['update:file'])

const fileInput = ref<HTMLInputElement | null>(null)
const error = ref<string | null>(null)

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.item(0)

  error.value = null

  if (!file) {
    return
  }

  if (!props.supportedFormats.includes(file.type)) {
    error.value = t('common.form.error.fileFormat', {
      formats: props.supportedFormats.join(', ')
    })
    return
  }

  if (file.size > props.supportedSize * 1024 * 1024) {
    error.value = t('common.form.error.fileSize', {
      size: props.supportedSize
    })
    return
  }

  try {
    const webpFile = await convertToWebP(file)

    emit('update:file', webpFile)
  } catch (err) {
    error.value = t('common.form.error.conversionFailed')
  }
}

const convertToWebP = async (file: File): Promise<File> => {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = URL.createObjectURL(file)
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas not supported')
  }

  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/webp')
  )

  if (!blob) {
    throw new Error('Failed to convert image to WebP')
  }

  return new File([blob], 'avatar.webp', { type: 'image/webp' })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>
