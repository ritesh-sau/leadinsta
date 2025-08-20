'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Grip, Trash2, Eye, Settings, CheckCircle, XCircle } from 'lucide-react'; // Added CheckCircle and XCircle icons

// 1. Interface for Field Type Configuration
interface FormFieldTypeConfig {
  label: string;
  icon: string;
}

// Form field types configuration
const FIELD_TYPES: { [key: string]: FormFieldTypeConfig } = {
  text: { label: 'Text Input', icon: '📝' },
  email: { label: 'Email', icon: '📧' },
  number: { label: 'Number', icon: '🔢' },
  textarea: { label: 'Textarea', icon: '📄' },
  select: { label: 'Select', icon: '📋' },
  checkbox: { label: 'Checkbox', icon: '☑️' },
  radio: { label: 'Radio', icon: '🔘' },
  file: { label: 'File Upload', icon: '📎' },
  date: { label: 'Date', icon: '📅' }
};

// Function to generate unique IDs for form fields
const generateId = () => Math.random().toString(36).substr(2, 9);

// 2. Interface for a Form Field Object
interface Field {
  id: string;
  type: keyof typeof FIELD_TYPES; // Ensures type is one of the keys in FIELD_TYPES
  label: string;
  placeholder?: string;
  required: boolean;
  description?: string;
  options?: string[]; // For select, checkbox, radio
  rows?: number; // For textarea
  multiple?: boolean; // For file input
  name?: string; // Optional name for input elements
}

// 3. Interface for FormField Component Props
interface FormFieldProps {
  field: Field;
  isBuilder?: boolean;
  onUpdate?: (id: string, updates: Partial<Field>) => void;
  onDelete?: (id: string) => void;
  value: any; // Value can be string, number, boolean, or string[] for checkboxes
  onChange?: (fieldId: string, value: any) => void;
  index?: number;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  readOnly?: boolean; // New prop to make fields read-only
  error?: string; // New prop for field-specific error messages
}

/**
 * FormField Component
 * Renders an individual form field, handling both builder and preview modes.
 * Supports drag-and-drop functionality in builder mode.
 */
