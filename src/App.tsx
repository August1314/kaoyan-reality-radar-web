import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.css'
import { routeLinks, routePaths } from './lib/routes'
import { ScrollToTop } from './components/ScrollToTop'
import { GlobalShortcuts } from './components/GlobalShortcuts'
import { SkipLink } from './components/SkipLink'

// 懒加载页面组件
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const ResultPage = lazy(() => import('./pages/ResultPage').then(m => ({ default: m.ResultPage })))
const FailureDetailPage = lazy(() => import('./pages/FailureDetailPage').then(m => ({ default: m.FailureDetailPage })))
const SubmitPage = lazy(() => import('./pages/SubmitPage').then(m => ({ default: m.SubmitPage })))
const StatsPage = lazy(() => import('./pages/StatsPage').then(m => ({ default: m.StatsPage })))

// 加载占位
function PageLoader() {
  return (
    <main className="page page-loader">
      <div className="loader-content">
        <div className="loader-spinner" />
        <p>加载中...</p>
      </div>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SkipLink />
      <ScrollToTop />
      <GlobalShortcuts />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={routePaths.home} element={<HomePage />} />
          <Route path={routePaths.result} element={<ResultPage />} />
          <Route path={routePaths.failure} element={<FailureDetailPage />} />
          <Route path={routePaths.submit} element={<SubmitPage />} />
          <Route path={routePaths.stats} element={<StatsPage />} />
          <Route path="*" element={<Navigate to={routeLinks.home()} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
