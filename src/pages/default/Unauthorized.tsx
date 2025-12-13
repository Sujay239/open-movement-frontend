import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-6">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-white/10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <ShieldAlert size={36} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>

        {/* Description */}
        <p className="text-gray-300 mb-8">
          You don’t have permission to access this page. Please contact your
          administrator or return to a safe page.
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
          >
            Go Home
          </Link>

          <Link
            to="/login"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
}
