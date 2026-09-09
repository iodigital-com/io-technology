// ===========================
// FORM TYPES
// ===========================

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface FormValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: FormValidationError[]
  isSubmitting: boolean
  isValid: boolean
}
