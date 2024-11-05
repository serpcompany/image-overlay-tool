import React from 'react';

interface UrlInputProps {
  type: 'image' | 'youtube';
  value: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export function UrlInput({ type, value, defaultValue, required = true, onChange }: UrlInputProps) {
  const placeholder = type === 'image' 
    ? 'Enter thumbnail URL...' 
    : 'Enter YouTube video URL...';
  
  return (
    <input
      type="url"
      name={type === 'image' ? 'url' : 'youtubeUrl'}
      placeholder={placeholder}
      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      defaultValue={defaultValue}
      required={required}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}