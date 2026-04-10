import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { routeLinks, routePaths } from './lib/routes'
import { FailureDetailPage } from './pages/FailureDetailPage'
import { HomePage } from './pages/HomePage'
import { ResultPage } from './pages/ResultPage'
import { SubmitPage } from './pages/SubmitPage'
import { ScrollToTop } from './components/ScrollToTop'
import { GlobalShortcuts } from './components/GlobalShortcuts'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalShortcuts />
      <Routes>
        <Route path={routePaths.home} element={<HomePage />} />
        <Route path={routePaths.result} element={<ResultPage />} />
        <Route path={routePaths.failure} element={<FailureDetailPage />} />
        <Route path={routePaths.submit} element={<SubmitPage />} />
        <Route path="*" element={<Navigate to={routeLinks.home()} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
