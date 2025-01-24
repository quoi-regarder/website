import * as yup from 'yup'

export const useForgotPasswordForm = () => {
  const { t } = useI18n()

  const state = reactive<Partial<User>>({
    email: ''
  })

  const schema = yup.object({
    email: yup
      .string()
      .email(t('common.form.error.email'))
      .required(t('common.form.error.required'))
  })

  return { state, schema }
}
