import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const PaymentDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state as { method?: string; plan?: string } | null) ?? null;
    const method = state?.method ?? "Bank Card";
    const plan = state?.plan ?? "Individual";

    useEffect(() => {
        if (!state?.method || !state?.plan) {
            navigate("/premium", { replace: true });
        }
    }, [navigate, state]);

    const [details, setDetails] = useState({
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCVV: "",
        mobileNumber: "",
        paypalEmail: "",
        mpesaNumber: "",
        mpesaPin: "",
    });
    const [mobileStep, setMobileStep] = useState<"phone" | "waiting">("phone");
    const [isConfirming, setIsConfirming] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const activatePremium = async () => {
        const loadingToastId = toast.loading("Finalizing payment...");
        const planPrices: Record<string, number> = {
            Individual: 5.99,
            Duo: 10.99,
            Family: 12.99,
            Student: 2.99,
        };

        try {
            const res = await axiosInstance.post("/users/activate-premium", {
                method,
                plan,
                amount: planPrices[plan] ?? 5.99,
            });
            toast.dismiss(loadingToastId);
            if (res.data.success) {
                toast.success("Payment confirmed! Premium activated.");
                navigate("/premium/dashboard", { replace: true });
            } else {
                toast.error("Payment failed.");
                setMobileStep("phone");
            }
        } catch {
            toast.dismiss(loadingToastId);
            toast.error("Payment error.");
            setMobileStep("phone");
        } finally {
            setIsConfirming(false);
        }
    };

    useEffect(() => {
        if (method === "Mobile Money" && mobileStep === "waiting") {
            setIsConfirming(true);
            const timer = window.setTimeout(() => {
                toast.success("Payment detected on your device. Redirecting to Premium.");
                activatePremium();
            }, 3200);

            return () => window.clearTimeout(timer);
        }
    }, [method, mobileStep]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (method === "Mobile Money" && mobileStep === "phone") {
            if (!details.mobileNumber.trim()) {
                toast.error("Please enter your mobile money number.");
                return;
            }

            toast.success("A PIN has been sent to your mobile device. Complete the payment on your phone.");
            setMobileStep("waiting");
            return;
        }

        const loadingToastId = toast.loading("Processing payment...");
        const planPrices: Record<string, number> = {
            Individual: 5.99,
            Duo: 10.99,
            Family: 12.99,
            Student: 2.99,
        };

        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
            const res = await axiosInstance.post("/users/activate-premium", {
                method,
                plan,
                amount: planPrices[plan] ?? 5.99,
            });
            toast.dismiss(loadingToastId);
            if (res.data.success) {
                toast.success("Payment successful! Premium activated.");
                navigate("/premium/dashboard", { replace: true });
            } else {
                toast.error("Payment failed.");
            }
        } catch {
            toast.dismiss(loadingToastId);
            toast.error("Payment error.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900">
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Enter {method} Payment Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {method === "Bank Card" && (
                        <>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Card Number"
                                value={details.cardNumber}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-zinc-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="cardName"
                                placeholder="Cardholder Name"
                                value={details.cardName}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-zinc-700 text-white"
                                required
                            />
                            <input
                                type="text"
                                name="cardExpiry"
                                placeholder="Expiry Date (MM/YY)"
                                value={details.cardExpiry}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-zinc-700 text-white"
                                required
                            />
                            <input
                                type="password"
                                name="cardCVV"
                                placeholder="CVV"
                                value={details.cardCVV}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-zinc-700 text-white"
                                required
                            />
                        </>
                    )}
                    {method === "Mobile Money" && (
                        <>
                            {mobileStep === "phone" ? (
                                <>
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        placeholder="Mobile Money Number"
                                        value={details.mobileNumber}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded bg-zinc-700 text-white"
                                        required
                                    />
                                    <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-300">
                                        Enter your phone number to receive a verification PIN on your mobile device. You will complete the PIN entry on your phone, not on the website.
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-5 text-sm text-zinc-300">
                                    A PIN has been sent to {details.mobileNumber}. Complete the transaction on your mobile device.
                                    Once the payment is detected successfully, you will be redirected to your Premium dashboard.
                                </div>
                            )}
                        </>
                    )}
                    {method === "PayPal" && (
                        <input
                            type="email"
                            name="paypalEmail"
                            placeholder="PayPal Email"
                            value={details.paypalEmail}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-zinc-700 text-white"
                            required
                        />
                    )}
                    {method === "M-Pesa" && (
                        <>
                            <input
                                type="text"
                                name="mpesaNumber"
                                placeholder="M-Pesa Number"
                                value={details.mpesaNumber}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-zinc-700 text-white"
                                required
                            />
                            <input
                                type="password"
                                name="mpesaPin"
                                placeholder="Enter PIN"
                                value={details.mpesaPin}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-zinc-700 text-white"
                                required
                            />
                        </>
                    )}
                    <Button type="submit" className="w-full mt-4" disabled={method === "Mobile Money" && mobileStep === "waiting" && isConfirming}>
                        {method === "Mobile Money"
                            ? mobileStep === "phone"
                                ? "Send PIN"
                                : isConfirming
                                ? "Waiting for mobile confirmation..."
                                : "Processing confirmation"
                            : "Pay & Activate Premium"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PaymentDetailsPage;
