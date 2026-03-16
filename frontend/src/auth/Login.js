import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {


const { login } = useContext(AuthContext);
const navigate = useNavigate();

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {

        const res = await login(username, password);

        if (res.success) {

            // redirect based on role
            if (res.user?.is_staff) {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }

        } else {
            setError(res.error || "Invalid username or password");
        }

    } catch (err) {
        setError("Server error. Please try again.");
    }

    setLoading(false);
};

return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 selection:bg-brand-primary selection:text-white">

        <div className="w-full max-w-md p-8 glass-card shadow-2xl">

            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-highlight flex items-center justify-center shadow-lg transform rotate-3">
                    <span className="text-white font-bold text-3xl">🥛</span>
                </div>
            </div>

            <h2 className="text-3xl font-extrabold text-center mb-2 text-black">
                Dairy Dash
            </h2>
            <p className="text-center text-gray-500 mb-8 font-medium">Welcome back! Please login to your account.</p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm text-center rounded-xl font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        className="glass-input w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="glass-input w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full shadow-lg shadow-brand-primary/20 mt-2"
                >
                    {loading ? "Logging in..." : "Login Now"}
                </button>

                <div className="text-center pt-2">
                    <p className="text-sm text-gray-600 font-medium">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-brand-primary font-bold hover:text-brand-highlight hover:underline underline-offset-4 transition-all">
                            Create Account
                        </Link>
                    </p>
                </div>

            </form>

        </div>

    </div>
);


}

export default Login;
