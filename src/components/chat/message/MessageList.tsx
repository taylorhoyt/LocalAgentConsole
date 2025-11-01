import { useEffect, useRef } from 'react';
import Message from './Message';
import type { Message as MessageType, ToolCall } from '../../../types';

interface MessageListProps {
  messages: MessageType[];
  getToolCall?: (id: string) => ToolCall | undefined;
}

export default function MessageList({
  messages,
  getToolCall,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 font-mono">
          No messages yet. Start a conversation!
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              getToolCall={getToolCall}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}

