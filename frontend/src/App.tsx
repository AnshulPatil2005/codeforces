import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Trophy, Code2, Menu, X, Github } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Problems from './pages/Problems'

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
          ? 'bg-blue-50 text-blue-600'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
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
        isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold">{children}</span>
    </Link>
  )
}

function AppContent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Navigation Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                  Codeforces<span className="text-blue-600">+</span>
                </h1>
              </Link>

              <div className="hidden md:flex items-center bg-white/50 p-1 rounded-2xl border border-slate-200/50">
                <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/leaderboard" icon={Trophy}>Leaderboard</NavLink>
                <NavLink to="/problems" icon={Code2}>Problems</NavLink>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
               <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 p-2 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-in slide-in-from-top-4">
            <div className="flex flex-col gap-1">
              <MobileNavLink to="/" icon={LayoutDashboard} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
              <MobileNavLink to="/leaderboard" icon={Trophy} onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</MobileNavLink>
              <MobileNavLink to="/problems" icon={Code2} onClick={() => setIsMobileMenuOpen(false)}>Problems</MobileNavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/problems" element={<Problems />} />
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
