// import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Use "react-router" if v7
import { ArrowLeft, Home, Ghost } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden selection:bg-purple-500/30">
      {/* 1. ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] opacity-20"></div>

        {/* Moving Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* 2. MAIN CONTENT CARD */}
      <div className="relative z-10 w-full max-w-2xl px-4 text-center">
        {/* Floating Ghost Icon */}
        <div className="relative inline-block mb-8 animate-float">
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
          <Ghost
            className="relative w-32 h-32 text-slate-900 dark:text-white mx-auto drop-shadow-2xl"
            strokeWidth={1.5}
          />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-4 animate-in zoom-in-50 duration-500">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Oops! You've drifted off course.
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's
          get you back to the classroom.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 px-8 text-base bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 text-base border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Custom CSS for simple float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
