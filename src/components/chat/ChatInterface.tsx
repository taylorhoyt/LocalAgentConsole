import { useState, useCallback } from 'react';
import Header from '../headers/Header';
import MessageList from './message/MessageList';
import ChatInput from './ChatInput';
import ToolCallsPanel from './tools/ToolCallsPanel';
import StreamingIndicator from '../indicators/StreamingIndicator';
import SettingsModal from '../modals/SettingsModal';
import type { Message, ToolCall, ConversationSettings } from '../../types';

const defaultSettings: ConversationSettings = {
  endpoint: '',
  credentials: {},
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ConversationSettings>(() => {
    const saved = localStorage.getItem('agentcore-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const handleSend = useCallback((content: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    // TODO: Implement actual streaming agent call
    // For now, just add a placeholder response
    setTimeout(() => {
      const agentMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'This is a placeholder response. Streaming functionality will be implemented next.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, agentMessage]);
      setIsStreaming(false);
    }, 1000);
  }, []);

  const handleClearConversation = useCallback(() => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
      setToolCalls([]);
    }
  }, []);

  const handleSaveSettings = useCallback((newSettings: ConversationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('agentcore-settings', JSON.stringify(newSettings));
  }, []);

  const getToolCallById = useCallback(
    (id: string) => toolCalls.find((tc) => tc.id === id),
    [toolCalls]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Header
        onSettingsClick={() => setIsSettingsOpen(true)}
        onClearConversation={handleClearConversation}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <MessageList
            messages={messages}
            getToolCall={getToolCallById}
          />
          <StreamingIndicator isStreaming={isStreaming} />
          <ChatInput onSend={handleSend} disabled={isStreaming} />
        </div>
        <ToolCallsPanel toolCalls={toolCalls} />
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

