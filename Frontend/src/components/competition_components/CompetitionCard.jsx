const CompetitionCard = ({ id, title, description, image, timesLeft }) => {
  return (
    <div>
      <h3 className="title">{title}</h3>
      <p className="description">{description}</p>
      <button>View</button>
      <img src={image} alt="Competition Pic"/>

    </div>
  )
}

export default CompetitionCard