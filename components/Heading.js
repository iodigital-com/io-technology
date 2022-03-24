const Heading = (level) => {
  const Tag = `h${level}`

  let classes = {
    h1: 'text-6xl',
    h2: 'text-4xl',
    h3: 'text-2xl',
    h4: 'text-xl',
    h5: 'text-xl font-semibold',
    h6: 'text-xl font-semibold',
  }

  return (props) => (
    <Tag id={props.id} className={classes[Tag]}>
      {props.children}
    </Tag>
  )
}

export default Heading
