<template>
  <UModal :title="t(`common.content.buttons.${props.contextType}.viewingDetails`)">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <LazyFieldSingleSelect
          v-model="platforms"
          v-model:selected-model="selectedPlatform"
          :label="t('viewingDetails.form.fields.platform')"
          :placeholder="t('viewingDetails.form.placeholders.platform')"
          name="platformId"
        />

        <FieldSlider
          v-model="state.rating"
          :label="t('viewingDetails.form.fields.rating')"
          name="rating"
          :min="0"
          :max="100"
          :step="1"
          required
        />

        <FieldCheckBox
          v-model="state.liked"
          :label="t('viewingDetails.form.fields.liked')"
          name="liked"
        />

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
const props = defineProps<{
  contextType: ContentType
  contextId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const selectedPlatform = ref<Option | undefined>(undefined)

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
const selectedEmotion = ref<Option | undefined>(undefined)

const { state, setState, schema } = useViewingDetailsForm()
const authStore = useAuthStore()
const { getViewingDetails, createViewingDetails, updateViewingDetails, deleteViewingDetails } =
  useViewingDetailsService()
const isLoading = ref(false)
const isExistingDetails = ref(false)

onMounted(async () => {
  await refreshPlatforms()
  state.contextType = parseContextType(props.contextType)
  state.contextId = Number(props.contextId)
  state.userId = authStore.getUserId

  await fetchViewingDetails()
})

const fetchViewingDetails = async () => {
  const userId = state.userId?.toString() || null
  const contextId = state.contextId?.toString() || null
  const response: ApiResponse<ViewingDetails> = await getViewingDetails(userId, contextId)

  if (response.data) {
    isExistingDetails.value = true
    setState(response.data)
    selectedPlatform.value = platforms.value.find(
      (platform) => platform.id === response.data?.platformId
    )
    selectedEmotion.value = emotions.value.find((emotion) => emotion.id === response.data?.emotion)
  }
}

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

const emotions = computed(() => {
  const emotionIcons = {
    MOVED: 'i-lucide-heart',
    HAPPY: 'i-lucide-smile',
    SAD: 'i-lucide-frown',
    INSPIRED: 'i-lucide-lightbulb',
    THRILLED: 'i-lucide-flame',
    SCARED: 'i-lucide-ghost',
    BORED: 'i-lucide-clock',
    DISAPPOINTED: 'i-lucide-thumbs-down',
    CONFUSED: 'i-lucide-help-circle',
    RELAXED: 'i-lucide-cloud'
  }

  return Object.values(Emotion).map((emotion) => ({
    id: emotion,
    label: t(`viewingDetails.emotions.${emotion}`),
    icon: emotionIcons[emotion as keyof typeof emotionIcons]
  }))
})

watch(selectedPlatform, () => {
  state.platformId = Number(selectedPlatform.value?.id) || undefined
})

watch(selectedEmotion, () => {
  state.emotion = selectedEmotion.value?.id as Emotion | undefined
})
</script>
