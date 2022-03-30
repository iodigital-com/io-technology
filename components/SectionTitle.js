export default function SectionTitle({ children, id }) {
  return (
    <div className="container mx-auto">
      <div className="pt-20 pb-8 xl:grid xl:grid-cols-4">
        <h2
          id={id}
          className="pt-8 text-3xl font-medium text-gray-900 sm:text-4xl md:text-7xl xl:col-span-3 xl:col-start-2"
        >
          {children}
        </h2>
      </div>
    </div>
  )
}
