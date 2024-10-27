import { useState, useEffect } from 'react'
import userService from './services/users'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

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
        {/* Route cho trang chủ */}
        <Route path="/" element={<HomePage recipes={recipes} user={latestUser} />} />
        
        {/* Route cho trang login */}
        {/* <Route path="/login" element={<LoginPage />} /> */}

        {/* Route cho trang chi tiết công thức */}
        {/* <Route path="/recipes/:id/information" element={<RecipeInformation id={}/>} /> */}
      </Routes>
    </Router>
  );
}

export default App