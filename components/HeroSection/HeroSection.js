import Image from '@/components/Image'
import { useBrandingTheme } from '@/lib/hooks/useBrandingTheme'
import HubspotForm from '@/components/HubspotForm'

const HeroSection = ({
  title,
  description,
  imageSrc,
  imageAlt = '',
  showForm = false,
  formConfig = null,
  imagePosition = 'right', // 'right' or 'left'
}) => {
  const { theme } = useBrandingTheme()

  return (
    <section className={`bg-io_${theme}-500`}>
      <div className="container mx-auto pb-24 pt-8 md:pb-32">
        <div className="grid grid-cols-12">
          <div className="col-start-1 col-end-12 mb-8 md:col-end-8 md:mb-10 md:mt-4 xl:row-start-1 xl:mb-16 xl:mt-12">
            <h1 className="text-4xl md:text-5xl xl:text-7xl">{title}</h1>
          </div>
          <div
            className={`col-start-1 col-end-12 mb-8 md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-4 md:mb-0 xl:row-start-1 ${
              imagePosition === 'right' ? 'xl:col-start-9' : 'xl:col-start-8'
            }`}
          >
            <Image
              src={imageSrc}
              width={1192}
              height={1192}
              className="h-auto w-full rounded-full"
              alt={imageAlt}
            />
          </div>
          {(description || showForm) && (
            <div
              className={`col-span-full md:col-span-5 ${
                showForm
                  ? 'md:col-start-4 xl:col-span-6'
                  : 'md:col-start-3 xl:col-span-4 xl:col-start-3'
              }`}
            >
              <div className="xl:w-11/12">
                {description && <p className="mb-4">{description}</p>}
                {showForm && formConfig && (
                  <HubspotForm portalId={formConfig.portalId} formId={formConfig.formId} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
