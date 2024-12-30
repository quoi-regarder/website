import * as yup from 'yup'

export const useProfileForm = () => {
  const { t } = useI18n()

  const state = reactive<Tables<'profiles'>>({
    avatar_url: '',
    created_at: '',
    updated_at: '',
    email: '',
    first_name: '',
    id: '',
    last_name: '',
    username: '',
    language: 'fr'
  })

  const setState = (profile: Partial<typeof state>) => {
    Object.assign(state, profile)
  }

  const schema = yup.object({
    avatar_url: yup.string().nullable(),
    email: yup
      .string()
      .email(t('common.form.error.email'))
      .required(t('common.form.error.required')),
    first_name: yup.string().nullable(),
    last_name: yup.string().nullable(),
    username: yup.string().required(t('common.form.error.required'))
  })

  return { state, setState, schema }
}
