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
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        t('common.form.error.passwordComplex')
      ),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], t('common.form.error.passwordMatch'))
      .required(t('common.form.error.required'))
  })

  return { state, setState, schema }
}
