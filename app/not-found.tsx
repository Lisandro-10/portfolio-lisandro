"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number - Mobile First */}
        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-primary/20 mb-4 sm:mb-6">
          404
        </h1>

        {/* Main Message - Mobile First */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Página No Encontrada
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 sm:mb-10 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Action Buttons - Mobile First */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link 
            href="/"
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Home size={18} />
            <span>Volver al Inicio</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>Página Anterior</span>
          </button>
        </div>

        {/* Optional: Quick Links */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-dark-lighter">
          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            O puedes explorar:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link 
              href="/#proyectos"
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Mis Proyectos
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              href="/#sobre-mi"
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Sobre Mí
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              href="/#contacto"
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}