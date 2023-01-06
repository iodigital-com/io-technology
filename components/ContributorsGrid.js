import Contributor from '@/components/Contributor'

const ContributorsGrid = ({ contributors }) => {
  return (
    <div className="grid grid-cols-3 gap-y-8 md:grid-cols-4 md:gap-y-10 xl:grid-cols-5 xl:gap-y-12">
      {contributors.map((contributor) => (
        <Contributor key={contributor.slug[0]} contributor={contributor} />
      ))}
    </div>
  )
}

export default ContributorsGrid
