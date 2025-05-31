import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Job } from '../types';

interface JobFormProps {
  onSubmit: (job: Job) => void;
  initialData?: Job;
  onCancel: () => void;
}

export default function JobForm({ onSubmit, initialData, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState<Partial<Job>>(initialData || {
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [],
    isPWDFriendly: false,
  });
  const [requirement, setRequirement] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.company?.trim()) newErrors.company = 'Company is required';
    if (!formData.location?.trim()) newErrors.location = 'Location is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.requirements?.length) newErrors.requirements = 'At least one requirement is needed';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        id: initialData?.id || crypto.randomUUID(),
        ...formData as Job,
        postedDate: new Date().toISOString(),
      });
    }
  };

  const addRequirement = () => {
    if (requirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), requirement.trim()]
      }));
      setRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{initialData ? 'Edit Job' : 'Post New Job'}</h2>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{formData.title}</h3>
          <div className="flex items-center text-gray-600 space-x-4">
            <span>{formData.company}</span>
            <span>•</span>
            <span>{formData.location}</span>
            {formData.isPWDFriendly && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                PWD Friendly
              </span>
            )}
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
          <div>
            <h4 className="font-semibold mb-2">Requirements:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.requirements?.map((req, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full">
                  {req}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {initialData ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.company ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Requirements</label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm"
                placeholder="Add a requirement"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.requirements?.map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full flex items-center"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            {errors.requirements && (
              <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="pwdFriendly"
              checked={formData.isPWDFriendly}
              onChange={(e) => setFormData({ ...formData, isPWDFriendly: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="pwdFriendly" className="ml-2 text-sm text-gray-700">
              This position is PWD friendly
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {initialData ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}