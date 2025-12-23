'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImage {
  id: number;
  src: string;
  position: number;
  alt: string[];
}

interface Props {
  images: ProductImage[];
}

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-dark-lighter rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Sin imagen</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Imagen Principal */}
      <div className="relative w-full aspect-square bg-dark-lighter rounded-lg overflow-hidden group">
        <Image
          src={images[selectedImage].src}
          alt={images[selectedImage].alt[0] || 'Product image'}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />

        {/* Navegación (solo si hay múltiples imágenes) */}
        {images.length > 1 && (
          <>
            {/* Botones de navegación - visible en mobile */}
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-dark/80 backdrop-blur-sm rounded-full text-white hover:bg-dark transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-dark/80 backdrop-blur-sm rounded-full text-white hover:bg-dark transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicadores de posición */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedImage
                      ? 'bg-primary w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails - solo si hay múltiples imágenes */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImage
                  ? 'border-primary scale-105'
                  : 'border-dark-lighter hover:border-primary/50'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt[0] || `Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}