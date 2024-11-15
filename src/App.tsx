import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ChatPanel } from './components/ChatPanel';
import { ChatInput } from './components/ChatInput';
import { ModelToggle } from './components/ModelToggle';
import { ChatState, Message, ModelType } from './types/chat';
import { sendMessage } from './services/api';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isTyping: {
      gemini: false,
      mixtral: false,
      llama: false,
    },
    error: {
      gemini: null,
      mixtral: null,
      llama: null,
    },
    enabledModels: {
      gemini: true,
      mixtral: true,
      llama: true,
    }
  });

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: {
        gemini: prev.enabledModels.gemini,
        mixtral: prev.enabledModels.mixtral,
        llama: prev.enabledModels.llama,
      },
      error: {
        gemini: null,
        mixtral: null,
        llama: null,
      },
    }));

    const enabledModels = Object.entries(state.enabledModels)
      .filter(([, enabled]) => enabled)
      .map(([model]) => model as ModelType);

    await Promise.all(
      enabledModels.map(async (model) => {
        try {
          const response = await sendMessage(model, content);
          const botMessage: Message = {
            id: Date.now().toString() + model,
            content: response.content,
            role: 'assistant',
            timestamp: Date.now(),
            model,
          };

          setState(prev => ({
            ...prev,
            messages: [...prev.messages, botMessage],
            isTyping: {
              ...prev.isTyping,
              [model]: false,
            },
          }));
        } catch (error) {
          setState(prev => ({
            ...prev,
            isTyping: {
              ...prev.isTyping,
              [model]: false,
            },
            error: {
              ...prev.error,
              [model]: error instanceof Error ? error.message : 'An error occurred',
            },
          }));
        }
      })
    );
  };

  const handleModelToggle = (model: ModelType) => {
    setState(prev => ({
      ...prev,
      enabledModels: {
        ...prev.enabledModels,
        [model]: !prev.enabledModels[model],
      },
    }));
  };

  const handleClearConversation = () => {
    setState(prev => ({
      ...prev,
      messages: [],
      error: {
        gemini: null,
        mixtral: null,
        llama: null,
      }
    }));
  };

  const activeModelsCount = Object.values(state.enabledModels).filter(Boolean).length;
  const gridClass = activeModelsCount === 1 
    ? 'grid-cols-1' 
    : activeModelsCount === 2 
      ? 'lg:grid-cols-2 grid-cols-1' 
      : 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1';

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="flex-none bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Multimodel Chat</h1>
          <button
            onClick={handleClearConversation}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Clear Conversation</span>
          </button>
        </div>

        <ModelToggle
          enabledModels={state.enabledModels}
          onToggle={handleModelToggle}
        />
      </header>

      <main className="flex-1 overflow-y-auto max-w-auto p-4">
        <div className={`grid ${gridClass} gap-4 h-full`}>
          {Object.entries(state.enabledModels).map(([model, enabled]) => (
            enabled && (
              <ChatPanel
                key={model}
                title={`${model.charAt(0).toUpperCase() + model.slice(1)} Chat`}
                messages={state.messages}
                isTyping={state.isTyping[model as ModelType]}
                error={state.error[model as ModelType]}
                model={model as ModelType}
              />
            )
          ))}
        </div>
      </main>

      <footer className="flex-none">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={activeModelsCount === 0}
        />
      </footer>
    </div>
  );
}

export default App;