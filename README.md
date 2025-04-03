# MediaLab FabLab Universitario - UPEC

[![Estado del proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)](https://github.com/tuusuario/medialab)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)

## 📋 Descripción

**MediaLab** es un sitio web desarrollado para el **FabLab Universitario de la Universidad Politécnica Estatal del Carchi (UPEC)**. Es un espacio de innovación y creatividad que combina tecnología multimedia y fabricación digital. Este proyecto ofrece una plataforma interactiva para mostrar los equipos disponibles, los laboratorios especializados y facilitar la reserva de espacios.

El objetivo es proporcionar a estudiantes, docentes e investigadores una herramienta para explorar los recursos disponibles en el FabLab y participar en los proyectos de fabricación digital.

## ✨ Características

- **Página de inicio informativa** con detalles sobre el FabLab y su misión
- **Catálogo de equipos multimedia** con descripciones técnicas
- **Información sobre laboratorios especializados**:
  - Laboratorio de Impresión 3D
  - Laboratorio de Electrónica
  - Laboratorio de Programación
  - Laboratorio de Realidad Virtual
- **Sistema de navegación intuitivo** mediante pestañas
- **Diseño completamente responsivo** compatible con dispositivos móviles
- **Interfaz moderna** con animaciones y efectos visuales

## 🚀 Tecnologías utilizadas

- **Frontend**: React.js + TypeScript
- **Estilos**: CSS Modules
- **Iconos**: React Icons
- **Control de versiones**: Git
- **Gestión de estados**: Context API

## 🛠️ Instalación y configuración

### Requisitos previos

- Node.js (v16.0.0 o superior)
- npm (v8.0.0 o superior)

### Pasos de instalación

1. Clona este repositorio:
```bash
git clone https://github.com/tuusuario/medialab.git
cd medialab
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador y visita: `http://localhost:5173`

## 📁 Estructura del proyecto

```
medialab/
├── public/
│   ├── img/             # Imágenes y recursos estáticos
│   ├── index.html       # Plantilla HTML principal
│   └── ...
├── src/
│   ├── assets/         # Recursos y logos
│   ├── components/     # Componentes React
│   │   ├── Header/     # Encabezado y navegación
│   │   ├── Footer/     # Pie de página
│   │   ├── MainContent/ # Contenido principal
│   │   └── ...
│   ├── pages/          # Páginas principales
│   │   ├── Eventos/
│   │   ├── Cursos/
│   │   ├── Laboratorios/
│   │   ├── Herramientas/
│   │   └── ...
│   ├── styles/
│   │   ├── global.css  # Estilos generales
│   │   ├── variables.css # Variables CSS
│   │   └── ...
│   ├── App.tsx         # Componente raíz
│   ├── main.tsx        # Punto de entrada
│   └── ...
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

## 🔧 Personalización

### Añadir nuevos equipos

Para añadir nuevos equipos al catálogo, modifica el arreglo `equipmentItems` en el archivo `src/components/MainContent/index.tsx`:

```tsx
const equipmentItems = [
  {
    nombre: "Nuevo Equipo",
    icono: <FaCamera className={styles.equipmentIcon} />,
    imagen: "/img/nuevo-equipo.jpg",
    descripcion: "Descripción del nuevo equipo"
  },
  // Más equipos...
];
```

### Añadir nuevos laboratorios

Para añadir nuevos laboratorios, modifica el arreglo `laboratorios` en el archivo `src/pages/Laboratorios/index.tsx`:

```tsx
const laboratorios = [
  {
    nombre: 'Nuevo Laboratorio',
    icono: <FaTools size={24} />,
    descripcion: 'Descripción del nuevo laboratorio',
    enlace: '#',
    estado: 'Abierto'
  },
  // Más laboratorios...
];
```

## 📱 Compatibilidad con dispositivos móviles

El sitio web está diseñado para ser completamente responsivo, adaptándose a diferentes tamaños de pantalla:

- **Escritorio**: Visualización completa con diseño en rejilla
- **Tablet**: Diseño adaptado con elementos reorganizados
- **Móvil**: Diseño de una sola columna optimizado para pantallas pequeñas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para colaborar:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añade nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Si tienes preguntas o sugerencias sobre el proyecto, no dudes en contactarnos:

- Correo electrónico: tuemail@universidad.edu
- Twitter: [@MediaLabFabLab](https://twitter.com/MediaLabFabLab)
- Sitio web: [www.medialab-fablab.edu](https://www.medialab-fablab.edu)

---

### **Desarrollado por Wladimir Almeida, estudiante de la carrera de Computación en la Universidad Politécnica Estatal del Carchi (UPEC).**

