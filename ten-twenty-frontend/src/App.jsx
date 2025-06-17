import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </div>
  )
}

export default App 