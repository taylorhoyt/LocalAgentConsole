import { useState, useEffect } from 'react';
import type { CustomField } from '../../../utils/customFieldTypes';
import { fieldsToJson, jsonToFields } from '../../../utils/customFieldConverter';
import CustomFieldRow from './CustomFieldRow';
import CustomFieldsTextEditor from './CustomFieldsTextEditor';

type EditMode = 'form' | 'text';

interface CustomFieldsSectionProps {
  fields: CustomField[];
  onFieldsChange: (fields: CustomField[]) => void;
}

export default function CustomFieldsSection({
  fields,
  onFieldsChange,
}: CustomFieldsSectionProps) {
  const [editMode, setEditMode] = useState<EditMode>('form');
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonErrors, setJsonErrors] = useState<string[]>([]);

  // Sync JSON text when fields change in form mode
  useEffect(() => {
    if (editMode === 'form') {
      setJsonText(fieldsToJson(fields));
    }
  }, [fields, editMode]);

  const handleAddField = () => {
    onFieldsChange([
      ...fields,
      { key: '', type: 'string', value: '' },
    ]);
  };

  const handleRemoveField = (index: number) => {
    onFieldsChange(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: CustomField) => {
    onFieldsChange(
      fields.map((f, i) => (i === index ? field : f))
    );
  };

  const handleModeToggle = () => {
    if (editMode === 'form') {
      // Switching to text mode: convert fields to JSON
      const json = fieldsToJson(fields);
      setJsonText(json);
      setEditMode('text');
    } else {
      // Switching to form mode: parse JSON to fields
      const result = jsonToFields(jsonText);
      if (result.errors.length > 0) {
        // Mark as invalid but still allow switching
        setJsonErrors(result.errors);
      } else {
        setJsonErrors([]);
        onFieldsChange(result.fields);
      }
      setEditMode('form');
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    // Update fields in real-time if JSON is valid
    const result = jsonToFields(value);
    if (result.errors.length === 0) {
      setJsonErrors([]);
      onFieldsChange(result.fields);
    } else {
      setJsonErrors(result.errors);
    }
  };

  const handleJsonValidationChange = (isValid: boolean, errors: string[]) => {
    setJsonErrors(errors);
  };

  return (
    <div className="border-t border-gray-700 pt-4 my-4">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm text-gray-300">Custom Request Fields</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleModeToggle}
            className="px-3 py-1 text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
            title={editMode === 'form' ? 'Switch to text editor' : 'Switch to form editor'}
          >
            {editMode === 'form' ? 'Edit as JSON' : 'Edit as Form'}
          </button>
          {editMode === 'form' && (
            <button
              type="button"
              onClick={handleAddField}
              className="px-3 py-1 text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
            >
              + Add Field
            </button>
          )}
        </div>
      </div>
      {editMode === 'form' ? (
        <div className="space-y-2 max-h-48 overflow-y-auto overflow-x-hidden">
          {fields.map((field, index) => (
            <CustomFieldRow
              key={index}
              field={field}
              onChange={(updatedField) => handleFieldChange(index, updatedField)}
              onRemove={() => handleRemoveField(index)}
            />
          ))}
          {fields.length === 0 && (
            <p className="text-xs text-gray-500 italic">
              No custom fields. Click "Add Field" to add key-value pairs that will be included in the request body.
            </p>
          )}
          {jsonErrors.length > 0 && (
            <div className="text-xs text-yellow-400 space-y-1 mt-2 p-2 bg-yellow-900/20 border border-yellow-800/50 rounded">
              <div className="font-semibold mb-1">Warning: Invalid data detected</div>
              {jsonErrors.map((error, index) => (
                <div key={index} className="flex items-start gap-1">
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <CustomFieldsTextEditor
          value={jsonText}
          onChange={handleJsonChange}
          onValidationChange={handleJsonValidationChange}
        />
      )}
    </div>
  );
}

