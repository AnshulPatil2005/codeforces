import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Trophy, Code2, Menu, X, Github, LogOut, User, Terminal, Code } from 'lucide-react'
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
      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-xl ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
      {children}
    </Link>
  )
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void
}

function MobileNavLink({ to, children, icon: Icon, onClick }: MobileNavLinkProps) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold">{children}</span>
    </Link>
  )
}

function AppContent() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Hide navigation on landing, login, and signup pages for non-authenticated users
  const hideNav = !isAuthenticated && ['/', '/login', '/signup'].includes(location.pathname)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Navigation Header */}
      {!hideNav && (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'bg-gray-900/80 backdrop-blur-lg border-b border-white/10 py-2' : 'bg-transparent py-4'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12">
              <div className="flex items-center gap-8">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-black tracking-tighter text-white uppercase">
                    Codeforces<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">+</span>
                  </h1>
                </Link>

                {isAuthenticated && (
                  <div className="hidden md:flex items-center bg-white/5 p-1 rounded-2xl border border-white/10">
                    <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/leaderboard" icon={Trophy}>Leaderboard</NavLink>
                    <NavLink to="/problems" icon={Code2}>Problems</NavLink>
                    <NavLink to="/ide" icon={Terminal}>IDE</NavLink>
                  </div>
                )}
              </div>

              <div className="hidden md:flex items-center gap-4">
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-sm text-white">{user?.username}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/login"
                      className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-black rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-300 bg-white/5 border border-white/10 rounded-xl"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 p-4 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl animate-in slide-in-from-top-4">
              <div className="flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/10">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="font-bold text-white">{user?.username}</span>
                    </div>
                    <MobileNavLink to="/dashboard" icon={LayoutDashboard} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                    <MobileNavLink to="/leaderboard" icon={Trophy} onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</MobileNavLink>
                    <MobileNavLink to="/problems" icon={Code2} onClick={() => setIsMobileMenuOpen(false)}>Problems</MobileNavLink>
                    <MobileNavLink to="/ide" icon={Terminal} onClick={() => setIsMobileMenuOpen(false)}>IDE</MobileNavLink>
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-bold"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/login" icon={User} onClick={() => setIsMobileMenuOpen(false)}>Login</MobileNavLink>
                    <MobileNavLink to="/signup" icon={Code} onClick={() => setIsMobileMenuOpen(false)}>Sign up</MobileNavLink>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
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
