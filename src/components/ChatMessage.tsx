import { Bot, User } from 'lucide-react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-500' : 'bg-gray-700'
      }`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div className={`rounded-2xl px-6 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {message.content.split('\n').map((line, index) => {
            // Check if the line contains text between double asterisks
            const boldTextRegex = /\*\*(.*?)\*\*/g;
            const hasBoldText = boldTextRegex.test(line);

            if (hasBoldText) {
              // Replace **text** with bold spans
              const parts = line.split(boldTextRegex);
              return (
                <p key={index} className={`${index > 0 ? 'mt-2' : ''}`}>
                  {parts.map((part, i) => {
                    if (i % 2 === 1) {
                      // Odd indices contain the text between asterisks
                      return <span key={i} className="font-bold">{part}</span>;
                    }
                    return part;
                  })}
                </p>
              );
            }

            return (
              <p key={index} className={`${index > 0 ? 'mt-2' : ''}`}>
                {line.startsWith('•') ? (
                  <span className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{line.slice(1).trim()}</span>
                  </span>
                ) : line}
              </p>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <time>{new Date(message.timestamp).toLocaleTimeString()}</time>
          {message.model && (
            <>
              <span>·</span>
              <span className="font-medium">{message.model}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}