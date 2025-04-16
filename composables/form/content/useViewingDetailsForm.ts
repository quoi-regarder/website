import * as yup from 'yup'

export const useViewingDetailsForm = () => {
  const { t } = useI18n()

  const state = reactive<Partial<ViewingDetails>>({
    platformId: 0,
    rating: 75,
    liked: true,
    emotion: undefined,
    contextType: undefined,
    contextId: undefined,
    userId: undefined
  })

  const setState = (data: Partial<ViewingDetails>) => {
    Object.assign(state, data)
  }

  const schema = yup.object({
    platformId: yup.number(),
    rating: yup
      .number()
      .min(0, t('common.form.error.numberMin', { min: 0 }))
      .max(100, t('common.form.error.numberMax', { max: 100 })),
    liked: yup.boolean().required(t('common.form.error.required')),
    emotion: yup.string().oneOf(Object.values(Emotion))
  })

  return {
    state,
    setState,
    schema
  }
}
