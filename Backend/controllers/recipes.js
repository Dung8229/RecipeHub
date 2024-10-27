const express = require('express');
const { Op } = require('sequelize');
const RecipeTag = require('../models/recipe_tag');
const RecipeIngredientCategory = require('../models/ingredient_category');
const { Sequelize } = require('sequelize');
const { compare } = require('bcrypt');
const recipeRouter = express.Router();
const Recipes = require('../models/recipes_all'); 

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

  // Thêm điều kiện tìm kiếm theo searchTerm
  if (searchTerm) {
    whereClause[Op.and].push({
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        {
          tag: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        {
          ingredient_name: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      ]
    });
  }

  // Nếu có tham số category, thêm vào whereClause
  if (category) {
    whereClause[Op.and].push({
      tag: {
        [Op.like]: `%${category}%`
      }
    });
  }

  // Nếu có tham số ingredient, thêm vào whereClause
  if (ingredient) {
    whereClause[Op.and].push({
      ingredient_name: {
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
  const recipes = await Recipes.findAll({
    where: whereClause,
    attributes: [
      'recipe_id', 'title', 'recipe_image', 'readyInMinutes', 'servings',
      'isSubmission', 'tag', 'ingredient_name', 'ingredient_image', 'userId'
    ],
    group: ['recipe_id'],  // Nhóm các bản ghi theo recipe_id
    distinct: true 
  });

  // Thêm giá trị difficulty vào từng công thức
  const recipesWithDifficulty = recipes.map(recipe => ({
    ...recipe.get(), // Lấy tất cả các thuộc tính của recipe
    difficulty: difficulty || 'unknown' // Thêm difficulty, mặc định là 'unknown' nếu không có
  }));

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
