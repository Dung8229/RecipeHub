// Code cũ

import Recipe from "../components/Recipe"

const HomePage = ({recipes, user}) => {
  return (
    <div>
      <p className="underline text-primary">Welcome latest user <mark>{user}</mark></p>
      <h1>Recipes</h1>
      <div>
        {recipes.map(recipe => 
          <Recipe 
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            imageUrl={recipe.image}
            imageType={recipe.imageType}/>
          )
        }
      </div>
    </div>
  )
}

export default HomePage