interface StreamingIndicatorProps {
  isStreaming: boolean;
}

export default function StreamingIndicator({
  isStreaming,
}: StreamingIndicatorProps) {
  if (!isStreaming) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 font-mono">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:300ms]" />
      </div>
      <span>Streaming...</span>
    </div>
  );
}

