const express = require('express');
const router = express.Router();
const RecipeComment = require('../models/recipe_comment');
const User = require('../models/user');
const Recipe = require('../models/recipe');
const { Op } = require('sequelize');
const middleware = require('../utils/middleware');

// Get comments list with pagination and search
const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // comments per page
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search || '';

    const { count, rows: comments } = await RecipeComment.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Recipe,
          attributes: ['title'],
        },
      ],
      where: {
        [Op.or]: [
          { commentText: { [Op.like]: `%${searchTerm}%` } },
          { '$User.username$': { [Op.like]: `%${searchTerm}%` } },
          { '$Recipe.title$': { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Format response data
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.commentText,
      username: comment.User.username,
      recipeName: comment.Recipe.title,
      createdAt: comment.createdAt,
    }));

    res.json({
      comments: formattedComments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });

  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await RecipeComment.findByPk(id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Routes
router.get('/', getComments);
router.delete('/:id', deleteComment);

module.exports = router;