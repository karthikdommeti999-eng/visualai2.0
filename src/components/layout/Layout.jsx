import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const Layout = ({ children }) => {
    const location = useLocation();
    const isAICoach = location.pathname === '/ai-coach';

    return (
        <div className="min-h-screen flex flex-col bg-dark-900 text-white overflow-x-hidden selection:bg-brand-neon selection:text-dark-900">
            {!isAICoach && <Navbar />}
            <main className={cn(
                "flex-grow",
                isAICoach ? "h-screen pt-0" : "pt-20"
            )}>
                {children}
            </main>
            {!isAICoach && <Footer />}
        </div>
    );
};
