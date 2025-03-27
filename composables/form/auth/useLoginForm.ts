import * as yup from 'yup'

export const useLoginForm = () => {
  const { t } = useI18n()

  const state = reactive<Partial<User>>({
    email: '',
    password: ''
  })

  const schema = yup.object({
    email: yup
      .string()
      .email(t('common.form.error.email'))
      .max(50, t('common.form.error.stringMax', { max: 50 }))
      .required(t('common.form.error.required')),
    password: yup
      .string()
      .required(t('common.form.error.required'))
      .min(8, t('common.form.error.passwordMin'))
      .max(40, t('common.form.error.passwordMax'))
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        t('common.form.error.passwordComplex')
      )
  })

  return { state, schema }
}
