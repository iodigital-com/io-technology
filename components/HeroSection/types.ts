export interface HeroSectionProps {
  title: string
  description?: string
  imageSrc: string
  imageAlt?: string
  showForm?: boolean
  formConfig?: {
    portalId: string
    formId: string
  } | null
  imagePosition?: 'right' | 'left'
}
