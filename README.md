# 💼 Lisandro Andia - Portfolio

Portfolio profesional de Ingeniero en Sistemas, construido con Next.js 14, TypeScript y Tailwind CSS.

🌐 **Live**: [lisandroandia.com](https://lisandro.lassenware.com)

---

## ✨ Features

- 🌍 **Multilenguaje** (ES/EN) con next-intl
- 🌓 **Dark/Light theme** con persistencia local
- 🔍 **SEO optimizado** (meta tags, sitemap, robots.txt, Open Graph)
- 📱 **Responsive design** mobile-first
- 📧 **Formulario de contacto** con API Route segura
- 📊 **Analytics** integrado (Vercel Analytics)
- ⚡ **Performance optimizado** (imágenes comprimidas, SSG)
- ♿ **Accesible** (semantic HTML, ARIA labels)

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Next.js 14** | Framework React con App Router |
| **TypeScript** | Type safety y mejor DX |
| **Tailwind CSS** | Utility-first styling |
| **next-intl** | Internacionalización |
| **Lucide React** | Iconos modernos |
| **Web3Forms** | Manejo de formularios |
| **Vercel Analytics** | Tracking de visitantes |


## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── [locale]/              # Rutas localizadas
│   │   ├── page.tsx           # Página principal
│   │   ├── servicios/         # Página de servicios
│   │   ├── layout.tsx         # Layout con metadata
│   │   ├── error.tsx          # Error boundary
│   │   └── loading.tsx        # Loading state
│   ├── api/
│   │   └── contact/           # API Route para formulario
│   ├── components/
│   │   ├── landing/           # Componentes de landing
│   │   └── layout/            # Navbar, Footer
│   ├── hooks/                 # Custom React hooks
│   ├── layout.tsx             # Root layout
│   ├── robots.ts              # SEO robots
│   └── sitemap.ts             # SEO sitemap
├── data/                      # Datos estáticos
│   ├── projects.ts            # Portfolio projects
│   ├── experiences.ts         # Work experiences
│   └── servicios.ts           # Services offered
├── i18n/                      # Configuración i18n
│   ├── routing.ts
│   └── request.ts
├── messages/                  # Traducciones
│   ├── es.json                # Español
│   └── en.json                # English
└── types/                     # TypeScript types

public/
├── projects/                  # Imágenes de proyectos
├── profile-about.jpg          # Foto de perfil
└── *.png                      # Logos y assets
```

---

## 🚀 Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/)

El deploy es automático en cada push a `main`.

---

### Agregar idioma

1. Agregar locale en `src/i18n/routing.ts`
2. Crear `src/messages/{locale}.json`
3. Actualizar `generateStaticParams` en layouts

---

## 📊 Performance

- ⚡ **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- 📦 **Bundle Size**: ~87 KB shared JS
- 🖼️ **Images**: Optimizadas < 500 KB
- 🎯 **First Load**: < 115 KB por página

---

## 🔒 Seguridad

- ✅ API key protegida en server-side
- ✅ Validación de formularios
- ✅ Rate limiting listo (Web3Forms)
- ✅ No expone secrets al cliente
- ✅ HTTPS only en producción


## 📄 Licencia

Este proyecto es de código abierto para propósitos educativos.

**Nota**: Las imágenes de proyectos y contenido personal son © Lisandro Andia.

---

## 👤 Autor

**Lisandro Andia**

- Portfolio: [lisandroandia.com](https://lisandroandia.com)
- GitHub: [@lisandro-10](https://github.com/lisandro-10)
- LinkedIn: [Lisandro Andia](https://www.linkedin.com/in/lisandro-andia-3b46aa23a)
- Email: lisandroandia14@gmail.com
