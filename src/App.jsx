import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AnimatedSlider from './components/AnimatedSlider'
import Home from './pages/home/Home'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
    </div>
  )
}

export default App 