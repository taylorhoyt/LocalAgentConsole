import { useState } from 'react';
import type { ToolCall } from '../../../types';

interface ToolCallCardProps {
  toolCall: ToolCall;
  variant?: 'inline' | 'panel';
  onHighlight?: () => void;
}

export default function ToolCallCard({
  toolCall,
  variant = 'panel',
  onHighlight,
}: ToolCallCardProps) {
  const [isExpanded, setIsExpanded] = useState(variant === 'panel');

  const getStatusColor = () => {
    switch (toolCall.status) {
      case 'completed':
        return 'border-green-500 bg-green-900/20';
      case 'executing':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'error':
        return 'border-red-500 bg-red-900/20';
      default:
        return 'border-gray-600 bg-gray-800/50';
    }
  };

  const getStatusIcon = () => {
    switch (toolCall.status) {
      case 'completed':
        return '✓';
      case 'executing':
        return '⟳';
      case 'error':
        return '✗';
      default:
        return '○';
    }
  };

  if (variant === 'inline') {
    return (
      <div
        className={`mt-2 border rounded p-2 font-mono text-xs ${getStatusColor()}`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 w-full text-left"
        >
          <span className="font-semibold">{getStatusIcon()}</span>
          <span className="text-gray-300">{toolCall.toolName}</span>
          <span className="text-gray-500">({toolCall.status})</span>
          <span className="ml-auto text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        </button>
        {isExpanded && (
          <div className="mt-2 space-y-2">
            <div>
              <div className="text-gray-400 mb-1">Parameters:</div>
              <pre className="bg-gray-950 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(toolCall.parameters, null, 2)}
              </pre>
            </div>
            {toolCall.result != null && (
              <div>
                <div className="text-gray-400 mb-1">Result:</div>
                <pre className="bg-gray-950 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(toolCall.result, null, 2)}
                </pre>
              </div>
            )}
            {toolCall.error && (
              <div className="text-red-400 text-xs">Error: {toolCall.error}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`border rounded p-3 font-mono text-sm ${getStatusColor()} cursor-pointer hover:bg-opacity-30 transition-colors`}
      onClick={() => {
        setIsExpanded(!isExpanded);
        onHighlight?.();
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-lg">{getStatusIcon()}</span>
        <span className="text-gray-200 font-semibold">{toolCall.toolName}</span>
        <span className="text-gray-500 text-xs">({toolCall.status})</span>
        <span className="ml-auto text-gray-500 text-xs">
          {new Date(toolCall.timestamp).toLocaleTimeString()}
        </span>
        <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
      </div>
      {isExpanded && (
        <div className="mt-3 space-y-3 border-t border-gray-700 pt-3">
          <div>
            <div className="text-gray-400 mb-1 text-xs">Parameters:</div>
            <pre className="bg-gray-950 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(toolCall.parameters, null, 2)}
            </pre>
          </div>
          {toolCall.result != null && (
            <div>
              <div className="text-gray-400 mb-1 text-xs">Result:</div>
              <pre className="bg-gray-950 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(toolCall.result, null, 2)}
              </pre>
            </div>
          )}
          {toolCall.error && (
            <div className="text-red-400 text-xs">Error: {toolCall.error}</div>
          )}
        </div>
      )}
    </div>
  );
}

