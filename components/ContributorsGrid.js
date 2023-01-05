import Contributor from '@/components/Contributor'
import shuffle from '@/lib/shuffle'

const ContributorsGrid = ({ contributors }) => {
  const shuffled = shuffle(contributors)
  return (
    <div className="grid grid-cols-3 gap-y-8 md:grid-cols-4 md:gap-y-10 xl:grid-cols-5 xl:gap-y-12">
      {shuffled.map((contributor) => (
        <Contributor key={contributor.name} contributor={contributor} />
      ))}
    </div>
  )
}

export default ContributorsGrid
