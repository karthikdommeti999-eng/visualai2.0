import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/')
    }

    const navLinks = [
        { name: 'Features', path: '/features' },
        { name: 'AI Coach', path: '/ai-coach' },
        { name: 'Examples', path: '/examples' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
            scrolled ? "glass-panel bg-dark-900/80 border-white/5" : "bg-transparent py-4"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                            <Zap className="text-dark-900 w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            VISUAL <span className="text-brand-teal">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) => cn(
                                    "text-sm font-medium transition-all hover:text-brand-teal tracking-wide",
                                    isActive ? "text-brand-teal glow-text" : "text-gray-400"
                                )}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <User size={16} />
                                    {user.name}
                                </span>
                                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                    <LogOut size={16} className="mr-2" /> Logout
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Sign in</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" size="sm" className="shadow-[0_0_20px_rgba(0,240,255,0.3)]">Sign up</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-panel border-t border-white/5 absolute w-full h-screen bg-dark-900">
                    <div className="px-4 pt-2 pb-8 space-y-2 flex flex-col h-full justify-center items-center gap-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-bold text-gray-300 hover:text-brand-teal"
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="pt-8 flex flex-col gap-4 w-full max-w-xs">
                            {user ? (
                                <Button variant="ghost" onClick={handleLogout} className="w-full text-red-400">Logout</Button>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                                        <Button variant="ghost" className="w-full">Sign in</Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full">
                                        <Button variant="primary" className="w-full">Sign up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
