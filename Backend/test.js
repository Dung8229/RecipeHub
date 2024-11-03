const User = require('./models/user')
const Recipe = require('./models/recipe')
const { Sequelize } = require('sequelize')

async function getRecipes() {
    try {
        const recipes = await Recipe.findAll({
            where: {
                id: {
                    [Sequelize.Op.between]: [100010, 100020] // Lấy các id từ 100010 đến 100020
                }
            },
            include: [{
                model: User, // Tham chiếu đến model User
                attributes: ['username'] // Chỉ lấy trường username
            }],
            attributes: ['readyInMinutes', 'summary'], // Chỉ lấy các trường cần thiết từ Recipe
        });

        // Chuyển đổi dữ liệu để trả về đúng định dạng
        const result = recipes.map(recipe => ({
            readyInMinutes: recipe.readyInMinutes,
            summary: recipe.summary,
            username: recipe.User.username // Truy cập username từ quan hệ
        }));

        return result;

    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}

// Gọi hàm và in ra kết quả
getRecipes().then(recipes => {
    console.log(recipes);
}).catch(err => {
    console.error(err);
});
