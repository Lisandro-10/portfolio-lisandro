import Navbar from "./components/Navbar";
import ProjectCard from "./components/projectCard";
import Image from "next/image";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { projects } from "@/data-projects/projects";
import { experience } from "@/data-projects/experiences";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-14 sm:pt-16">
        {/* Hero Section - Mobile First */}
        <section className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center section-container">
          <div className="w-full">
            <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
              {/* Text Content - Mobile First */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4">
                  Lisandro Andia
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl text-primary mb-4 sm:mb-6">
                  Desarrollador Full Stack | Arquitecto de Software
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mb-6 sm:mb-8 mx-auto md:mx-0">
                  Especializado en crear experiencias web modernas y escalables.
                  Con experiencia en el ciclo de vida completo del desarrollo de
                  software.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                  <a href="#proyectos" className="btn-primary w-full sm:w-auto text-center">
                    Ver Proyectos
                  </a>
                  <a href="#contacto" className="btn-secondary w-full sm:w-auto text-center">
                    Contactar
                  </a>
                </div>
              </div>

              {/* Image - Mobile First */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden border-4 border-primary/20">
                  <Image
                    src="/profile.JPEG"
                    alt="Lisandro Andia"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section - Mobile First */}
        <section id="proyectos" className="section-container bg-dark-lighter/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
              Mis Proyectos
            </h2>
            <p className="text-sm sm:text-base text-gray-300 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Una selección de proyectos que demuestran mi experiencia en
              diferentes tecnologías y soluciones.
            </p>

            {/* Project Grid - Mobile First */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* About Me Section - Mobile First */}
        <section id="sobre-mi" className="section-container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center">
              Sobre Mí
            </h2>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Profile Image - Mobile First */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src="/profile-about.jpg"
                    alt="Lisandro Andia"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Experience Timeline - Mobile First */}
              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center md:text-left">
                  Mi Trayectoria Profesional
                </h3>

                <div className="space-y-6 sm:space-y-8">
                  {experience.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-6 sm:pl-8 border-l-2 border-primary/30"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary"></div>

                      <div className="pb-2">
                        <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                          {exp.role}
                        </h4>
                        <p className="text-sm sm:text-base text-primary mb-2">
                          {exp.company}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 mb-3">
                          {exp.period}
                        </p>
                        <p className="text-sm sm:text-base text-gray-300 mb-3">
                          {exp.description}
                        </p>

                        {/* Tech Tags - Mobile First */}
                        <div className="flex flex-wrap gap-2">
                          {exp.tags.map((tag) => (
                            <span key={tag} className="tech-badge">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Mobile First */}
        <section id="contacto" className="section-container bg-dark-lighter/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
              Contacto
            </h2>
            <p className="text-sm sm:text-base text-gray-300 text-center mb-8 sm:mb-12">
              ¿Tienes un proyecto en mente? ¡Hablemos!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Contact Form - Mobile First */}
              <div className="bg-dark-lighter p-4 sm:p-6 md:p-8 rounded-lg border border-dark-lighter">
                <form className="space-y-4 sm:space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark border border-dark-lighter rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark border border-dark-lighter rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark border border-dark-lighter rounded-lg focus:outline-none focus:border-primary resize-none text-sm sm:text-base transition-colors"
                      placeholder="Cuéntame sobre tu proyecto..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Enviar Mensaje
                  </button>
                </form>
              </div>

              {/* Contact Info - Mobile First */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Encuéntrame en:
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <a
                      href="mailto:lisandro.andia@example.com"
                      className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:text-primary transition-colors"
                    >
                      <Mail size={20} className="flex-shrink-0" />
                      <span>lisandroandia14@gmail.com</span>
                    </a>
                    <a
                      href="tel:+542617890"
                      className="flex items-center gap-3 text-sm sm:text-base text-gray-300 hover:text-primary transition-colors"
                    >
                      <Phone size={20} className="flex-shrink-0" />
                      <span>+54 261 2657201</span>
                    </a>
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-300">
                      <MapPin size={20} className="flex-shrink-0" />
                      <span>Mendoza, Argentina</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                    Redes Sociales:
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/lisandro-10"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-dark-lighter hover:bg-primary rounded-lg transition-all hover:scale-110"
                      aria-label="GitHub"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/lisandro-andia-3b46aa23a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-dark-lighter hover:bg-primary rounded-lg transition-all hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Mobile First */}
        <footer className="bg-dark-lighter py-6 sm:py-8 text-center border-t border-dark-lighter">
          <p className="text-xs sm:text-sm text-gray-400">
            © 2025 Lisandro Andia. Todos los derechos reservados.
          </p>
        </footer>
      </main>
    </>
  );
}