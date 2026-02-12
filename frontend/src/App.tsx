import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Trophy, Code2, Menu, X, Github, LogOut, User, Terminal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from './store/authStore'

import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Problems from './pages/Problems'
import Login from './pages/Login'
import Signup from './pages/Signup'
import IDE from './pages/IDE'

interface NavLinkProps {
  to: string
  children: React.ReactNode
  icon: LucideIcon
}

function NavLink({ to, children, icon: Icon }: NavLinkProps) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  )
}

function AppContent() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const hideNav = !isAuthenticated && ['/', '/login', '/signup'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {!hideNav && (
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-gray-900/80 backdrop-blur-lg border-b border-white/10 shadow-lg py-2'
              : 'bg-transparent py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12">
              <div className="flex items-center gap-8">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-black text-white">
                    Codeforces<span className="text-blue-400">+</span>
                  </h1>
                </Link>

                {isAuthenticated && (
                  <div className="hidden md:flex items-center gap-2">
                    <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/leaderboard" icon={Trophy}>Leaderboard</NavLink>
                    <NavLink to="/problems" icon={Code2}>Problems</NavLink>
                    <NavLink to="/ide" icon={Terminal}>IDE</NavLink>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-semibold">{user?.username}</span>
                    </div>

                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-600/30 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-300 hover:text-white text-sm font-semibold">
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-lg hover:from-blue-700 hover:to-purple-700"
                    >
                      Sign up
                    </Link>
                  </>
                )}

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:block p-2 text-gray-400 hover:text-white transition"
                >
                  <Github className="w-5 h-5" />
                </a>

                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white bg-white/10 rounded-lg"
                  >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>

            {isMobileMenuOpen && isAuthenticated && (
              <div className="md:hidden mt-4 flex flex-col gap-2 bg-gray-800 p-4 rounded-xl">
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/leaderboard" icon={Trophy}>Leaderboard</NavLink>
                <NavLink to="/problems" icon={Code2}>Problems</NavLink>
                <NavLink to="/ide" icon={Terminal}>IDE</NavLink>
              </div>
            )}
          </div>
        </nav>
      )}

      <main className={hideNav ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/ide" element={<IDE />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
