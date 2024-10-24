import { useState, useEffect } from 'react'
import userService from './services/users'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExploreCompetitionPage from './pages/ExploreCompetition';

const openComps = [
  {
    "id": 1,
    "title": "Best Spaghetti",
    "description": "Challenge the best spaghetti maker around the world",
    "image": "https://img.spoonacular.com/recipes/716429-556x370.jpg",
    "timesLeft": 5
  },
  {
    "id": 2,
    "title": "Best Spaghetti",
    "description": "Challenge the best spaghetti maker around the world",
    "image": "https://img.spoonacular.com/recipes/100006-556x370.jpg",
    "timesLeft": 5
  },
  {
    "id": 23,
    "title": "Best Sushi",
    "description": "Challenge the best spaghetti maker around the world Challenge the best spaghetti maker around the world",
    "image": "https://img.spoonacular.com/recipes/715538-312x231.jpg",
    "timesLeft": 5
  },
]

const closedComps = [
  {
    "id": 1,
    "title": "Best Spaghetti",
    "description": "Challenge the best spaghetti maker around the world",
    "image": "https://img.spoonacular.com/recipes/716429-556x370.jpg",
    "timesLeft": 0
  },
  {
    "id": 2,
    "title": "Best Spaghetti",
    "description": "Challenge the best spaghetti maker around the world",
    "image": "https://img.spoonacular.com/recipes/100006-556x370.jpg",
    "timesLeft": 0
  },
  {
    "id": 23,
    "title": "Best Sushi",
    "description": "Challenge the best spaghetti maker around the world Challenge the best spaghetti maker around the world",
    "image": "https://img.spoonacular.com/recipes/715538-312x231.jpg",
    "timesLeft": 0
  },
]

const App = () => {
  const [latestUser, setLatestUser] = useState('')

  useEffect(() => {
    userService
      .getAll()
      .then(
        users => {
          setLatestUser(users[users.length - 1].username)
        }
      )
  })

  return (
    <Router>
      <Routes>
        <Route path="/competitions/open" element={<ExploreCompetitionPage/>} />
        <Route path="/competitions/closed" element={<ExploreCompetitionPage/>} />
        <Route path="/" element={<HomePage/>} />
      </Routes>
    </Router>
  );
}

export default App