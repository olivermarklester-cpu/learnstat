import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import Sidebar from './components/layout/Sidebar'
import TopicRouter from './components/layout/TopicRouter'
import ProgressDashboard from './components/layout/ProgressDashboard'
import FormulaMap from './components/layout/FormulaMap'
import FloatingCalculator from './components/shared/FloatingCalculator'
import './index.css'

function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed top-3 left-3 z-50 bg-white border border-border rounded-lg p-2 shadow-sm hover:bg-gray-50 transition-colors"
      aria-label="Open navigation"
    >
      <svg className="w-5 h-5 text-textDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile hamburger — only visible on small screens */}
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/mean-median-mode" replace />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/formula-map" element={<FormulaMap />} />
            <Route path="/:topicSlug" element={<TopicRouter />} />
          </Routes>
        </div>
        {/* Rounding note footer */}
        <footer className="text-xs text-textMuted text-center py-3 border-t border-border flex-shrink-0">
          All statistics are rounded to 2 decimal places for display. Full precision is used in all calculations.
        </footer>
      </main>

      {/* Floating scientific calculator */}
      <FloatingCalculator />
    </div>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </ProgressProvider>
  )
}
