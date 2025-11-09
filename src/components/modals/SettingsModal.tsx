import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import type { ConversationSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ConversationSettings;
  onSave: (settings: ConversationSettings) => void;
}

interface CustomField {
  key: string;
  value: string;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
  const [formData, setFormData] = useState<ConversationSettings>(settings);
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    if (settings.customFields) {
      return Object.entries(settings.customFields).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
      }));
    }
    return [];
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
      if (settings.customFields) {
        setCustomFields(
          Object.entries(settings.customFields).map(([key, value]) => ({
            key,
            value: typeof value === 'string' ? value : JSON.stringify(value),
          }))
        );
      } else {
        setCustomFields([]);
      }
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert custom fields array to object
    const customFieldsObj: Record<string, unknown> = {};
    customFields.forEach((field) => {
      if (field.key.trim()) {
        // Try to parse as JSON, otherwise use as string
        try {
          customFieldsObj[field.key.trim()] = JSON.parse(field.value);
        } catch {
          customFieldsObj[field.key.trim()] = field.value;
        }
      }
    });
    
    onSave({
      ...formData,
      customFields: Object.keys(customFieldsObj).length > 0 ? customFieldsObj : undefined,
    });
    onClose();
  };

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    setCustomFields(
      customFields.map((cf, i) => (i === index ? { ...cf, [field]: value } : cf))
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-lg font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Endpoint URL
            </label>
            <input
              type="text"
              value={formData.endpoint}
              onChange={(e) =>
                setFormData({ ...formData, endpoint: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Access Key ID
            </label>
            <input
              type="password"
              value={formData.credentials?.accessKeyId || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  credentials: {
                    ...formData.credentials,
                    accessKeyId: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Secret Access Key
            </label>
            <input
              type="password"
              value={formData.credentials?.secretAccessKey || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  credentials: {
                    ...formData.credentials,
                    secretAccessKey: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Region</label>
            <input
              type="text"
              value={formData.credentials?.region || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  credentials: {
                    ...formData.credentials,
                    region: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="us-east-1"
            />
          </div>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm text-gray-300">Custom Request Fields</label>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="px-3 py-1 text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
              >
                + Add Field
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto overflow-x-hidden">
              {customFields.map((field, index) => (
                <div key={index} className="flex gap-2 items-center min-w-0">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                    placeholder="Field name"
                    className="flex-1 min-w-0 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                    placeholder="Field value (JSON or string)"
                    className="flex-1 min-w-0 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(index)}
                    className="flex-shrink-0 p-1.5 bg-red-900/50 text-red-300 border border-red-800 rounded hover:bg-red-900/70 transition-colors"
                    aria-label="Remove field"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {customFields.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No custom fields. Click "Add Field" to add key-value pairs that will be included in the request body.
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

