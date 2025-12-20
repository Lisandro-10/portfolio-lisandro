"use client";

import Navbar from "../components/Navbar";
import PricingCard from "../components/PricingCard";
import { servicePlans, faqItems } from "@/data-projects/servicios";
import { Mail, Phone, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Footer } from "../components/Footer";

export default function Servicios() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="pt-14 sm:pt-16">
        {/* Hero Section */}
        <section className="section-container text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Planes de Desarrollo Web
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Soluciones adaptadas a tus necesidades. Desde una landing page hasta
            una tienda online completa.
          </p>
        </section>

        {/* Pricing Cards Section */}
        <section className="section-container bg-dark-lighter/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {servicePlans.map((plan) => (
                <PricingCard key={plan.title} {...plan} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-dark-lighter rounded-lg border border-dark-lighter overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center gap-4"
                  >
                    <span className="text-sm sm:text-base font-medium text-white">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-primary flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="px-4 sm:px-6 pb-3 sm:pb-4 text-xs sm:text-sm text-gray-400">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section id="contacto-servicios" className="section-container bg-dark-lighter/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
              Contáctame para discutir tu proyecto y obtener un presupuesto
              personalizado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 sm:mb-8">
              <a
                href="mailto:lisandroandia14@gmail.com"
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                <span>Enviar Email</span>
              </a>
              <a
                href="tel:+542612657201"
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                <span>+54 261 2657201</span>
              </a>
            </div>

            <a
              href="/#contacto"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              O usa el formulario de contacto →
            </a>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}