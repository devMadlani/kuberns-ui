import { Bell, ChevronDown, HelpCircle, LayoutGrid, Moon, Sun, Wrench } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  authEmail?: string;
  onLogout?: () => void;
  onOpenWebapps?: () => void;
  onAddNew?: () => void;
}

export function Layout({
  children,
  isAuthenticated = false,
  authEmail = '',
  onLogout,
  onOpenWebapps,
  onAddNew,
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const avatarLetter = authEmail ? authEmail[0]?.toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`border-b shadow-sm ${
          isDark ? 'border-[#1b2130] bg-[#090d16]' : 'border-[#d9deea] bg-[#f8faff]'
        }`}
      >
        <div className="container mx-auto px-4 pt-3">
          <div className="flex items-center justify-between pb-2">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-[29px] font-semibold leading-none text-[#2f6bff] hover:opacity-90 transition-opacity">
                Kuberns
              </Link>
            </div>

            {/* Search */}
            <div className="hidden lg:flex flex-1 max-w-[360px] mx-8">
              <div className="relative w-full">
                <Wrench
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 ${
                    isDark ? 'text-[#7f8796]' : 'text-[#6a7283]'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Quick Search"
                  className={`h-8 w-full rounded-md border px-3 pr-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#2f6bff] ${
                    isDark
                      ? 'border-[#1f2432] bg-[#0f1420] text-[#d2d7e0] placeholder:text-[#6f7789]'
                      : 'border-[#cfd7ea] bg-white text-[#2a3245] placeholder:text-[#7a8399]'
                  }`}
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[#2f6bff] text-xs font-semibold">350</span>
                  <span
                    className={`text-[9px] uppercase tracking-wide ${
                      isDark ? 'text-[#7b8292]' : 'text-[#6f7890]'
                    }`}
                  >
                    Credits Left
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${isDark ? 'text-[#8c93a2] hover:text-[#d9deea]' : 'text-[#5d6579] hover:text-[#222a3d]'}`}
                >
                  <Wrench className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${isDark ? 'text-[#8c93a2] hover:text-[#d9deea]' : 'text-[#5d6579] hover:text-[#222a3d]'}`}
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  className="hidden lg:inline-flex h-8 rounded-md bg-[#2f6bff] px-3 text-sm font-semibold text-white hover:bg-[#255bef]"
                  onClick={onAddNew}
                >
                  Add New
                  <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                </Button>
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className={`hidden lg:inline-flex h-8 bg-transparent ${
                      isDark
                        ? 'border-[#2a3142] text-[#c7ccda] hover:bg-[#141b2a] hover:text-white'
                        : 'border-[#bfc9df] text-[#33405d] hover:bg-[#edf2ff] hover:text-[#1f2a44]'
                    }`}
                    onClick={onOpenWebapps}
                  >
                    My Webapps
                  </Button>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`h-8 w-8 ${isDark ? 'text-[#8c93a2] hover:text-[#d9deea]' : 'text-[#5d6579] hover:text-[#222a3d]'}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              {isAuthenticated ? (
                <div className="relative group">
                  <button
                    type="button"
                    className={`h-8 w-8 rounded-full flex items-center justify-center border ${
                      isDark ? 'bg-[#1b2334] border-[#293145]' : 'bg-[#eef3ff] border-[#c8d2ea]'
                    }`}
                    aria-label="Open profile menu"
                  >
                    <span className={`text-sm font-medium ${isDark ? 'text-[#d6dbeb]' : 'text-[#2b3855]'}`}>{avatarLetter}</span>
                  </button>
                  <div className="absolute right-0 top-full z-20 hidden min-w-[180px] pt-2 group-hover:block group-focus-within:block">
                    <div
                      className={`rounded-md border shadow-lg ${
                        isDark ? 'border-[#293145] bg-[#101625]' : 'border-[#c8d2ea] bg-white'
                      }`}
                    >
                      <div
                        className={`px-3 py-2 text-xs border-b ${
                          isDark ? 'text-[#8f96a8] border-[#293145]' : 'text-[#6b748a] border-[#d7deef]'
                        }`}
                      >
                        {authEmail}
                      </div>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#1a2235] text-red-400"
                        onClick={onLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`h-8 w-8 rounded-full border flex items-center justify-center ${
                    isDark ? 'bg-[#1b2334] border-[#293145]' : 'bg-[#eef3ff] border-[#c8d2ea]'
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-[#d6dbeb]' : 'text-[#2b3855]'}`}>U</span>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Navigation */}
          <div
            className={`hidden md:flex items-center justify-between border-t py-2 ${
              isDark ? 'border-[#1b2130]' : 'border-[#d9deea]'
            }`}
          >
            <nav className="flex items-center gap-5">
              <NavLink
                to="/webapps"
                className={({ isActive }) =>
                  isActive
                    ? 'inline-flex items-center gap-1.5 text-sm font-medium text-[#2f6bff]'
                    : `inline-flex items-center gap-1.5 text-sm ${
                        isDark ? 'text-[#a2a8b8] hover:text-[#c8cedd]' : 'text-[#5f6980] hover:text-[#2b3550]'
                      }`
                }
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Projects
              </NavLink>
              <a
                href="#"
                className={`inline-flex items-center gap-1.5 text-sm ${
                  isDark ? 'text-[#a2a8b8] hover:text-[#c8cedd]' : 'text-[#5f6980] hover:text-[#2b3550]'
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${isDark ? 'bg-[#a2a8b8]' : 'bg-[#5f6980]'}`} />
                Datastore
              </a>
            </nav>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className={`text-sm flex items-center gap-1 ${
                  isDark ? 'text-[#a2a8b8] hover:text-[#d5dbea]' : 'text-[#5f6980] hover:text-[#2b3550]'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                Documentation
              </a>
              <a
                href="#"
                className={`text-sm ${isDark ? 'text-[#a2a8b8] hover:text-[#d5dbea]' : 'text-[#5f6980] hover:text-[#2b3550]'}`}
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
