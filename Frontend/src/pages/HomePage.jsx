import Recipe from "../components/Recipe"

const HomePage = ({recipes, user}) => {
  return (
    <div>
      <p>Welcome latest user <mark>{user}</mark></p>
      <h1>Recipes</h1>
      <ul>
        {recipes.map(recipe => 
          <Recipe 
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            imageUrl={recipe.image}
            imageType={recipe.imageType}/>
          )
        }
      </ul>
    </div>
  )
}

export default HomePage