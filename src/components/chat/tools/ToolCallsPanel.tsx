import { useState } from 'react';
import ToolCallCard from './ToolCallCard';
import type { ToolCall } from '../../../types';

interface ToolCallsPanelProps {
  toolCalls: ToolCall[];
}

export default function ToolCallsPanel({ toolCalls }: ToolCallsPanelProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="w-12 border-l border-gray-700 bg-gray-900 flex items-center">
        <button
          onClick={() => setIsVisible(true)}
          className="w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors font-mono text-xs writing-vertical-rl"
          style={{ writingMode: 'vertical-rl' }}
        >
          Tool Calls ({toolCalls.length})
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-700 bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h2 className="font-mono text-sm font-semibold text-white">
          Tool Calls ({toolCalls.length})
        </h2>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-200 font-mono text-xs"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {toolCalls.length === 0 ? (
          <div className="text-gray-500 text-xs font-mono text-center py-4">
            No tool calls yet
          </div>
        ) : (
          toolCalls.map((toolCall) => (
            <ToolCallCard key={toolCall.id} toolCall={toolCall} variant="panel" />
          ))
        )}
      </div>
    </div>
  );
}

