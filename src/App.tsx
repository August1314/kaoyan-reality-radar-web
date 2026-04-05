import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { FailureDetailPage } from './pages/FailureDetailPage'
import { HomePage } from './pages/HomePage'
import { ResultPage } from './pages/ResultPage'
import { SubmitPage } from './pages/SubmitPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result/:slug" element={<ResultPage />} />
        <Route path="/failure/:id" element={<FailureDetailPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
