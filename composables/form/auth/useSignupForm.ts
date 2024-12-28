import * as yup from 'yup'

export const useSignupForm = () => {
  const { t } = useI18n()

  const state = reactive<Signup>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirmation: ''
  })

  const setState = (signup: Partial<typeof state>) => {
    Object.assign(state, signup)
  }

  const schema = yup.object({
    email: yup
      .string()
      .email(t('common.form.error.email'))
      .required(t('common.form.error.required')),
    username: yup
      .string()
      .required(t('common.form.error.required'))
      .min(3, t('common.form.error.stringMin', { min: 3 })),
    firstName: yup.string(),
    lastName: yup.string(),
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
