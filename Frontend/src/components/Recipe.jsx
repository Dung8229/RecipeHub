// Code cũ

const Recipe = ({ id, title, imageUrl }) => {
  return (
    <li>
      <span>{id}</span>
      <h2>{title}</h2>
      <img src={imageUrl} alt="recipe image" />
    </li>
  )
}

export default Recipe