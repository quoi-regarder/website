import * as yup from 'yup'

export const useProfileForm = () => {
  const { t } = useI18n()

  const state = reactive<Partial<Profile>>({
    avatarUrl: '',
    firstName: '',
    lastName: '',
    username: ''
  })

  const setState = (profile: Partial<typeof state> | null) => {
    if (!profile) return
    Object.assign(state, profile)
  }

  const schema = yup.object({
    avatarUrl: yup
      .string()
      .max(254, t('common.form.error.stringMax', { max: 254 }))
      .nullable(),
    firstName: yup
      .string()
      .max(254, t('common.form.error.stringMax', { max: 254 }))
      .nullable(),
    lastName: yup
      .string()
      .max(254, t('common.form.error.stringMax', { max: 254 }))
      .nullable(),
    username: yup
      .string()
      .required(t('common.form.error.required'))
      .min(3, t('common.form.error.stringMin', { min: 3 }))
      .max(254, t('common.form.error.stringMax', { max: 254 }))
  })

  return { state, setState, schema }
}
