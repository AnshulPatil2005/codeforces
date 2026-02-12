import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { LogOut, User, Code, Terminal } from 'lucide-react'
import { useAuthStore } from './store/authStore'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Problems from './pages/Problems'
import Login from './pages/Login'
import Signup from './pages/Signup'
import IDE from './pages/IDE'

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  )
}

function AppContent() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()

  // Hide navigation on landing, login, and signup pages for non-authenticated users
  const hideNav = !isAuthenticated && ['/', '/login', '/signup'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Header */}
      {!hideNav && (
        <nav className="bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-black text-white">
                    Codeforces<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">+</span>
                  </h1>
                </Link>
                {isAuthenticated && (
                  <div className="hidden sm:flex sm:space-x-2">
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/leaderboard">Leaderboard</NavLink>
                    <NavLink to="/problems">Problems</NavLink>
                    <NavLink to="/ide">
                      <Terminal className="w-4 h-4 mr-1 inline" />
                      IDE
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Auth section */}
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-white">{user?.username}</span>
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
                    <Link
                      to="/login"
                      className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={hideNav ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
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
