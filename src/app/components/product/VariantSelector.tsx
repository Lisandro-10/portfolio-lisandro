'use client';

import { useState, useMemo, useEffect } from 'react';
import { TiendanubeProduct, ProductVariant, LocalizedField } from '@/lib/tiendanube/types';

interface Props {
  product: TiendanubeProduct;
  locale: string;
  initialVariantId?: number;
  onVariantChange: (variant: ProductVariant) => void;
}

interface AttributeOption {
  name: string;
  values: string[];
}

export default function VariantSelector({ 
  product, 
  locale, 
  initialVariantId,
  onVariantChange 
}: Props) {
  // Extract attribute names from product.attributes
  const attributeNames = useMemo(() => {
    if (!product.attributes || product.attributes.length === 0) return [];
    return product.attributes.map(attr => 
      attr[locale as keyof LocalizedField] || attr.es
    );
  }, [product.attributes, locale]);

  // Build options map: { 'Color': ['Celeste/Blanco', 'Rojo'], 'Talle': ['S', 'M', 'L'] }
  const attributeOptions = useMemo((): AttributeOption[] => {
    if (attributeNames.length === 0) return [];
    
    const optionsMap: Record<string, Set<string>> = {};
    
    attributeNames.forEach(name => {
      optionsMap[name] = new Set();
    });

    product.variants.forEach(variant => {
      if (!variant.values) return;
      variant.values.forEach((value, index) => {
        const attrName = attributeNames[index];
        const val = value?.[locale as keyof LocalizedField] || value?.es;
        if (attrName && val) {
          optionsMap[attrName].add(val);
        }
      });
    });

    return attributeNames.map(name => ({
      name,
      values: Array.from(optionsMap[name] || [])
    }));
  }, [product.variants, attributeNames, locale]);

  // Initialize selection from initialVariantId or first variant
  const getInitialSelection = () => {
    const initialVariant = initialVariantId 
      ? product.variants.find(v => v.id === initialVariantId)
      : product.variants[0];
    
    if (!initialVariant || !initialVariant.values) return {};
    
    const selection: Record<string, string> = {};
    initialVariant.values.forEach((value, index) => {
      const attrName = attributeNames[index];
      const val = value?.[locale as keyof LocalizedField] || value?.es;
      if (attrName && val) {
        selection[attrName] = val;
      }
    });
    return selection;
  };

  const [selection, setSelection] = useState<Record<string, string>>(getInitialSelection);

  // Find variant that matches current selection
  const selectedVariant = useMemo(() => {
    if (attributeNames.length === 0) return product.variants[0];
    
    return product.variants.find(variant => {
      if (!variant.values) return false;
      return variant.values.every((value, index) => {
        const attrName = attributeNames[index];
        const val = value?.[locale as keyof LocalizedField] || value?.es;
        return selection[attrName] === val;
      });
    }) || product.variants[0];
  }, [product.variants, selection, attributeNames, locale]);

  // Notify parent when variant changes
  useEffect(() => {
    if (selectedVariant) {
      onVariantChange(selectedVariant);
    }
  }, [selectedVariant, onVariantChange]);

  // Check if a specific option value is available (has stock)
  const isOptionAvailable = (attrName: string, value: string): boolean => {
    const attrIndex = attributeNames.indexOf(attrName);
    if (attrIndex === -1) return false;

    return product.variants.some(variant => {
      if (!variant.values) return false;
      const variantValue = variant.values[attrIndex];
      const val = variantValue?.[locale as keyof LocalizedField] || variantValue?.es;
      if (val !== value) return false;
      
      // Check if this variant matches other current selections
      const matchesOtherSelections = variant.values.every((v, idx) => {
        if (idx === attrIndex) return true;
        const otherAttrName = attributeNames[idx];
        const otherVal = v?.[locale as keyof LocalizedField] || v?.es;
        return !selection[otherAttrName] || selection[otherAttrName] === otherVal;
      });

      return matchesOtherSelections && (variant.stock === null || variant.stock > 0);
    });
  };

  const handleSelect = (attrName: string, value: string) => {
    setSelection(prev => ({
      ...prev,
      [attrName]: value
    }));
  };

  // Don't render if no attributes or single variant
  if (attributeOptions.length === 0 || product.variants.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-4">
      {attributeOptions.map(attr => (
        <div key={attr.name}>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {attr.name}
            {selection[attr.name] && (
              <span className="ml-2 text-white font-semibold">
                {selection[attr.name]}
              </span>
            )}
          </label>
          
          {/* Button group - mobile friendly */}
          <div className="flex flex-wrap gap-2">
            {attr.values.map(value => {
              const isSelected = selection[attr.name] === value;
              const isAvailable = isOptionAvailable(attr.name, value);
              
              return (
                <button
                  key={value}
                  onClick={() => handleSelect(attr.name, value)}
                  disabled={!isAvailable}
                  className={`
                    min-w-[3rem] px-3 py-2 text-sm font-medium rounded-lg
                    border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-dark-lighter bg-dark hover:border-primary/50 text-white'
                    }
                    ${!isAvailable 
                      ? 'opacity-40 cursor-not-allowed line-through' 
                      : 'cursor-pointer'
                    }
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Stock info */}
      {selectedVariant && selectedVariant.stock !== null && (
        <p className={`text-sm ${selectedVariant.stock <= 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
          {selectedVariant.stock <= 0 
            ? 'Sin stock' 
            : selectedVariant.stock <= 3 
              ? `¡Solo quedan ${selectedVariant.stock}!`
              : `${selectedVariant.stock} disponibles`
          }
        </p>
      )}
    </div>
  );
}