import { Loader2 } from "lucide-react";

interface LoadingRunnerProps {
  message?: string;
}

const LoadingRunner = ({ message = "Loading..." }: LoadingRunnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        {/* Animated running figure */}
        <div className="animate-bounce">
          <svg
            className="w-16 h-16 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Running person icon */}
            <circle cx="8" cy="4" r="2" fill="currentColor" />
            <path d="M6 8l-2 4 4 1-1 4 3-2 2 5" />
            <path d="M6 8l4 2 4-3" />
            <path d="M10 10l2 4" />
            <path d="M14 7l2 1 3-3" />
          </svg>
        </div>
        {/* Trail effect */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default LoadingRunner;
