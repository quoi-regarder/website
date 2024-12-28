import * as yup from 'yup'

export const useForgotPasswordForm = () => {
  const { t } = useI18n()

  const state = reactive<ForgotPassword>({
    email: ''
  })

  const setState = (forgotPassword: Partial<typeof state>) => {
    Object.assign(state, forgotPassword)
  }

  const schema = yup.object({
    email: yup
      .string()
      .email(t('common.form.error.email'))
      .required(t('common.form.error.required'))
  })

  return { state, setState, schema }
}
