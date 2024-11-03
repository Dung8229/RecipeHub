const Recipe = require('./recipe');
const User = require('./user')
const ShoppinglistRecipe = require('./shoppinglist_recipe')
const RecipeTag = require('./recipe_tag')
const RecipeRating = require('./recipe_rating')
const RecipeInstruction = require('./recipe_instruction')
const RecipeIngredient = require('./recipe_ingredient')
const Ingredient = require('./ingredient')
const RecipeComment = require('./recipe_comment')
const RecipeAverageRating = require('./recipe_averagerating')
const IngredientNutrition = require('./ingredient_nutrition')
const IngredientCategory = require('./ingredient_category')
const IngredientCaloricbreakdown = require('./ingredient_caloricbreakdown')
const Favourites = require('./favourites')
const Competition = require('./competition')
const CompetitionParticipant = require('./competition_participant')

function defineAssociations() {
  Recipe.belongsTo(User, { foreignKey: 'userId' });
  User.hasMany(Recipe, { foreignKey: 'userId' });

  User.belongsToMany(Recipe, { through: ShoppinglistRecipe, foreignKey: 'userId' });
  Recipe.belongsToMany(User, { through: ShoppinglistRecipe, foreignKey: 'recipeId' });

  Recipe.hasMany(RecipeTag, { foreignKey: 'recipe_id' });
  RecipeTag.belongsTo(Recipe, { foreignKey: 'recipe_id' });

  User.hasMany(RecipeRating, { foreignKey: 'userId' });
  RecipeRating.belongsTo(User, { foreignKey: 'userId' });
  Recipe.hasMany(RecipeRating, { foreignKey: 'recipeId' });
  RecipeRating.belongsTo(Recipe, { foreignKey: 'recipeId' });

  Recipe.hasMany(RecipeInstruction, { foreignKey: 'recipeId' });
  RecipeInstruction.belongsTo(Recipe, { foreignKey: 'recipeId' });

  Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, foreignKey: 'recipeId' });
  Ingredient.belongsToMany(Recipe, { through: RecipeIngredient, foreignKey: 'ingredientId' })

  Recipe.hasMany(RecipeComment, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
  RecipeComment.belongsTo(Recipe, { foreignKey: 'recipeId' });

  User.hasMany(RecipeComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
  RecipeComment.belongsTo(User, { foreignKey: 'userId' });

  Recipe.hasOne(RecipeAverageRating, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
  RecipeAverageRating.belongsTo(Recipe, { foreignKey: 'recipeId' });

  Ingredient.hasMany(IngredientNutrition, {
    foreignKey: 'ingredientId',
  });  
  IngredientNutrition.belongsTo(Ingredient, {
    foreignKey: 'ingredientId',
  });

  Ingredient.hasMany(IngredientCategory, {
    foreignKey: 'ingredientId',
  });  
  IngredientCategory.belongsTo(Ingredient, {
    foreignKey: 'ingredientId',
  });

  Ingredient.hasOne(IngredientCaloricbreakdown, {
    foreignKey: 'ingredientId',
  });
  IngredientCategory.belongsTo(Ingredient, {
    foreignKey: 'ingredientId',
  });

  User.belongsToMany(Recipe, {
    through: Favourites,
    foreignKey: 'userId',
  });
  Recipe.belongsToMany(User, {
      through: Favourites,
      foreignKey: 'recipeId',
  });

  Competition.belongsToMany(User, {
    through: CompetitionParticipant,
    foreignKey: 'competitionId',
  });
  User.belongsToMany(Competition, {
    through: CompetitionParticipant,
    foreignKey: 'userId',
  });
}

module.exports = defineAssociations;