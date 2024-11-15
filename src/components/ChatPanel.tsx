import { Message, ModelType } from '../types/chat';
import { ChatMessage } from './ChatMessage';
import { Loader2 } from 'lucide-react';

interface ChatPanelProps {
  title: string;
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  model: ModelType;
}

export function ChatPanel({ title, messages, isTyping, error, model }: ChatPanelProps) {
  const filteredMessages = messages.filter(m => m.role === 'user' || m.model === model);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg h-96 lg:h-full xl:h-full overflow-hidden">
      <div className="flex-none px-6 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
        {filteredMessages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
          
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 animate-fade-in pl-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Thinking...</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}