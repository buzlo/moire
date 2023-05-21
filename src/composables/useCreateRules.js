import { required, email, helpers } from '@vuelidate/validators'

export function useCreateRules() {
  const phoneWithMessage = helpers.withMessage(
    'Некорректный формат телефона',
    helpers.regex(/\d{11}/)
  )
  const requiredWithMessage = helpers.withMessage('Обязательное поле', required)
  const emailWithMessage = helpers.withMessage('Некорректный формат email', email)
  const rules = {
    name: { requiredWithMessage },
    phone: { phoneWithMessage, requiredWithMessage },
    address: { requiredWithMessage },
    email: { emailWithMessage, requiredWithMessage }
  }

  return rules
}
