import { ArrowLeft, ChevronDown, List, LogOut, MapPin, Menu, MessageSquare, Moon, PlusCircle, Search, Settings, ShieldCheck, Sun, User as UserIcon, X } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { WILAYAS } from '../constants';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onPostAd: () => void;
  selectedWilaya?: string;
  onWilayaChange?: (wilaya: string) => void;
  variant?: 'default' | 'auto' | 'real-estate' | 'jobs' | 'services';
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onSignIn, 
  onSignOut, 
  onPostAd,
  selectedWilaya,
  onWilayaChange,
  variant = 'default'
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isWilayaOpen, setIsWilayaOpen] = React.useState(false);
  const [wilayaFilter, setWilayaFilter] = React.useState('');
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const wilayaRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wilayaRef.current && !wilayaRef.current.contains(e.target as Node)) {
        setIsWilayaOpen(false);
        setWilayaFilter('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode === 'dark');
    window.localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const getTheme = () => {
    switch (variant) {
      case 'auto': return { bg: 'bg-slate-900', text: 'text-white', accent: 'text-red-500', button: 'bg-red-600 hover:bg-red-700', border: 'border-slate-800' };
      case 'real-estate': return { bg: 'bg-emerald-900', text: 'text-white', accent: 'text-emerald-400', button: 'bg-emerald-600 hover:bg-emerald-700', border: 'border-emerald-800' };
      case 'jobs': return { bg: 'bg-blue-900', text: 'text-white', accent: 'text-blue-400', button: 'bg-blue-600 hover:bg-blue-700', border: 'border-blue-800' };
      case 'services': return { bg: 'bg-violet-900', text: 'text-white', accent: 'text-violet-400', button: 'bg-violet-600 hover:bg-violet-700', border: 'border-violet-800' };
      default: return { bg: 'bg-white', text: 'text-slate-900', accent: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700', border: 'border-gray-200' };
    }
  };

  const theme = getTheme();
  const isDark = variant !== 'default';
  const isDarkMode = themeMode === 'dark';

  return (
    <nav className={`sticky top-0 z-50 ${theme.bg} ${theme.border} border-b shadow-sm transition-colors duration-300`}>
      <div className="w-full pl-0 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex justify-between h-16 items-center gap-4">

          {/* Left: Back button + Logo */}
          <div className="flex items-center gap-3">
            {isDark ? (
              <Link
                to="/"
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 opacity-0 pointer-events-none select-none" aria-hidden="true">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </div>
            )}
            <div className={`h-6 w-px ${isDark ? 'bg-white/20' : 'bg-gray-200'}`}></div>

            <Link to="/" className="flex items-center gap-2 group">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-blue-600'} transition-colors`}>
                <span className="font-bold text-xl text-white">D</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-xl leading-none tracking-tight ${isDarkMode ? 'text-white' : theme.text}`}>DABERLI</span>
                {isDark && (
                  <span className={`text-xs font-medium uppercase tracking-widest ${isDarkMode ? 'text-white/80' : theme.accent}`}>
                    {variant!.replace('-', ' ')}
                  </span>
                )}
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
              className={`inline-flex items-center justify-center h-10 w-10 rounded-full border transition-colors ${isDark ? 'border-white/10 text-white/80 hover:text-white hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wilaya Selector (Only show if props provided) */}
            {selectedWilaya !== undefined && onWilayaChange && (
              <div className="relative" ref={wilayaRef}>
                {/* Single unified pill */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-slate-700'}`}>
                  {/* Location button */}
                  <button
                    onClick={() => { setIsWilayaOpen(!isWilayaOpen); setIsSearchOpen(false); setWilayaFilter(''); }}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <MapPin className={`w-4 h-4 shrink-0 ${theme.accent}`} />
                    <span className="text-sm font-medium">{selectedWilaya || 'All Algeria'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDark ? 'text-white/50' : 'text-gray-400'} ${isWilayaOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Divider */}
                  <div className={`h-4 w-px ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />

                  {/* Search toggle */}
                  <button
                    onClick={() => { setIsSearchOpen(!isSearchOpen); setIsWilayaOpen(false); setSearchQuery(''); setWilayaFilter(''); }}
                    aria-label="Search"
                    className={`transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-blue-600'} ${isSearchOpen ? isDark ? 'text-white' : 'text-blue-600' : ''}`}
                  >
                    {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>

                {/* Wilaya dropdown */}
                {isWilayaOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    {/* Filter input */}
                    <div className="p-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                          autoFocus
                          type="text"
                          value={wilayaFilter}
                          onChange={(e) => setWilayaFilter(e.target.value)}
                          placeholder="Filter wilayas..."
                          className="bg-transparent text-sm focus:outline-none w-full text-slate-900 placeholder-gray-400"
                        />
                        {wilayaFilter && (
                          <button type="button" aria-label="Clear filter" onClick={() => setWilayaFilter('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Options list */}
                    <ul className="max-h-60 overflow-y-auto py-1">
                      {[{ code: '', name: 'All Algeria' }, ...WILAYAS]
                        .filter(w => w.name.toLowerCase().includes(wilayaFilter.toLowerCase()) || w.code.toString().includes(wilayaFilter))
                        .map((w) => (
                          <li key={w.code}>
                            <button
                              onClick={() => { onWilayaChange(w.name === 'All Algeria' ? '' : w.name); setIsWilayaOpen(false); setWilayaFilter(''); }}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                (selectedWilaya === w.name || (w.name === 'All Algeria' && !selectedWilaya))
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {w.code ? `${w.code} - ${w.name}` : w.name}
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Search dropdown */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <Search className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search listings..."
                        className="bg-transparent text-sm focus:outline-none w-full text-slate-900 placeholder-gray-400"
                      />
                      {searchQuery && (
                        <button type="button" aria-label="Clear search" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={`h-6 w-px ${isDark ? 'bg-white/20' : 'bg-gray-200'}`}></div>

            {/* Post Ad Button */}
            <button 
              onClick={onPostAd}
              className={`${theme.button} text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-900/20`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Ad</span>
            </button>

            {/* User Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center space-x-3 focus:outline-none ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-50'} p-1.5 pr-3 rounded-full transition-colors border ${isDark ? 'border-white/10' : 'border-transparent'}`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-white text-slate-900' : 'bg-blue-100 text-blue-600'}`}>
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className={`text-sm font-semibold leading-none ${theme.text}`}>{user.name}</p>
                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'} mt-0.5`}>View Profile</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-400'}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 ring-1 ring-black ring-opacity-5 transition-all z-50 overflow-hidden transform origin-top-right">
                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate mt-1">{user.email}</p>
                    </div>
                    <div className="p-2">
                        {user.isAdmin && (
                          <Link to="/admin" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                            <ShieldCheck className="w-4 h-4 mr-3 text-gray-400" /> Admin Panel
                          </Link>
                        )}
                        <Link to="/profile" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                        <UserIcon className="w-4 h-4 mr-3 text-gray-400" /> My Profile
                        </Link>
                        <Link to="/my-ads" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                        <List className="w-4 h-4 mr-3 text-gray-400" /> My Listings
                        </Link>
                        <Link to="/messages" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                        <MessageSquare className="w-4 h-4 mr-3 text-gray-400" /> Messages
                        </Link>
                        <Link to="/settings" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors">
                        <Settings className="w-4 h-4 mr-3 text-gray-400" /> Settings
                        </Link>
                    </div>
                    <div className="border-t border-gray-100 p-2 bg-gray-50/30">
                      <button
                        onClick={() => {
                          onSignOut();
                          setIsUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className={`flex items-center gap-2 font-medium text-sm px-4 py-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-gray-100'}`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
          
          {/* Mobile Menu Button - Simplified */}
          <div className="md:hidden flex items-center">
             <button
              type="button"
              onClick={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
              className={`mr-2 p-2 rounded-lg ${isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
             <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
