// src/router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import H from '../pages/Home'

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
       
      </Routes>
    </Router>
  )
}
