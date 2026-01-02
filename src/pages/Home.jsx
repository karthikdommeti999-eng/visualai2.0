import { ArrowRight, Layers, BarChart3, Wand2, Share2, Facebook, Twitter, Instagram, Smartphone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Home = () => {
    const navigate = useNavigate();
    const [showShareModal, setShowShareModal] = useState(false);

    const handleAction = (action) => {
        switch (action) {
            case 'ai-gen':
                navigate('/ai-coach');
                break;
            case 'analytics':
                navigate('/dashboard');
                break;
            case 'export':
                // Mock Export
                const element = document.createElement("a");
                const file = new Blob(["Simulation Report: All systems nominal. Visual AI Layer Data Attached."], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = "VisualAI_Report_v1.txt";
                document.body.appendChild(element); // Required for this to work in FireFox
                element.click();
                alert("Layers Exported Successfully!");
                break;
            case 'collaborate':
                setShowShareModal(true);
                break;
        }
    }
    return (
        <div className="relative min-h-screen bg-dark-900 overflow-hidden selection:bg-brand-teal selection:text-black">
            {/* Ambient Backgrounds */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-teal/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/5 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    <span className="text-brand-teal drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]">VISUAL AI</span>
                    <br />
                    Training System
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mb-10 animate-fade-in delay-100 leading-relaxed">
                    Experience the future of fitness with real-time AI coaching,
                    immersive analytics, and a community of elite athletes.
                </p>

                <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
                    <Button
                        size="lg"
                        className="rounded-full px-8 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300"
                        onClick={() => navigate('/signup')}
                    >
                        Join Now <ArrowRight size={18} className="ml-2" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        className="rounded-full px-8 bg-white/5 border-white/10 hover:bg-white/10"
                        onClick={() => navigate('/dashboard')}
                    >
                        Learn More
                    </Button>
                </div>

                {/* Central Visual Element - 3D Ring/Orb */}
                <div className="relative w-full max-w-4xl mx-auto h-[500px] flex items-center justify-center perspective-1000 group">

                    {/* The Ring System */}
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                        {/* Core Sphere */}
                        <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-gradient-to-br from-brand-teal to-brand-accent blur-md animate-pulse-glow" />

                        {/* Outer Ring 1 */}
                        <div className="absolute inset-0 rounded-full border border-brand-teal/30 animate-spin-slow"
                            style={{ transform: 'rotateX(70deg)' }}></div>

                        {/* Outer Ring 2 (Cross) */}
                        <div className="absolute inset-0 rounded-full border border-brand-cyan/20 animate-spin-slow animation-delay-500"
                            style={{ transform: 'rotateY(70deg)' }}></div>

                        {/* Outer Ring 3 (Static Glow) */}
                        <div className="absolute inset-[-40px] rounded-full border border-dashed border-white/5 animate-spin-slow reverse"></div>


                        {/* Floating Tooltips */}
                        <FloatingCard
                            icon={Layers} label="Export Layers"
                            className="top-0 left-0 -translate-x-12 translate-y-10 animate-float"
                            onClick={() => handleAction('export')}
                        />
                        <FloatingCard
                            icon={Wand2} label="AI Gen"
                            className="top-10 right-0 translate-x-12 animate-float animation-delay-1000"
                            onClick={() => handleAction('ai-gen')}
                        />
                        <FloatingCard
                            icon={BarChart3} label="Analytics"
                            className="bottom-10 left-10 -translate-x-8 animate-float animation-delay-2000"
                            onClick={() => handleAction('analytics')}
                        />
                        <FloatingCard
                            icon={Share2} label="Collaborate"
                            className="bottom-0 right-10 translate-x-8 animate-float animation-delay-3000"
                            onClick={() => handleAction('collaborate')}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Mock */}
            <footer className="border-t border-white/5 bg-dark-900 py-12 text-center text-gray-500 text-sm">
                <p>© 2024 VisualAI Inc. All rights reserved.</p>
            </footer>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-dark-800 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center relative">
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold mb-6">Collaborate & Share</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" className="gap-2" onClick={() => window.open('https://whatsapp.com')}>
                                <Smartphone size={18} /> WhatsApp
                            </Button>
                            <Button variant="secondary" className="gap-2" onClick={() => window.open('https://instagram.com')}>
                                <Instagram size={18} /> Instagram
                            </Button>
                            <Button variant="secondary" className="gap-2" onClick={() => window.open('https://twitter.com')}>
                                <Twitter size={18} /> Twitter
                            </Button>
                            <Button variant="secondary" className="gap-2" onClick={() => window.open('https://facebook.com')}>
                                <Facebook size={18} /> Facebook
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Component for Floating Cards
const FloatingCard = ({ icon: Icon, label, className, onClick }) => (
    <div
        onClick={onClick}
        className={cn(
            "absolute p-4 rounded-xl glass-panel flex items-center gap-3 w-40 hover:scale-105 transition-transform cursor-pointer hover:border-brand-teal/50",
            className
        )}>
        <div className="p-2 rounded-lg bg-brand-teal/10 text-brand-teal">
            <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-gray-200">{label}</span>
    </div>
)
