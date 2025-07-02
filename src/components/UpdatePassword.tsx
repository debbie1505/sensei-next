"use client"
import { useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter();


  const handleUpdate = async () => {
    if (!newPassword) return;

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      setLoading(false)
      toast.error("Password update failed: " + error.message);
    } else {
      toast.success("Password updated successfully! Redirected to login");
      await supabase.auth.signout(); // log them out
      setTimeout(() =>router.push("/login"), 2000); //where we want to redirect 
      //2s delay for use to see message
    }
  };

  return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reset Your Password
        </h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={handleUpdate}
          disabled={loading || !newPassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
