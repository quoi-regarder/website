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
      .max(50, t('common.form.error.stringMax', { max: 50 }))
      .email(t('common.form.error.email'))
      .required(t('common.form.error.required')),
    username: yup
      .string()
      .max(254, t('common.form.error.stringMax', { max: 254 }))
      .min(3, t('common.form.error.stringMin', { min: 3 }))
      .required(t('common.form.error.required')),
    firstName: yup
      .string()
      .max(254, t('common.form.error.stringMax', { max: 254 }))
      .nullable(),
    lastName: yup
      .string()
      .max(254, t('common.form.error.stringMax', { max: 254 }))
      .nullable(),
    password: yup
      .string()
      .required(t('common.form.error.required'))
      .min(8, t('common.form.error.passwordMin'))
      .max(50, t('common.form.error.passwordMax'))
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
