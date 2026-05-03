import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";

const PaymentDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state as { plan?: string } | null) ?? null;
    const method = "PesaPal";
    const plan = state?.plan ?? "Individual";

    // Plan prices
    const planPrices: Record<string, number> = {
        Individual: 5.99,
        Duo: 10.99,
        Family: 12.99,
        Student: 2.99,
    };

    const amount = planPrices[plan] ?? 5.99;

    const [pesapalLoading, setPesaPalLoading] = useState(false);

    useEffect(() => {
        if (!state?.plan) {
            navigate("/premium", { replace: true });
        }
    }, [navigate, state?.plan]);

    // Handle PesaPal payment initiation
    const handlePesaPalPayment = async () => {
        setPesaPalLoading(true);
        try {
            console.log("Initiating PesaPal payment for plan:", plan, "amount:", planPrices[plan]);
            const res = await axiosInstance.post("/users/create-pesapal-payment", {
                plan,
                amount: planPrices[plan] ?? 5.99,
                method: "PesaPal",
            });
            
            console.log("PesaPal response:", res.data);
            
            if (res.data.success && res.data.paymentUrl) {
                // Open PesaPal in new tab or redirect
                window.open(res.data.paymentUrl, '_blank');
                toast.success("Redirecting to PesaPal for payment...");
                
                // Start polling for payment status
                pollPaymentStatus(res.data.orderTrackingId);
            } else {
                console.error("Invalid response structure:", res.data);
                toast.error("Failed to initiate PesaPal payment");
                setPesaPalLoading(false);
            }
        } catch (error: any) {
            console.error("Error initiating PesaPal payment:", error);
            console.error("Error response:", error?.response?.data);
            const errorMsg = error?.response?.data?.message || error?.message || "Error initiating PesaPal payment";
            toast.error(errorMsg);
            setPesaPalLoading(false);
        }
    };

    // Poll for payment status
    const pollPaymentStatus = (orderTrackingId: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const res = await axiosInstance.get(`/users/check-pesapal-payment/${orderTrackingId}`);
                if (res.data.success && res.data.paymentStatus === "completed") {
                    clearInterval(pollInterval);
                    toast.success("Payment confirmed! Premium activated.");
                    navigate("/premium/dashboard", { replace: true });
                } else if (res.data.paymentStatus === "failed") {
                    clearInterval(pollInterval);
                    toast.error("Payment failed. Please try again.");
                    setPesaPalLoading(false);
                }
            } catch (error) {
                console.error("Error checking payment status");
            }
        }, 5000);

        // Stop polling after 5 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            if (pesapalLoading) {
                toast.error("Payment timeout. Please check your payment status.");
                setPesaPalLoading(false);
            }
        }, 300000);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handlePesaPalPayment();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900">
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Enter {method} Payment Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Building2 className="h-8 w-8 text-purple-500" />
                                <div>
                                    <h3 className="text-white font-semibold">PesaPal Payment</h3>
                                    <p className="text-zinc-400 text-sm">Secure online payment through PesaPal</p>
                                </div>
                            </div>
                            <div className="text-zinc-300 text-sm mb-3">
                                <p className="mb-2">Plan: <span className="text-white font-medium">{plan}</span></p>
                                <p className="text-2xl font-bold text-[#1db954]">${amount.toFixed(2)}/month</p>
                            </div>
                            <p className="text-xs text-zinc-400">
                                You will be redirected to PesaPal to complete your payment securely.
                            </p>
                        </div>
                    </div>
                    <Button 
                        type="button" 
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700" 
                        onClick={handlePesaPalPayment}
                        disabled={pesapalLoading}
                    >
                        {pesapalLoading ? "Redirecting to PesaPal..." : "Pay with PesaPal"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PaymentDetailsPage;
