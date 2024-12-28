import * as yup from 'yup'

export const useUpdatePasswordForm = () => {
  const { t } = useI18n()

  const state = reactive<UpdatePassword>({
    password: '',
    passwordConfirmation: ''
  })

  const setState = (updatePassword: Partial<typeof state>) => {
    Object.assign(state, updatePassword)
  }

  const schema = yup.object({
    password: yup
      .string()
      .required(t('common.form.error.required'))
      .min(8, t('common.form.error.passwordMin'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/,
        t('common.form.error.passwordComplex')
      ),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], t('common.form.error.passwordMatch'))
      .required(t('common.form.error.required'))
  })

  return { state, setState, schema }
}
