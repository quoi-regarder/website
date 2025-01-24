import * as yup from 'yup'

export const useSignupForm = () => {
  const { t } = useI18n()

  const state = reactive<Partial<Profile> & Partial<User> & { passwordConfirmation: string }>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirmation: ''
  })

  const termsState = reactive({
    terms: false
  })

  const schema = yup.object({
    email: yup
      .string()
      .email(t('common.form.error.email'))
      .required(t('common.form.error.required')),
    username: yup
      .string()
      .required(t('common.form.error.required'))
      .min(3, t('common.form.error.stringMin', { min: 3 })),
    firstName: yup.string().nullable(),
    lastName: yup.string().nullable(),
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

  const termsSchema = yup.object({
    terms: yup.boolean().required(t('common.form.error.required'))
  })

  return { state, schema, termsState, termsSchema }
}