const FormField: React.FC<FormFieldProps> = ({ field, isBuilder = false, onUpdate, onDelete, value, onChange, index, onDragStart, onDragOver, onDrop, readOnly = false, error }) => {
  const [isEditing, setIsEditing] = useState(false); // State to control field editing mode
  const [isDragOver, setIsDragOver] = useState(false); // State to indicate if an item is dragged over

  // Handles updates to the field's properties
  const handleFieldUpdate = (updates: Partial<Field>) => {
    onUpdate && onUpdate(field.id, updates);
    setIsEditing(false); // Exit editing mode after saving
  };

  // Handles the start of a drag operation
  const handleDragStart = (e: React.DragEvent) => {
    if (isBuilder && onDragStart) {
      onDragStart(e, index as number); // index is guaranteed to be number in builder mode
    }
  };

  // Handles an element being dragged over the current field
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    if (isBuilder) {
      setIsDragOver(true); // Highlight the drop target
    }
  };

  // Handles an element leaving the drag over area
  const handleDragLeave = () => {
    if (isBuilder) {
      setIsDragOver(false); // Remove highlight
    }
  };

  // Handles an element being dropped on the current field
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false); // Remove highlight
    if (isBuilder && onDrop) {
      onDrop(e, index as number); // index is guaranteed to be number in builder mode
    }
  };

  // Renders the appropriate input element based on field type
  const renderField = () => {
    const commonProps = {
      id: field.id,
      name: field.name || field.id,
      placeholder: field.placeholder,
      required: field.required,
      className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'}`, // Apply red border if error exists
      value: value || '',
      disabled: readOnly, // Disable input if readOnly is true
    };

    // Handles changes for simple input types
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!readOnly) { // Only call onChange if not readOnly
        onChange && onChange(field.id, e.target.value);
      }
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return <input type={field.type} {...commonProps} onChange={handleInputChange} />;
      
      case 'textarea':
        return <textarea {...commonProps} rows={field.rows || 3} onChange={handleInputChange} />;
      
      case 'select':
        return (
          <select {...commonProps} onChange={handleInputChange}>
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex flex-col space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!readOnly) { // Only call onChange if not readOnly
                      const newValue = Array.isArray(value) ? [...value] : [];
                      if (e.target.checked) {
                        newValue.push(option);
                      } else {
                        const index = newValue.indexOf(option);
                        if (index > -1) newValue.splice(index, 1);
                      }
                      onChange && onChange(field.id, newValue);
                    }
                  }}
                  className="rounded"
                  disabled={readOnly} // Disable checkbox if readOnly
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <div className="flex flex-col space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name={field.id} // Name attribute is crucial for radio groups
                  value={option}
                  checked={value === option}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!readOnly) { // Only call onChange if not readOnly
                      onChange && onChange(field.id, e.target.value);
                    }
                  }}
                  disabled={readOnly} // Disable radio if readOnly
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'file':
        return <input type="file" {...commonProps} onChange={handleInputChange} multiple={field.multiple} />;
      
      case 'date':
        return <input type="date" {...commonProps} onChange={handleInputChange} />;
      
      default:
        return <input type="text" {...commonProps} onChange={handleInputChange} />;
    }
  };

  return (
    <div 
      className={`p-4 border rounded-lg transition-all ${
        isBuilder ? 'bg-gray-50' : 'bg-white'
      } ${isDragOver ? 'border-blue-500 bg-blue-50' : ''}`}
      draggable={isBuilder} // Make draggable only in builder mode
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isBuilder && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Grip className="w-4 h-4 text-gray-400 cursor-grab" /> {/* Drag handle icon */}
            <span className="text-sm font-medium text-gray-600">
              {FIELD_TYPES[field.type]?.icon} {field.label || FIELD_TYPES[field.type]?.label}
            </span>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 text-gray-500 hover:text-blue-600"
              aria-label="Edit Field"
            >
              <Settings className="w-4 h-4" /> {/* Settings icon */}
            </button>
            <button
              onClick={() => onDelete && onDelete(field.id)}
              className="p-1 text-gray-500 hover:text-red-600"
              aria-label="Delete Field"
            >
              <Trash2 className="w-4 h-4" /> {/* Delete icon */}
            </button>
          </div>
        </div>
      )}

      {/* Conditionally render FieldEditor or the actual field */}
      {isEditing && isBuilder ? (
        <FieldEditor field={field} onSave={handleFieldUpdate} onCancel={() => setIsEditing(false)} />
      ) : (
        <div>
          {field.label && (
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {renderField()}
          {field.description && (
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          )}
          {/* Display field-specific error message below the input */}
          {error && (
            <p className="text-red-500 text-xs italic mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

// 4. Interface for FieldEditor Component Props
interface FieldEditorProps {
  field: Field;
  onSave: (updates: Partial<Field>) => void;
  onCancel: () => void;
}

/**
 * FieldEditor Component
 * Allows users to edit properties of a selected form field (e.g., label, placeholder, required).
 */
const FieldEditor: React.FC<FieldEditorProps> = ({ field, onSave, onCancel }) => {
  const [editedField, setEditedField] = useState<Partial<Field>>({ ...field }); // Local state for edits

  // Determine if the field type requires options (e.g., select, checkbox, radio)
  const needsOptions = ['select', 'checkbox', 'radio'].includes(field.type as string); 

  return (
    <div className="space-y-4 p-4 bg-white border rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`label-${field.id}`} className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input
            type="text"
            id={`label-${field.id}`}
            value={editedField.label || ''}
            onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label htmlFor={`placeholder-${field.id}`} className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
          <input
            type="text"
            id={`placeholder-${field.id}`}
            value={editedField.placeholder || ''}
            onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`description-${field.id}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          id={`description-${field.id}`}
          value={editedField.description || ''}
          onChange={(e) => setEditedField({ ...editedField, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label htmlFor={`required-${field.id}`} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`required-${field.id}`}
            checked={editedField.required || false}
            onChange={(e) => setEditedField({ ...editedField, required: e.target.checked })}
          />
          <span className="text-sm">Required</span>
        </label>
        {field.type === 'file' && (
          <label htmlFor={`multiple-${field.id}`} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`multiple-${field.id}`}
              checked={editedField.multiple || false}
              onChange={(e) => setEditedField({ ...editedField, multiple: e.target.checked })}
            />
            <span className="text-sm">Multiple files</span>
          </label>
        )}
      </div>

      {needsOptions && (
        <div>
          <label htmlFor={`options-${field.id}`} className="block text-sm font-medium text-gray-700 mb-1">Options (one per line)</label>
          <textarea
            id={`options-${field.id}`}
            value={(editedField.options || []).join('\n')}
            onChange={(e) => setEditedField({ 
              ...editedField, 
              options: e.target.value.split('\n').filter(opt => opt.trim()) // Split by newline and filter empty lines
            })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Option 1&#10;Option 2&#10;Option 3"
          />
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => onSave(editedField)}
          className="px-4 py-2 bg-blue-600 text-blue rounded-lg hover:bg-blue-700 text-sm"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/**
 * FormBuilder Component
 * The main component for building and previewing dynamic forms.
 * Manages field addition, updates, deletion, reordering (drag-and-drop), and form data.
 */
const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]); // Stores the array of form field objects
  const [formTitle, setFormTitle] = useState('My Dynamic Form'); // Title of the form
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder'); // Controls active tab: 'builder' or 'preview'
  const [formData, setFormData] = useState<{ [key: string]: any }>({}); // Stores the data entered in the form
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null); // Index of the field being dragged
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({}); // State to store validation errors per field

  // Simulate API call on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500)); 

      const predefinedFormData = {
        "title": "My Dynamic Form",
        "fields": [
          { "id": "v0b8zvrma", "type": "text", "label": "Name", "placeholder": "Ritesh", "required": true },
          { "id": "8cec9cuyw", "type": "number", "label": "Age", "placeholder": "23", "required": false },
          { "id": "enwez9xj1", "type": "email", "label": "Email", "placeholder": "rit@hdfcbank.com", "required": true }, // Changed type to 'email'
          { "id": "nf6eau3pv", "type": "text", "label": "Sex", "placeholder": "male", "required": false },
          { "id": "48m3cw0dv", "type": "textarea", "label": "About Me", "placeholder": "Tell us about yourself", "required": false }
        ]
      }; 

      if (predefinedFormData.title === "My Dynamic Form") {
        setFormTitle(predefinedFormData.title);
        setFields(predefinedFormData.fields as Field[]); // Cast to Field[]
        
        const initialFormData: { [key: string]: any } = {};
        const initialFieldErrors: { [key: string]: string } = {}; // Object to store errors for specific fields

        // Iterate through fields to pre-fill data and apply validation
        predefinedFormData.fields.forEach(field => {
          if (field.id === "enwez9xj1" && field.type === "email") {
            // Email validation for placeholder
            if (field.placeholder) {
              if (!field.placeholder.includes('@') || !field.placeholder.includes('.')) {
                initialFieldErrors[field.id] = "Email placeholder must be a valid email format.";
                initialFormData[field.id] = '';
              } else if (!field.placeholder.includes("@hdfcbank.com")) {
                initialFieldErrors[field.id] = "Email placeholder must contain '@hdfcbank.com'.";
                initialFormData[field.id] = '';
              } else {
                initialFormData[field.id] = field.placeholder;
              }
            } else {
              initialFormData[field.id] = '';
            }
          } else if (field.id === "8cec9cuyw" && field.type === "number") {
            // Age validation for placeholder
            const agePlaceholder = parseInt(field.placeholder || '0');
            if (field.placeholder && agePlaceholder < 23) {
              initialFieldErrors[field.id] = "This age is too small.";
              initialFormData[field.id] = ''; // Do not pre-fill if age is too small
            } else if (field.placeholder) {
              initialFormData[field.id] = field.placeholder;
            } else {
              initialFormData[field.id] = '';
            }
          }
          else if (field.placeholder) {
            initialFormData[field.id] = field.placeholder; // Pre-fill other fields from their placeholders
          } else {
            // For checkbox/radio, set a default if options exist
            if (['checkbox', 'radio'].includes(field.type) && field.options && field.options.length > 0) {
                if (field.type === 'checkbox') {
                  initialFormData[field.id] = []; // Checkboxes typically start with an empty array
                } else if (field.type === 'radio') {
                  initialFormData[field.id] = field.options[0]; // Radios can default to the first option
                }
            } else {
                initialFormData[field.id] = ''; // Default for other types
            }
          }
        });
        setFormData(initialFormData);
        setFieldErrors(initialFieldErrors); // Set the field-specific validation errors
        setActiveTab('preview'); // Switch to preview tab
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  // Adds a new field to the form
  const addField = useCallback((type: keyof typeof FIELD_TYPES) => {
    const newField: Field = {
      id: generateId(), // Unique ID for the new field
      type,
      label: FIELD_TYPES[type].label,
      placeholder: `Enter ${FIELD_TYPES[type].label.toLowerCase()}`,
      required: false,
      // Add default options for select, checkbox, radio types
      options: ['select', 'checkbox', 'radio'].includes(type as string) ? ['Option 1', 'Option 2'] : undefined 
    };
    setFields(prev => [...prev, newField]); // Add new field to the end of the array
  }, []);

  // Handles the start of a drag operation for reordering fields
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move'; // Visual feedback for drag operation
  }, []);

  // Handles an element being dragged over the form builder area
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Prevent default to allow drop
    e.dataTransfer.dropEffect = 'move'; // Visual feedback for drop operation
  }, []);

  // Handles the drop of a dragged field for reordering
  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null); // Reset if no valid drag occurred
      return;
    }

    const newFields = [...fields];
    const draggedField = newFields[draggedIndex];
    
    // Remove the dragged field from its original position
    newFields.splice(draggedIndex, 1);
    
    // Insert the dragged field at the new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newFields.splice(insertIndex, 0, draggedField);
    
    setFields(newFields); // Update the fields array
    setDraggedIndex(null); // Reset dragged index
  }, [fields, draggedIndex]);

  // Updates a specific field's properties
  const updateField = useCallback((id: string, updates: Partial<Field>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field // Merge updates into the field
    ));
  }, []);

  // Deletes a field from the form
  const deleteField = useCallback((id: string) => {
    setFields(prev => prev.filter(field => field.id !== id)); // Remove field by ID
  }, []);

  // Handles changes in the form data when a user fills out the preview form
  const handleFormDataChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value // Update the specific field's value
    }));

    // Real-time validation
    setFieldErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      const fieldToValidate = fields.find(f => f.id === fieldId);

      if (fieldToValidate) {
        // Check for required fields
        if (fieldToValidate.required && !value) {
          newErrors[fieldId] = `${fieldToValidate.label} is required.`;
        } 
        // Specific validation for email field
        else if (fieldToValidate.type === "email") {
          if (value && (!value.includes('@') || !value.includes('.'))) {
            newErrors[fieldId] = "Please enter a valid email format (e.g., user@hdfcbank.com).";
          } else if (value && !value.includes("@hdfcbank.com")) {
            newErrors[fieldId] = "Email must contain '@hdfcbank.com'.";
          } else {
            delete newErrors[fieldId]; // Clear error if valid
          }
        } 
        // Clear error for other field types if they are not required or have a value
        else {
          delete newErrors[fieldId]; 
        }
      }
      return newErrors;
    });
  }, [fields]); // Depend on 'fields' to access field properties for validation

  // Handles form submission in the preview mode
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors: { [key: string]: string } = {};

    // Client-side validation before submission
    fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        currentErrors[field.id] = `${field.label} is required.`;
      }
      // Re-validate email on submission if it's the email field
      if (field.type === "email") { // Check for type 'email' instead of specific ID for broader applicability
        if (formData[field.id] && (!formData[field.id].includes('@') || !formData[field.id].includes('.'))) {
          currentErrors[field.id] = "Please enter a valid email format (e.g., user@example.com).";
        } else if (formData[field.id] && !formData[field.id].includes("@hdfcbank.com")) {
          currentErrors[field.id] = "Email must contain '@hdfcbank.com'.";
        }
      }
    });

    setFieldErrors(currentErrors); // Update field-specific errors

    if (Object.keys(currentErrors).length > 0) {
      console.error("Form validation errors:", currentErrors);
      return;
    }

    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.'); 
  };

  // Handles form approval
  const handleApprove = () => {
    if (Object.keys(fieldErrors).length > 0) {
      alert('Cannot approve: There are validation errors in the form.');
      return;
    }
    console.log('Form Approved:', formData);
    alert('Form Approved! Check console for data.');
  };

  // Handles form rejection
  const handleReject = () => {
    if (Object.keys(fieldErrors).length > 0) {
      alert('Cannot reject: There are validation errors in the form.');
      return;
    }
    console.log('Form Rejected:', formData);
    alert('Form Rejected! Check console for data.');
  };

  const isDynamicForm = formTitle === "My Dynamic Form";

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header section with form title and tab navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Editable form title */}
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              aria-label="Form Title"
            />
            {/* Tab navigation for Builder and Preview */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === 'builder' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Builder</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === 'preview' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with grid layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {activeTab === 'builder' && (
            <>
              {/* Field Types Sidebar */}
              <div className="col-span-12 md:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Types</h3>
                  <div className="space-y-2">
                    {Object.entries(FIELD_TYPES).map(([type, config]) => (
                      <button
                        key={type}
                        onClick={() => addField(type as keyof typeof FIELD_TYPES)} // Cast type to ensure correct keyof
                        className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-xl">{config.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{config.label}</span>
                        <Plus className="w-4 h-4 text-gray-400 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Builder Area */}
              <div className="col-span-12 md:col-span-9">
                <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Fields</h3>
                  {fields.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No fields added yet. Start by selecting a field type from the sidebar.</p>
                    </div>
                  ) : (
                    <div className="space-y-4" onDragOver={handleDragOver}>
                      {fields.map((field, index) => (
                        <FormField
                          key={field.id}
                          field={field}
                          index={index}
                          isBuilder={true}
                          onUpdate={updateField}
                          onDelete={deleteField}
                          onDragStart={handleDragStart}
                          onDrop={handleDrop}
                          value={formData[field.id]} // Pass current form data value
                          onChange={handleFormDataChange} // Pass change handler
                          readOnly={false} // Builder fields are always editable
                          error={fieldErrors[field.id]} // Pass error to FormField
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'preview' && (
            <div className="col-span-12">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">{formTitle}</h2>
                  </div>
                  
                  {fields.map((field) => (
                    <FormField
                      key={field.id}
                      field={field}
                      value={formData[field.id]}
                      onChange={handleFormDataChange}
                      readOnly={false} // Removed readOnly={isDynamicForm} to allow typing and trigger real-time validation
                      error={fieldErrors[field.id]} // Pass error to FormField
                    />
                  ))}
                  
                  {fields.length > 0 && (
                    <div className="pt-4 flex justify-center space-x-4">
                      {isDynamicForm ? (
                        <>
                          <button
                            onClick={handleApprove}
                            className="flex items-center justify-center px-6 py-3 bg-green-600 text-blue rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium transition-colors duration-200"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" /> Approve
                          </button>
                          <button
                            onClick={handleReject}
                            className="flex items-center justify-center px-6 py-3 bg-red-600 text-blue rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium transition-colors duration-200"
                          >
                            <XCircle className="w-5 h-5 mr-2" /> Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors duration-200"
                        >
                          Submit Form
                        </button>
                      )}
                    </div>
                  )}
                  
                  {fields.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No fields to preview. Add some fields in the builder tab.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
  
export default FormBuilder;
