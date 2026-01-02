import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Scan, Share2, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const FaceScan = () => {
    const webcamRef = useRef(null);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [analyzing, setAnalyzing] = useState(false);

    const capture = useCallback(() => {
        setScanning(true);
        const imageSrc = webcamRef.current.getScreenshot();

        // Simulate Scan Progress
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setScanning(false);
                analyzeFace(imageSrc);
            }
        }, 30);
    }, [webcamRef]);

    const analyzeFace = async (imageSrc) => {
        setAnalyzing(true);
        try {
            // Simulate AI Detecting User State: Pre or Post Workout
            // In a real app, this would be based on redness, sweat, heart rate variability from video
            const isPostWorkout = Math.random() > 0.4; // 60% chance of being post-workout

            let data;

            if (isPostWorkout) {
                // Simulate calling AI for Post-workout analysis
                try {
                    const res = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: "Generate a scientific post-workout recovery status update (max 1 sentence) mentioning cortisol or heart rate recovery."
                        })
                    });
                    const aiData = await res.json();
                    data = {
                        state: 'POST_WORKOUT',
                        summary: aiData.reply || "Elevated metabolic rate detected efficiently returning to baseline.",
                        fatigue: Math.floor(Math.random() * 25) + 60, // 60-85% fatigue
                        readiness: Math.floor(Math.random() * 20) + 30, // Low readiness for another session
                        hydration: "Low - Rehydrate",
                        scanned: true
                    }
                } catch (e) {
                    data = {
                        state: 'POST_WORKOUT',
                        summary: "Analysis indicates high exertion levels. Immediate protein and electrolyte intake recommended.",
                        fatigue: 78,
                        readiness: 35,
                        scanned: true
                    }
                }
            } else {
                // Simulate Pre-Workout State
                data = {
                    state: 'PRE_WORKOUT',
                    summary: "CNS readiness is at peak levels. No signs of recent exertion detected. Suggestion: INITIATE WORKOUT.",
                    fatigue: Math.floor(Math.random() * 10) + 5, // Low fatigue
                    readiness: Math.floor(Math.random() * 10) + 90, // High readiness
                    hydration: "Optimal",
                    scanned: true
                }
            }

            // Navigate to result with detailed state
            navigate('/dashboard', {
                state: {
                    biometricData: data
                }
            });
            addToast("Biometric Analysis Complete.", "success");

        } catch (error) {
            console.error(error);
            addToast("Scan Failed. Please try again.", "error");
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Scanner Grid Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative z-20 w-full max-w-md p-4">
                <div className="relative rounded-3xl overflow-hidden border-2 border-brand-teal shadow-[0_0_50px_rgba(20,184,166,0.3)] bg-dark-900">
                    {!analyzing ? (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-[500px] object-cover"
                                videoConstraints={{ facingMode: "user" }}
                            />

                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-10 left-10 w-20 h-20 border-l-4 border-t-4 border-brand-teal rounded-tl-xl" />
                                <div className="absolute top-10 right-10 w-20 h-20 border-r-4 border-t-4 border-brand-teal rounded-tr-xl" />
                                <div className="absolute bottom-10 left-10 w-20 h-20 border-l-4 border-b-4 border-brand-teal rounded-bl-xl" />
                                <div className="absolute bottom-10 right-10 w-20 h-20 border-r-4 border-b-4 border-brand-teal rounded-br-xl" />

                                {scanning && (
                                    <div
                                        className="absolute top-0 left-0 w-full h-1 bg-brand-neon shadow-[0_0_20px_#ccff00] animate-scan-down"
                                        style={{ top: `${progress}%` }}
                                    />
                                )}
                            </div>

                            <div className="absolute bottom-8 left-0 w-full flex justify-center z-30 pointer-events-auto">
                                {!scanning ? (
                                    <button
                                        onClick={capture}
                                        className="w-16 h-16 rounded-full bg-white border-4 border-dark-900 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-brand-teal" />
                                    </button>
                                ) : (
                                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-brand-teal/30 text-brand-teal font-mono">
                                        SCANNING... {progress}%
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-[500px] flex flex-col items-center justify-center text-center p-8 bg-dark-800">
                            <Activity className="w-16 h-16 text-brand-neon mb-6 animate-pulse" />
                            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Biometrics</h2>
                            <p className="text-gray-400">Processing facial tension, hydration levels, and fatigue markers...</p>
                            <div className="mt-8 flex gap-2">
                                <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce delay-100" />
                                <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    Ensure your face is well-lit and unobstructed for accurate AI analysis.
                </p>
                <Button variant="ghost" className="w-full mt-2" onClick={() => navigate('/dashboard')}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};
