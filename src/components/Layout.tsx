import { Bell, Wrench, Plus, Search, HelpCircle, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  authEmail?: string;
  onLogout?: () => void;
  onOpenWebapps?: () => void;
}

export function Layout({
  children,
  isAuthenticated = false,
  authEmail = '',
  onLogout,
  onOpenWebapps,
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const avatarLetter = authEmail ? authEmail[0]?.toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary">Kuberns</h1>
              <nav className="hidden md:flex items-center gap-6">
                <a
                  href="#"
                  className="text-primary font-medium border-b-2 border-primary pb-1"
                >
                  Projects
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Datastore
                </a>
              </nav>
            </div>

            {/* Search */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Quick Search"
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Wrench className="h-5 w-5" />
                </Button>
                <div className="text-sm font-medium text-muted-foreground">
                  350 CREDITS LEFT
                </div>
                <Button variant="outline" className="hidden lg:flex">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              {isAuthenticated ? (
                <div className="relative group">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                    aria-label="Open profile menu"
                  >
                    <span className="text-sm font-medium text-primary">{avatarLetter}</span>
                  </button>
                  <div className="absolute right-0 top-full z-20 hidden min-w-[180px] pt-2 group-hover:block group-focus-within:block">
                    <div className="rounded-md border border-border bg-card shadow-lg">
                      <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">{authEmail}</div>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                        onClick={onOpenWebapps}
                      >
                        All Webapps
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-destructive"
                        onClick={onLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">U</span>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="hidden md:flex items-center justify-end gap-4 mt-2 pb-2">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              Documentation
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Support
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
