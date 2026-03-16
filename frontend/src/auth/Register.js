import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        phone: "",
        address: "",
        delivery_area: "",
        is_admin: false
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        const res = await register(formData);
        if (res.success) {
            const role = formData.is_admin ? "Admin" : "Customer";
            setSuccessMessage(`Welcome ${role}! Registration successful. Redirecting to login...`);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } else {
            setError(res.error || "Failed to register. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-10 flex items-center justify-center bg-gray-50 selection:bg-brand-primary selection:text-white relative overflow-hidden">
            <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 glass-card mx-4 my-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4 border border-brand-primary/20 shadow-sm text-brand-primary">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-black mb-2">Create an Account</h2>
                    <p className="text-gray-600 text-sm font-medium">Join Dairy Dash 🥛 to manage your dairy deliveries</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100 text-green-600 text-sm text-center font-medium">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    
                    <div className="flex items-center justify-center space-x-4 mb-6 p-1 bg-white/50 rounded-xl border border-black/5">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, is_admin: false }))}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${!formData.is_admin ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:text-black hover:bg-white'}`}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, is_admin: true }))}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${formData.is_admin ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:text-black hover:bg-white'}`}
                        >
                            Admin
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                            <input
                                name="username"
                                type="text"
                                className="glass-input w-full"
                                placeholder="john_doe"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                className="glass-input w-full"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            className="glass-input w-full"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                            <input
                                name="phone"
                                type="text"
                                className="glass-input w-full"
                                placeholder="9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Area</label>
                            <input
                                name="delivery_area"
                                type="text"
                                className="glass-input w-full"
                                placeholder="Sector 14"
                                value={formData.delivery_area}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Address</label>
                        <textarea
                            name="address"
                            rows="2"
                            className="glass-input w-full resize-none"
                            placeholder="Apt 101, Sun City complex..."
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full shadow-lg shadow-brand-primary/20"
                        >
                            {loading ? "Creating Account..." : "Register Now"}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-brand-primary hover:text-brand-highlight transition-colors underline underline-offset-4">
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            {/* Subtle floating background elements */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
        </div>
    );
}

export default Register;
