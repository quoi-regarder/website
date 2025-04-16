<template>
  <UModal :title="t(`common.content.buttons.${props.contextType}.viewingDetails`)">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <LazyFieldSingleSelect
          v-model="filteredPlatforms"
          v-model:selected-model="selectedPlatform"
          :label="t('viewingDetails.form.fields.platform')"
          :placeholder="t('viewingDetails.form.placeholders.platform')"
          name="platformId"
        />

        <div class="flex flex-col">
          <FieldSlider
            v-model="state.rating"
            :label="t('viewingDetails.form.fields.rating')"
            name="rating"
            :min="0"
            :max="100"
            :step="1"
            required
          />
          <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mr-16">
            <span>{{ t('viewingDetails.form.rating.dislike') }}</span>
            <span>{{ t('viewingDetails.form.rating.neutral') }}</span>
            <span>{{ t('viewingDetails.form.rating.love') }}</span>
          </div>
        </div>

        <FieldSingleSelect
          v-model="emotions"
          v-model:selected-model="selectedEmotion"
          :label="t('viewingDetails.form.fields.emotions')"
          name="emotions"
          clearable
        >
          <template #option="{ option }">
            <div class="flex items-center gap-x-2">
              <UIcon :name="option.icon" />
              {{ option.label }}
            </div>
          </template>
        </FieldSingleSelect>

        <div class="flex justify-between gap-x-4 mt-6">
          <UButton
            :label="t('viewingDetails.form.buttons.delete')"
            color="secondary"
            variant="outline"
            size="lg"
            @click="onDelete"
          />
          <div class="flex gap-x-4">
            <UButton
              :label="t('viewingDetails.form.buttons.cancel')"
              color="neutral"
              variant="outline"
              size="lg"
              @click="emit('close')"
            />
            <UButton
              :label="t('viewingDetails.form.buttons.save')"
              type="submit"
              size="lg"
              :loading="isLoading"
            />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
// Props & Emits
const props = defineProps<{
  contextType: ContentType
  contextId: string
  providerIds: number[]
}>()
const emit = defineEmits<{ close: [] }>()

// Composables
const { t } = useI18n()
const authStore = useAuthStore()
const { state, setState, schema } = useViewingDetailsForm()
const { getViewingDetails, createViewingDetails, updateViewingDetails, deleteViewingDetails } =
  useViewingDetailsService()

// State
const isLoading = ref(false)
const isExistingDetails = ref(false)
const selectedPlatform = ref<Option | undefined>(undefined)
const selectedEmotion = ref<Option | undefined>(undefined)

// Constants
const emotionIcons = {
  [Emotion.MOVED]: 'i-lucide-heart',
  [Emotion.HAPPY]: 'i-lucide-smile',
  [Emotion.SAD]: 'i-lucide-frown',
  [Emotion.INSPIRED]: 'i-lucide-lightbulb',
  [Emotion.THRILLED]: 'i-lucide-flame',
  [Emotion.SCARED]: 'i-lucide-ghost',
  [Emotion.BORED]: 'i-lucide-clock',
  [Emotion.DISAPPOINTED]: 'i-lucide-thumbs-down',
  [Emotion.CONFUSED]: 'i-lucide-help-circle',
  [Emotion.RELAXED]: 'i-lucide-cloud'
}

// Computed
const computedContextType = computed(() => {
  switch (props.contextType) {
  case 'movie':
    return 'movie'
  case 'tv':
  case 'episode':
  case 'season':
    return 'tv'
  default:
    return 'movie'
  }
})

const { platforms, refresh: refreshPlatforms } = useTmdbPlatforms(computedContextType, true)

const filteredPlatforms = computed(() =>
  platforms.value.filter((platform) => props.providerIds.includes(Number(platform.id)))
)

const emotions = computed(() =>
  Object.values(Emotion).map((emotion) => ({
    id: emotion,
    label: t(`viewingDetails.emotions.${emotion}`),
    icon: emotionIcons[emotion as keyof typeof emotionIcons]
  }))
)

// Methods
const parseContextType = (contextType: string) => {
  switch (contextType) {
  case 'movie':
    return ContextType.MOVIE
  case 'tv':
    return ContextType.SERIE
  case 'episode':
    return ContextType.EPISODE
  case 'season':
    return ContextType.SEASON
  default:
    return ContextType.MOVIE
  }
}

const fetchViewingDetails = async () => {
  const userId = state.userId?.toString() || null
  const contextId = state.contextId?.toString() || null
  const response: ApiResponse<ViewingDetails> = await getViewingDetails(userId, contextId)

  if (response.data) {
    isExistingDetails.value = true
    setState(response.data)
    selectedPlatform.value = filteredPlatforms.value.find(
      (platform) => platform.id === response.data?.platformId
    )
    selectedEmotion.value = emotions.value.find((emotion) => emotion.id === response.data?.emotion)
  }
}

const onSubmit = async () => {
  isLoading.value = true
  try {
    const userId = state.userId?.toString() || null
    const contextId = state.contextId?.toString() || null

    if (isExistingDetails.value) {
      await updateViewingDetails(userId, contextId, state as ViewingDetails)
    } else {
      await createViewingDetails(userId, state as ViewingDetails)
    }
    emit('close')
    useNotifications().success(
      t('common.toasts.title.success'),
      t('viewingDetails.toasts.success.saved')
    )
  } catch (error) {
    useNotifications().error(t('common.toasts.title.error'), t('viewingDetails.toasts.error.save'))
  } finally {
    isLoading.value = false
  }
}

const onDelete = async () => {
  const userId = state.userId?.toString() || null
  const contextId = state.contextId?.toString() || null
  await deleteViewingDetails(userId, contextId)
  emit('close')
}

// Watchers
watch(selectedPlatform, () => {
  state.platformId = Number(selectedPlatform.value?.id) || undefined
})

watch(selectedEmotion, () => {
  state.emotion = selectedEmotion.value?.id as Emotion | undefined
})

// Lifecycle
onMounted(async () => {
  await refreshPlatforms()
  state.contextType = parseContextType(props.contextType)
  state.contextId = Number(props.contextId)
  state.userId = authStore.getUserId

  await fetchViewingDetails()
})
</script>
