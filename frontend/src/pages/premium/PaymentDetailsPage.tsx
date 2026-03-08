import { useState } from "react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const PaymentDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { method, plan } = location.state || {};

    const [details, setDetails] = useState({
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCVV: "",
        mobileNumber: "",
        mobilePin: "",
        paypalEmail: "",
        mpesaNumber: "",
        mpesaPin: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("Processing payment...");
        // Simulate payment
        setTimeout(async () => {
            try {
                const res = await axiosInstance.post("/users/activate-premium");
                toast.dismiss();
                if (res.data.success) {
                    toast.success("Payment successful! Premium activated.");
                    navigate("/premium/dashboard", { replace: true });
                } else {
                    toast.error("Payment failed.");
                }
            } catch {
                toast.dismiss();
                toast.error("Payment error.");
            }
        }, 1500);
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
                            <input
                                type="text"
                                name="mobileNumber"
                                placeholder="Mobile Money Number"
                                value={details.mobileNumber}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-zinc-700 text-white"
                                required
                            />
                            <input
                                type="password"
                                name="mobilePin"
                                placeholder="Enter PIN"
                                value={details.mobilePin}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-zinc-700 text-white"
                                required
                            />
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
                    <Button type="submit" className="w-full mt-4">Pay & Activate Premium</Button>
                </form>
            </div>
        </div>
    );
};

export default PaymentDetailsPage;
