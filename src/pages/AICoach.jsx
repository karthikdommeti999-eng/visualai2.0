import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Send, Volume2, StopCircle, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export const AICoach = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI Fitness Assistant. I can build workout plans, give nutrition advice, or correct your form. Speak or type to start!" }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    const scrollToBottom = () => {
        // Only scroll if near bottom or if it's a new user message
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Speech to Text Setup
    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };

            recognition.start();
        } else {
            alert("Voice recognition not supported in this browser.");
        }
    };

    // Text to Speech Setup
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
                return;
            }

            // Strip markdown symbols for speech (basic)
            const cleanText = text.replace(/[*#_]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onstart = () => setIsSpeaking(true);

            // Allow selecting voices if needed, defaulting to first available
            const voices = window.speechSynthesis.getVoices();
            // Try to find a "Google US English" or similar premium voice if available
            const preferredVoice = voices.find(voice => voice.name.includes('Google') && voice.lang.includes('en-US'));
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async () => {
        const messageToSend = input.trim();
        if (!messageToSend || loading) return;

        const userMsg = { role: 'user', content: messageToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Call our Backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageToSend })
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const aiMsg = { role: 'assistant', content: data.reply };
            setMessages(prev => [...prev, aiMsg]);

            // Auto speak reply
            speakText(data.reply);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = error.message.includes('API key')
                ? "AI Configuration Error: Missing API Key on the server. Please check Vercel settings."
                : `Coach Connection Error: ${error.message || "The AI is currently resting. Please try again soon."}`;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-dark-900">
            {/* Custom Header for Full Screen Mode */}
            <div className="p-4 border-b border-white/5 bg-dark-900/50 backdrop-blur-md flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Zap className="text-brand-teal" size={24} />
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        AI <span className="text-brand-teal">Coach</span>
                    </h1>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                    Exit
                </Button>
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col h-full overflow-hidden">
                <div ref={containerRef} className="flex-1 bg-dark-700/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 mb-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "max-w-[85%] p-4 rounded-2xl animate-fade-in shadow-sm",
                                msg.role === 'user'
                                    ? "self-end bg-brand-teal/10 text-brand-teal rounded-br-none border border-brand-teal/20"
                                    : "self-start bg-dark-600/80 text-gray-200 rounded-bl-none border border-white/5"
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 pb-2">
                                    <Zap size={12} className="text-brand-neon" /> AI Coach
                                </div>
                            )}
                            <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                                <ReactMarkdown
                                    components={{
                                        // Custom styling for markdown elements
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                        h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-base font-bold text-white mt-3 mb-2" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-gray-200 mt-2 mb-1" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-brand-teal" {...props} />,
                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="self-start bg-dark-600 p-4 rounded-2xl rounded-bl-none border border-white/5">
                            <div className="flex gap-2">
                                <span className="w-2 h-2 bg-brand-neon rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-brand-neon rounded-full animate-bounce delay-100" />
                                <span className="w-2 h-2 bg-brand-neon rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-dark-800 p-2 rounded-full border border-white/10 flex items-center gap-2 pl-4 shrink-0">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about workouts, diet, or form..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                    />

                    <button
                        onClick={startListening}
                        className={cn(
                            "p-3 rounded-full transition-all duration-300",
                            isListening
                                ? "bg-red-500/20 text-red-500 animate-pulse"
                                : "hover:bg-white/10 text-gray-400 hover:text-white"
                        )}
                    >
                        <Mic size={20} />
                    </button>

                    <Button
                        onClick={handleSend}
                        className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                        disabled={!input.trim() || loading}
                    >
                        <Send size={18} />
                    </Button>
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={() => speakText(messages[messages.length - 1]?.content || "")}
                        className="text-xs text-gray-500 hover:text-brand-neon flex items-center justify-center gap-1 mx-auto"
                    >
                        {isSpeaking ? <StopCircle size={12} /> : <Volume2 size={12} />}
                        {isSpeaking ? "Stop Speaking" : "Replay Last Message"}
                    </button>
                </div>
            </div>
        </div>
    );
};
