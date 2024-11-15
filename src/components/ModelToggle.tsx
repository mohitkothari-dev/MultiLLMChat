import { ModelType } from '../types/chat';

interface ModelToggleProps {
  enabledModels: Record<ModelType, boolean>;
  onToggle: (model: ModelType) => void;
}

export function ModelToggle({ enabledModels, onToggle }: ModelToggleProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
      {(Object.keys(enabledModels) as ModelType[]).map((model) => (
        <button
          key={model}
          onClick={() => onToggle(model)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            enabledModels[model]
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {model.charAt(0).toUpperCase() + model.slice(1)}
        </button>
      ))}
    </div>
  );
}