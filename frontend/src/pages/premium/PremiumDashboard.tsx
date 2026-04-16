import { useEffect } from "react";
import { usePremiumStore } from "@/stores/usePremiumStore";

const PremiumDashboard = () => {
    const { isPremium, checkPremiumStatus } = usePremiumStore();

    useEffect(() => {
        checkPremiumStatus();
    }, [checkPremiumStatus]);

    if (!isPremium) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Premium Access Required</h1>
                <p className="text-lg text-zinc-300 mb-6">You must be a premium user to access this dashboard.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900">
            <h1 className="text-4xl font-bold text-green-400 mb-4">Welcome to Premium!</h1>
            <p className="text-lg text-zinc-300 mb-6">Enjoy unlimited music, exclusive features, and more.</p>
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <ul className="space-y-4">
                    <li className="text-xl text-white">Ad-free music listening</li>
                    <li className="text-xl text-white">Download to listen offline</li>
                    <li className="text-xl text-white">Play songs in any order</li>
                    <li className="text-xl text-white">High audio quality</li>
                    <li className="text-xl text-white">Unlimited skips</li>
                </ul>
            </div>
        </div>
    );
};

export default PremiumDashboard;
