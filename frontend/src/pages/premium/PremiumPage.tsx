import { Button } from "@/components/ui/button";
import { Check, CreditCard, Smartphone, Wallet, Bitcoin, Star, Music, Shield, Download } from "lucide-react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const PremiumPage = () => {
    const navigate = useNavigate();
    const handlePayment = (method: string, plan: string) => {
        navigate("/premium/payment-details", { state: { method, plan } });
    };

    const plans = [
        {
            name: "Individual",
            price: "$9.99/month",
            features: [
                "Ad-free music listening",
                "Download to listen offline",
                "Play songs in any order",
                "High audio quality",
                "Unlimited skips"
            ]
        },
        {
            name: "Duo",
            price: "$12.99/month",
            features: [
                "2 accounts",
                "Ad-free music",
                "Duo Mix playlist",
                "Download for offline listening",
                "Play songs in any order"
            ]
        },
        {
            name: "Family",
            price: "$14.99/month",
            features: [
                "Up to 6 accounts",
                "Ad-free music",
                "Family Mix playlist",
                "Parental controls",
                "Block explicit content"
            ]
        },
        {
            name: "Student",
            price: "$4.99/month",
            features: [
                "Ad-free music",
                "Student discount",
                "Download for offline listening",
                "Play songs in any order"
            ]
        }
    ];
    // Comparison Table Features
    const comparisonFeatures = [
        "Ad-free music listening",
        "Download to listen offline",
        "Play songs in any order",
        "High audio quality",
        "Unlimited skips",
        "Multiple accounts",
        "Mix playlists",
        "Parental controls",
        "Student discount"
    ];

    // FAQ Section
    const faqs = [
        {
            question: "How does the free trial work?",
            answer: "You get 30 days of Premium for free. Cancel anytime before the trial ends to avoid charges."
        },
        {
            question: "Can I switch plans later?",
            answer: "Yes, you can change your subscription plan at any time from your account settings."
        },
        {
            question: "Is there a student discount?",
            answer: "Yes, students can get Premium at a reduced price."
        },
        {
            question: "How do I pay?",
            answer: "You can pay with bank card, mobile money, PayPal, or M-Pesa."
        }
    ];

    // Testimonials
    const testimonials = [
        {
            name: "Alex",
            text: "Premium changed the way I listen to music. No ads, just pure vibes!",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Maria",
            text: "Offline listening is a lifesaver for my commute.",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Sam",
            text: "Family plan keeps everyone happy. Kids love their playlists!",
            avatar: "https://randomuser.me/api/portraits/men/65.jpg"
        }
    ];

    // Only show admin account number for payments
    const paymentMethods = [
        { name: "Bank Card", icon: CreditCard, color: "bg-blue-500", details: "Card: 5273 6400 8618 9896" },
        { name: "Mobile Money", icon: Smartphone, color: "bg-green-500", details: "Number: +250 795 757 432" },
        { name: "PayPal", icon: Wallet, color: "bg-blue-600", details: "PayPal details will be provided later" },
        { name: "M-Pesa", icon: Bitcoin, color: "bg-orange-500", details: "M-Pesa details will be provided later" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1e293b] to-[#111827] flex flex-col items-center justify-start">
            <div className="w-full h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-[#1db954] scrollbar-track-zinc-900">
                {/* Hero Section */}
                <section className="w-full py-16 px-4 flex flex-col items-center bg-gradient-to-r from-[#1db954] via-[#1ed760] to-[#1db954]">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 text-center drop-shadow-lg">Premium for everyone</h1>
                    <p className="text-2xl md:text-3xl text-white mb-6 text-center">Get millions of songs. No ads. Offline listening. Unlimited skips.</p>
                    <Button className="bg-white text-[#1db954] font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-green-100 mb-4" onClick={() => handlePayment("Bank Card", "Individual")}>Get Premium</Button>
                    <p className="text-lg text-white">30-day free trial for new users</p>
                </section>

                {/* Feature Grid */}
                <section className="max-w-5xl w-full px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center">
                        <Star className="h-10 w-10 text-[#1db954] mb-2" />
                        <span className="text-xl font-semibold text-white mb-1">Ad-free music</span>
                        <span className="text-zinc-300 text-center">Listen without interruptions.</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Download className="h-10 w-10 text-[#1db954] mb-2" />
                        <span className="text-xl font-semibold text-white mb-1">Offline listening</span>
                        <span className="text-zinc-300 text-center">Download songs and play anywhere.</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Music className="h-10 w-10 text-[#1db954] mb-2" />
                        <span className="text-xl font-semibold text-white mb-1">Unlimited skips</span>
                        <span className="text-zinc-300 text-center">Skip as much as you want.</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Shield className="h-10 w-10 text-[#1db954] mb-2" />
                        <span className="text-xl font-semibold text-white mb-1">High quality audio</span>
                        <span className="text-zinc-300 text-center">Crystal clear sound.</span>
                    </div>
                </section>

                {/* Plan Selector & Cards */}
                <section className="max-w-5xl w-full px-4 py-8">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose your Premium plan</h2>
                    <div className="flex flex-col gap-8 mb-12">
                        {plans.map((plan) => (
                            <div key={plan.name} className="rounded-2xl bg-zinc-800 border-2 border-zinc-700 shadow-lg flex flex-col items-center p-6 max-w-md w-full mx-auto">
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-[#1db954]">{plan.price}</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-white mb-4">{plan.name}</h2>
                                <ul className="mb-6 text-zinc-300 text-base">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-2 mb-2">
                                            <Check className="h-5 w-5 text-[#1db954]" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="w-full">
                                    <p className="text-sm font-medium mb-2 text-zinc-400">Choose Payment Method:</p>
                                    <div className="flex flex-col gap-4">
                                        {paymentMethods.map((method) => (
                                            <div key={method.name} className="mb-2">
                                                <Button
                                                    variant="outline"
                                                    className="w-full flex items-center gap-2 py-3 text-lg font-semibold border-zinc-600 hover:bg-zinc-700"
                                                    onClick={() => handlePayment(method.name, plan.name)}
                                                >
                                                    <method.icon className={`h-6 w-6 ${method.color} text-white p-1 rounded`} />
                                                    {method.name}
                                                </Button>
                                                <p className="text-xs text-zinc-400 ml-8 mt-1">{method.details}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto mb-12">
                        <table className="min-w-full bg-zinc-900 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="text-left text-white p-4">Features</th>
                                    {plans.map((plan) => (
                                        <th key={plan.name} className="text-center text-[#1db954] p-4">{plan.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((feature) => (
                                    <tr key={feature} className="border-t border-zinc-700">
                                        <td className="text-zinc-300 p-4">{feature}</td>
                                        {plans.map((plan) => (
                                            <td key={plan.name} className="text-center p-4">
                                                {plan.features.includes(feature) ? <Check className="h-5 w-5 text-[#1db954] mx-auto" /> : <span className="text-zinc-500">—</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-4xl w-full px-4 py-8 mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {faqs.map(faq => (
                            <div key={faq.question} className="bg-zinc-800 rounded-lg p-6 shadow">
                                <h3 className="text-lg font-semibold text-[#1db954] mb-2">{faq.question}</h3>
                                <p className="text-zinc-300">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="max-w-4xl w-full px-4 py-8 mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">What our users say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map(t => (
                            <div key={t.name} className="bg-zinc-800 rounded-lg p-6 flex flex-col items-center shadow">
                                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4" />
                                <p className="text-zinc-300 text-center mb-2">"{t.text}"</p>
                                <span className="text-[#1db954] font-semibold">{t.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default PremiumPage;