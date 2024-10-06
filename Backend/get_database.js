const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');
const Recipe = require('./models/recipe')
const RecipeTag = require('./models/recipe_tag')
const RecipeInstruction = require('./models/recipe_instruction')
const config = require('./utils/config')
const logger = require('./utils/logger')
const sequelize = require('./db')

sequelize.authenticate() // Kiểm tra kết nối
  .then(() => {
    logger.info('Kết nối db thành công!')
  })

// Hàm lấy recipes từ Spoonacular API
async function fetchRecipesAndSave() {
  const apiKey = '22dbdb3252d3488fa93c58cb226f78e4';
  const ids = Array.from({ length: 500 }, (_, i) => 100101 + i); //100000 -> 100158
  const userId = 1

  for (const recipeId of ids) {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
      const recipeData = response.data;

      // Chỉ lấy các trường cần thiết để lưu vào bảng recipe
      const { id, title, image, imageType, summary, readyInMinutes, servings } = recipeData;

      // Lưu dữ liệu vào bảng recipe
      const recipe = await Recipe.create({
        id,
        userId,
        title,
        image,
        imageType,
        summary,
        readyInMinutes,
        servings,
      });

      // Lưu các tag vào bảng recipe_tag nếu có
      const tags = [];

      // Các tag boolean
      if (recipeData.dairyFree) tags.push('dairy_free');
      if (recipeData.glutenFree) tags.push('gluten_free');
      if (recipeData.vegan) tags.push('vegan');
      if (recipeData.veryHealthy) tags.push('very_healthy');
      if (recipeData.veryPopular) tags.push('very_popular');
      if (recipeData.cheap) tags.push('cheap');
      if (recipeData.ketogenic) tags.push('ketogenic');
      if (recipeData.whole30) tags.push('whole30');

      recipeData.dishTypes.forEach(dishType => {
        tags.push(dishType);
      });

      // Lưu các tag vào bảng recipe_tag
      for (const tag of tags) {
        await RecipeTag.create({
          recipe_id: recipeData.id,
          tag,
        });
      }

      console.log(`Saved recipe ${title} with ID ${recipeId} and tags: ${tags.join(', ')}`);
    } catch (error) {
      console.error(`Error fetching recipe with ID ${recipeId}:`, error.message);
    }
  }
}

// Hàm lấy và lưu instructions từ API
async function fetchAndSaveInstructions() {
  const apiKey = '22dbdb3252d3488fa93c58cb226f78e4';
  
  for (let recipeId = 100000; recipeId <= 100080; recipeId++) {
    const existingInstructions = await RecipeInstruction.findOne({
      where: { recipeId: recipeId }
    });
    if (existingInstructions) continue
    try {
      const url = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${apiKey}`;
      const response = await axios.get(url);

      // Kiểm tra nếu có dữ liệu instructions
      if (response.data.length > 0 && response.data[0].steps) {
        const instructions = response.data[0].steps.map(step => ({
          recipeId: recipeId,
          stepNumber: step.number,
          content: step.step
        }));

        // Lưu vào database
        await RecipeInstruction.bulkCreate(instructions);
        console.log(`Instructions for recipe ${recipeId} saved successfully!`);
      } else {
        console.log(`No instructions found for recipe ${recipeId}`);
      }

    } catch (error) {
      console.error(`Error fetching/saving instructions for recipe ${recipeId}:`, error.message);
    }
  }
}

// Kết nối đến cơ sở dữ liệu và chạy hàm fetchRecipesAndSave
sequelize.sync().then(() => {
  fetchAndSaveInstructions()
});
