const express = require('express');
const { Op } = require('sequelize');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const recipeRouter = express.Router();
const defineAssociations = require('../models/defineAssociations')
const RecipeTag = require('../models/recipe_tag')
const RecipeIngredientCategory = require('../models/ingredient_category')
const RecipeIngredient = require('../models/recipe_ingredient')
const Ingredient = require('../models/ingredient')
const { Sequelize } = require('sequelize')

defineAssociations()
// Hàm để xác định độ khó dựa trên readyInMinutes và servings
const calculateDifficulty = (readyInMinutes, servings) => {
  if (readyInMinutes <= 15 && servings <= 2) {
    return 'beginner';
  } else if (readyInMinutes <= 30 && servings <= 4) {
    return 'intermediate';
  } else if (readyInMinutes <= 45 && servings <= 6) {
    return 'advanced';
  } else if (readyInMinutes <= 60 && servings <= 8) {
    return 'expert';
  } else {
    return 'masterchef';
  }
};

// Route để lấy dữ liệu cho bộ lọc
recipeRouter.get('/filter-data', async (req, res) => {
  try {
    const categories = await RecipeTag.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('tag')), 'tag']],
    });

    const ingredients = await RecipeIngredientCategory.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
    });

    const difficulties = ['beginner', 'intermediate', 'advanced', 'expert', 'masterchef'];

    const cookingTimes = [
      { label: '0-15 minutes', value: '0-15' },
      { label: '15-30 minutes', value: '15-30' },
      { label: '30-45 minutes', value: '30-45' },
      { label: '45-60 minutes', value: '45-60' },
      { label: '60+ minutes', value: '60-9999' }
    ];

    res.json({
      categories: categories.map(c => c.tag),
      ingredients: ingredients.map(i => i.category),
      difficulties,
      cookingTimes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Hàm tìm kiếm công thức
const searchRecipes = async ({ searchTerm, category, ingredient, cookingTime, difficulty }) => {
  const whereClause = {
    [Op.and]: [] // Sử dụng Op.and để kết hợp các điều kiện
  };

  // Tách searchTerm thành mảng các từ khóa
  if (searchTerm) {
    const searchTerms = searchTerm.split(/[\s,]+/).filter(Boolean); // Tách bằng dấu cách hoặc dấu phẩy

    // Thêm điều kiện tìm kiếm cho từng từ khóa
    searchTerms.forEach(term => {
      whereClause[Op.and].push({
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${term}%`
            }
          },
          {
            '$RecipeTags.tag$': {
              [Op.like]: `%${term}%`
            }
          },
          {
            '$Ingredients.name$': {
              [Op.like]: `%${term}%`
            }
          }
        ]
      });
    });
  }

  // Nếu có tham số category, thêm vào whereClause
  if (category) {
    whereClause[Op.and].push({
      '$RecipeTags.tag$': {
        [Op.like]: `%${category}%`
      }
    });
  }

  // Nếu có tham số ingredient, thêm vào whereClause
  if (ingredient) {
    whereClause[Op.and].push({
      '$Ingredients.name$': {
        [Op.like]: `%${ingredient}%`
      }
    });
  }

  // Nếu có tham số cookingTime, thêm vào whereClause
  if (cookingTime) {
    const [min, max] = cookingTime.split('-').map(Number);
    whereClause[Op.and].push({
      readyInMinutes: {
        [Op.between]: [min, max]
      }
    });
  }

  // Truy vấn công thức với JOIN
  const recipes = await Recipe.findAll({
    where: whereClause,
    include: [
      {
        model: User, // Tham chiếu đến model User
        attributes: ['username'] // Chỉ lấy trường username
      },
      {
        model: RecipeTag, // Tham chiếu đến model RecipeTag
        attributes: ['tag'] // Chỉ lấy trường tag
      },
      {
        model: Ingredient,
        attributes: ['name']
      }
    ],
    attributes: ['id', 'title', 'image', 'readyInMinutes', 'servings'],
  });

  // Thêm giá trị difficulty vào từng công thức
  const recipesWithDifficulty = recipes.map(recipe => ({
    ...recipe.get(), // Lấy tất cả các thuộc tính của recipe
    difficulty: calculateDifficulty(recipe.readyInMinutes, recipe.servings) || 'unknown' // Thêm difficulty, mặc định là 'unknown' nếu không có
  }));

  // Lọc theo độ khó nếu có
  if (difficulty) {
    return recipesWithDifficulty.filter(recipe => recipe.difficulty === difficulty);
  }

  return recipesWithDifficulty;

};

// Route tìm kiếm công thức
recipeRouter.get('/search', async (req, res) => {
  const { searchTerm, category, ingredient, cookingTime, difficulty } = req.query;

  console.log('Search parameters:', { searchTerm, category, ingredient, cookingTime, difficulty });

  try {
    const recipes = await searchRecipes({ searchTerm, category, ingredient, cookingTime, difficulty });
    return res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = recipeRouter;
