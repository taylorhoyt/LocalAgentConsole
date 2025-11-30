import { useState, useEffect } from 'react';
import type { ConversationSettings } from '../../types';
import type { CustomField } from '../../utils/customFieldTypes';
import { detectFieldType, valueToString } from '../../utils/customFieldTypes';
import { parseFieldValue } from '../../utils/customFieldParser';
import CustomFieldsSection from './customFields/CustomFieldsSection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ConversationSettings;
  onSave: (settings: ConversationSettings) => void;
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
      return Object.entries(settings.customFields).map(([key, value]) => {
        const type = detectFieldType(value);
        return {
          key,
          type,
          value: valueToString(type, value),
        };
      });
    }
    return [];
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
      if (settings.customFields) {
        setCustomFields(
          Object.entries(settings.customFields).map(([key, value]) => {
            const type = detectFieldType(value);
            return {
              key,
              type,
              value: valueToString(type, value),
            };
          })
        );
      } else {
        setCustomFields([]);
      }
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert custom fields array to object using parser
    const customFieldsObj: Record<string, unknown> = {};
    customFields.forEach((field) => {
      if (field.key.trim()) {
        customFieldsObj[field.key.trim()] = parseFieldValue(field.type, field.value);
      }
    });
    
    onSave({
      ...formData,
      customFields: Object.keys(customFieldsObj).length > 0 ? customFieldsObj : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 h-full"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl font-mono h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Settings</h3>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1 mt-2">
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
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Prompt Wrapper Template
              </label>
              <textarea
                value={formData.promptWrapper || ''}
                onChange={(e) =>
                  setFormData({ ...formData, promptWrapper: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500 resize-y min-h-[80px] font-mono"
                placeholder='<user_prompt> {user prompt} </user_prompt>'
                rows={3}
              />
              <p className="text-xs text-gray-400 mt-1">
                Use {'{user prompt}'} or {'{user_prompt}'} as a placeholder for the user input. Leave empty to send the prompt as-is.
              </p>
            </div>
            <CustomFieldsSection
              fields={customFields}
              onFieldsChange={setCustomFields}
            />
          </div>
          <div className="flex gap-2 justify-end pt-4 pb-6 px-6 flex-shrink-0 border-t border-gray-700">
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

