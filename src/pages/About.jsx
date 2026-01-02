import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const About = () => {
    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet the <span className="text-brand-teal">Visionary</span></h1>
                    <p className="text-xl text-gray-400">
                        Bridging the gap between human creativity and artificial intelligence.
                    </p>
                </div>

                {/* Profile Section */}
                <div className="bg-dark-800 border border-white/5 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        {/* Avatar / Placeholder */}
                        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-brand-teal to-brand-cyan p-1 shadow-[0_0_30px_rgba(0,240,255,0.3)] shrink-0">
                            <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                                <img src="/karthik_avatar.jpg" alt="Karthik Dommeti" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl font-bold mb-2">Karthik Dommeti</h2>
                            <div className="text-brand-teal font-medium mb-6">Founder & Lead Engineer</div>

                            <p className="text-gray-300 leading-relaxed mb-6">
                                Karthik is a passionate Full Stack Developer and AI specialist dedicated to building the next generation of visualization tools. With a deep understanding of React, Node.js, and Generative AI, he created VISUAL AI to empower creators worldwide.
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <Button variant="secondary" size="sm" className="gap-2">
                                    <Linkedin size={16} /> LinkedIn
                                </Button>
                                <Button variant="secondary" size="sm" className="gap-2">
                                    <Github size={16} /> GitHub
                                </Button>
                                <Button variant="secondary" size="sm" className="gap-2">
                                    <Twitter size={16} /> Twitter
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Mail size={16} /> Contact
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats / Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="text-3xl font-bold text-white mb-1">5+</div>
                        <div className="text-sm text-gray-400">Years Experience</div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="text-3xl font-bold text-brand-teal mb-1">20+</div>
                        <div className="text-sm text-gray-400">AI Projects</div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="text-3xl font-bold text-white mb-1">Global</div>
                        <div className="text-sm text-gray-400">Client Base</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
