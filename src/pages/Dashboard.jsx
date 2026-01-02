import { Activity, Bell, Calendar, ChevronRight, Trophy, Zap, User, Flame, Timer, TrendingUp, Sparkles, ScanFace } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="p-6 rounded-3xl bg-dark-700 border border-white/5 hover:border-white/10 transition-colors group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={14} /> +{Math.floor(Math.random() * 5) + 1}%
            </span>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>
    </div>
)

export const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const [chartPeriod, setChartPeriod] = useState('This Week');
    const [dailyInsight, setDailyInsight] = useState("Loading your daily personalized summary...");
    const [isScannedData, setIsScannedData] = useState(false);

    // Default stats - Start at 0 for the day
    const [stats, setStats] = useState({
        volume: 0,
        calories: 0,
        minutes: 0,
        recovery: 95
    });

    useEffect(() => {
        // Check if we came from Face Scan
        if (location.state?.biometricData) {
            const bio = location.state.biometricData;
            setDailyInsight(bio.summary);

            if (bio.state === 'POST_WORKOUT') {
                // Show Post-Workout Stats (The "Original" Data)
                setStats({
                    volume: 15320,
                    calories: bio.caloriesBurned || 950,
                    minutes: 105,
                    recovery: bio.readiness
                });
                addToast(`Biometric Analysis Loaded. Readiness: ${bio.readiness}%`, "success");
            } else {
                // Show Pre-Workout Stats (Baseline 0s)
                setStats({
                    volume: 0,
                    calories: 0,
                    minutes: 0,
                    recovery: bio.readiness
                });
                addToast(`Ready to Train. Readiness: ${bio.readiness}%`, "success");

                setTimeout(() => {
                    addToast("Recommendation: START WORKOUT NOW", "info");
                }, 1500);
            }

            setIsScannedData(true);
            window.history.replaceState({}, document.title); // Clear state
        } else {
            // Default Loading State (No Workout Started Yet)
            // We keep specific activity stats at 0. Only recovery shows.
            setStats({
                volume: 0,
                calories: 0,
                minutes: 0,
                recovery: 98
            });

            // Fetch AI Insight
            const fetchInsight = async () => {
                try {
                    const res = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: "Generate a short, 1-sentence energizing daily summary for a fitness dashboard." })
                    });
                    const data = await res.json();
                    if (data.reply) setDailyInsight(data.reply.replace(/"/g, ''));
                } catch (e) {
                    setDailyInsight("Consistency is the key to breakthrough. Keep pushing!");
                }
            };
            fetchInsight();
        }
    }, []);

    // Mock Data based on period
    const chartData = chartPeriod === 'This Week'
        ? [40, 70, 45, 90, 60, 80, 50]
        : [50, 60, 55, 70, 65, 75, 60];

    const handleStartWorkout = () => {
        addToast("Starting Workout Session...", "success");
        setTimeout(() => {
            navigate('/ai-coach');
        }, 1000);
    };

    const handleSettingToggle = (settingName) => {
        addToast(`${settingName} updated successfully`, "success");
    };

    return (
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 animate-fade-in gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, Athlete</h1>
                    <div className="flex items-center gap-2 text-brand-teal">
                        <Sparkles size={16} />
                        <p className="font-medium text-sm md:text-base">"{dailyInsight}"</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-brand-teal hover:text-brand-neon hover:bg-brand-teal/10 2xl:hidden"
                        onClick={() => navigate('/scan')}
                    >
                        <ScanFace size={18} /> Sync Biometrics
                    </Button>
                    <div className="text-right hidden sm:block">
                        <div className="text-sm text-gray-400">Current Streak</div>
                        <div className="text-xl font-bold text-brand-neon">🔥 12 Days</div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in delay-100">
                <StatCard icon={Activity} label="Workout Volume" value={`${stats.volume.toLocaleString()} kg`} color="bg-brand-blue" />
                <StatCard icon={Flame} label="Calories Burned" value={`${stats.calories} kcal`} color="bg-orange-500" />
                <StatCard icon={Timer} label="Active Minutes" value={`${stats.minutes} min`} color="bg-brand-purple" />
                <StatCard icon={TrendingUp} label="Recovery Score" value={`${stats.recovery}%`} color="bg-brand-neon" />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in delay-200">
                {/* Chart Area (Mock) */}
                <div className="lg:col-span-2 p-8 rounded-4xl bg-dark-700 border border-white/5 h-[400px] flex flex-col">
                    <h3 className="text-xl font-bold mb-6">Weekly Progress</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Activity Chart */}
                        <div className="bg-dark-800 p-6 rounded-3xl border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Activity className="text-brand-teal" size={20} />
                                    Activity Levels
                                </h3>
                                <select
                                    value={chartPeriod}
                                    onChange={(e) => setChartPeriod(e.target.value)}
                                    className="bg-dark-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400 focus:outline-none focus:border-brand-teal"
                                >
                                    <option>This Week</option>
                                    <option>Last Month</option>
                                </select>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {chartData.map((h, i) => (
                                    <div key={i} className="w-full bg-dark-900 rounded-t-lg relative group overflow-hidden">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-brand-teal/20 transition-all duration-500 group-hover:bg-brand-teal"
                                            style={{ height: `${h}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Settings & Notifications */}
                        <div className="bg-dark-800 p-6 rounded-3xl border border-white/5">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <Bell className="text-brand-purple" size={20} />
                                Daily Updates
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-dark-900 rounded-2xl border border-white/5">
                                    <div>
                                        <div className="font-medium text-white mb-1">Daily Schedule</div>
                                        <div className="text-xs text-gray-500">Receive plans via email.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            defaultChecked
                                            onChange={() => handleSettingToggle("Daily Schedule")}
                                        />
                                        <div className="w-9 h-5 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-teal"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-dark-900 rounded-2xl border border-white/5">
                                    <div>
                                        <div className="font-medium text-white mb-1">Weekly Analytics</div>
                                        <div className="text-xs text-gray-500">Sunday summary report.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={() => handleSettingToggle("Weekly Analytics")}
                                        />
                                        <div className="w-9 h-5 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-teal"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Workout */}
                <div className="p-8 rounded-4xl bg-gradient-to-br from-dark-700 to-dark-800 border border-white/5 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-6">Next Workout</h3>
                        <div className="mb-6">
                            <div className="text-sm text-brand-neon font-bold mb-1">TODAY • 5:00 PM</div>
                            <h4 className="text-2xl font-bold">Upper Body Power</h4>
                            <p className="text-gray-400 text-sm">Focus: Hypertrophy & Strength</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-400">Duration</span>
                                <span className="font-medium">60 min</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-400">Intensity</span>
                                <span className="font-medium text-brand-purple">High</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStartWorkout}
                        className="w-full py-4 rounded-xl bg-white text-dark-900 font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                    >
                        Start Workout
                    </button>
                </div>
            </div>
        </div>
    );
};
