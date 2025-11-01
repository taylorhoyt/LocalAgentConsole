import { useState } from 'react';
import type { ToolCall } from '../../../types';

interface ToolCallIndicatorProps {
  toolCallId: string;
  toolCall?: ToolCall;
  onClick?: () => void;
}

export default function ToolCallIndicator({
  toolCallId,
  toolCall,
  onClick,
}: ToolCallIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!toolCall) {
    return (
      <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded font-mono">
        Tool Call
      </span>
    );
  }

  const getStatusColor = () => {
    switch (toolCall.status) {
      case 'completed':
        return 'bg-green-600';
      case 'executing':
        return 'bg-yellow-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          onClick?.();
        }}
        className={`px-2 py-1 text-xs ${getStatusColor()} text-white rounded font-mono hover:opacity-80 transition-opacity`}
      >
        {toolCall.toolName} ({toolCall.status})
      </button>
      {isExpanded && (
        <div className="mt-1 p-2 bg-gray-900 border border-gray-700 rounded text-xs font-mono text-gray-300">
          <div className="font-semibold mb-1">Parameters:</div>
          <pre className="whitespace-pre-wrap break-words text-xs">
            {JSON.stringify(toolCall.parameters, null, 2)}
          </pre>
          {toolCall.result != null && (
            <>
              <div className="font-semibold mt-2 mb-1">Result:</div>
              <pre className="whitespace-pre-wrap break-words text-xs">
                {JSON.stringify(toolCall.result, null, 2)}
              </pre>
            </>
          )}
          {toolCall.error && (
            <div className="mt-2 text-red-400">Error: {toolCall.error}</div>
          )}
        </div>
      )}
    </div>
  );
}

