# React + TypeScript + Vite - Repaso React

Este proyecto es una aplicación React con TypeScript que utiliza Vite como herramienta de construcción. La aplicación incluye un sistema de autenticación con tokens y formularios para gestión de estudiantes.

## Requisitos Previos

Antes de ejecutar este proyecto, necesitas tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Java 17** o superior (para el backend)
- **Maven** (para el backend)

## Backend Requerido

**⚠️ IMPORTANTE:** Este proyecto frontend requiere que el backend de Spring Boot esté ejecutándose localmente.

### Configuración del Backend

1. Clona el repositorio del backend:
   ```bash
   git clone https://github.com/CS2031-DBP/week7-lab-backend.git
   cd week7-lab-backend
   git checkout with_security
   ```

2. Ejecuta el backend de Spring Boot:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   O si estás en Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. El backend estará disponible en: `http://localhost:8080`

**Nota:** El frontend está configurado para conectarse al backend en `http://localhost:8080`. Asegúrate de que el backend esté ejecutándose antes de usar la aplicación frontend.

## Instalación y Ejecución del Frontend

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Funcionalidades

- **Autenticación:** Sistema de login con tokens JWT
- **Gestión de contexto:** Manejo de estado global usando React Context
- **Formularios:** Creación de estudiantes con validación
- **Persistencia:** Los tokens se guardan en localStorage

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   └── StudentForm.tsx  # Formulario para crear estudiantes
├── contexts/            # Contextos de React
│   └── TokenContext.tsx # Contexto para manejo de tokens
├── hooks/              # Custom hooks
├── assets/             # Recursos estáticos
├── App.tsx             # Componente principal
└── main.tsx            # Punto de entrada
```

## Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción rápida
- **Axios** - Cliente HTTP para API calls
- **Tailwind CSS** - Framework de CSS utilitario

## Solución de Problemas

### Error de conexión con el backend
- Verifica que el backend esté ejecutándose en `http://localhost:8080`
- Revisa que no haya conflictos de puertos
- Asegúrate de estar en la rama `with_security` del backend

### Problemas con tokens
- Los tokens se almacenan en localStorage del navegador
- Si tienes problemas de autenticación, limpia el localStorage o usa las herramientas de desarrollador