
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import './App.css'
import Landing from './LandingPage/Landing'
import Dashboard from './resultPage/Dashboard'
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
