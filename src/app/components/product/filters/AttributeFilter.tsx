'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useProductFilters } from '@/app/hooks/useProductFilters';

interface AttributeFilterProps {
  name: string;           // Internal name (e.g., 'color', 'talle')
  label: string;          // Display label (e.g., 'Color', 'Talle')
  options: string[];      // Available values
  collapsible?: boolean;  // For sidebar mode
  defaultOpen?: boolean;
}

export default function AttributeFilter({ 
  name, 
  label, 
  options,
  collapsible = true,
  defaultOpen = true 
}: AttributeFilterProps) {
  const { filters, toggleAttributeValue } = useProductFilters();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const selectedValues = filters.attributes[name] || [];

  if (options.length === 0) return null;

  return (
    <div className="border-b border-dark-lighter pb-4">
      {/* Header */}
      {collapsible ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="text-sm font-medium text-white">
            {label}
            {selectedValues.length > 0 && (
              <span className="ml-2 text-xs text-primary">
                ({selectedValues.length})
              </span>
            )}
          </span>
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      ) : (
        <p className="text-sm font-medium text-white py-2">
          {label}
          {selectedValues.length > 0 && (
            <span className="ml-2 text-xs text-primary">
              ({selectedValues.length})
            </span>
          )}
        </p>
      )}

      {/* Options */}
      {isOpen && (
        <div className="space-y-1 mt-1">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option);
            
            return (
              <button
                key={option}
                onClick={() => toggleAttributeValue(name, option)}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors
                           ${isSelected 
                             ? 'bg-primary/10 text-primary' 
                             : 'text-gray-300 hover:bg-dark hover:text-white'
                           }`}
              >
                {/* Checkbox visual */}
                <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                                 ${isSelected 
                                   ? 'bg-primary border-primary' 
                                   : 'border-gray-500'
                                 }`}>
                  {isSelected && <Check size={12} className="text-dark" />}
                </span>
                <span className="truncate">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}