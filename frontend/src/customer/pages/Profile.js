import React, { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { User, LogOut } from "lucide-react";

export default function Profile() {


    const { user, logout } = useContext(AuthContext);

    return (
        <div className="max-w-4xl mx-auto mt-10 px-6">

            <h1 className="text-3xl font-bold text-white mb-8">
                My Profile
            </h1>

            <div className="bg-[#2A0E30] border border-[#4F1C51] rounded-2xl p-8">

                <div className="flex items-center gap-4 mb-6">

                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#A55B4B] to-[#4F1C51] flex items-center justify-center">
                        <User className="text-white w-6 h-6" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {user?.name || user?.username}
                        </h2>

                        <p className="text-gray-400 text-sm">
                            Customer Account
                        </p>
                    </div>

                </div>

                <div className="space-y-4 text-gray-300">

                    <div className="flex justify-between border-b border-[#4F1C51] pb-3">
                        <span>Username</span>
                        <span>{user?.username}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#4F1C51] pb-3">
                        <span>Customer ID</span>
                        <span>{user?.customer_id || "N/A"}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#4F1C51] pb-3">
                        <span>Account Type</span>
                        <span>{user?.is_staff ? "Admin" : "Customer"}</span>
                    </div>

                </div>

                <div className="mt-8">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-400/30 hover:bg-red-500/40 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

            </div>

        </div>
    );


}
