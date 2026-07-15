# Actividad Final de Mauro

Aplicación final de Desarrollo de Interfaces Ricos para Internet para descubrir películas y compartir valoraciones. 

Realizada por Mauro Varea Fernández.

## Funcionalidades

- Enrutado con páginas públicas, privadas y exclusivas para administración.
- Registro, inicio de sesión y restauración de sesión mediante JWT.
- Catálogo, detalle de películas, reseñas públicas y buscadores.
- Alta, edición y borrado de las reseñas propias, permitiendo varias valoraciones de una misma película.
- Alta, edición y borrado de películas para usuarios con rol `ADMIN`.
- Paginación en el backend, carga adicional bajo demanda y carga diferida de páginas con `React.lazy` y `Suspense`.
- Estado global con Redux Toolkit y middleware de logging.
- Tailwind CSS y componentes accesibles de Headless UI.
- Internacionalización con React Intl en castellano, inglés y asturiano.
- Error Boundary en React y middleware centralizado de errores en Express.
- Pruebas unitarias con Vitest.
- Backend Express conectado a una base de datos MySQL local.

## Puesta en marcha

Requisitos: Node.js, npm y MySQL.

1. Instala las dependencias del frontend desde la raíz:

   ```bash
   npm install
   ```

2. Instala las dependencias del servidor:

   ```bash
   cd server
   npm install
   ```

3. Crea la base de datos ejecutando, en este orden, `server/database/schema.sql` y `server/database/seed.sql` desde MySQL Workbench o la consola de MySQL.

4. Copia `server/.env.example` como `server/.env` y adapta la conexión.
5. Crea la cuenta administradora con los valores `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` del archivo de entorno:

   ```bash
   npm run create-admin
   ```

6. Arranca el backend desde `server/`:

   ```bash
   npm run dev
   ```

7. En otra terminal, arranca Vite desde la raíz del proyecto:

   ```bash
   npm run dev
   ```

Vite redirige `/api` al servidor local situado en `http://localhost:3001`. Para utilizar otra dirección, copia `.env.example` como `.env` y define `VITE_API_URL`.

## Pruebas

```bash
npm test
```

## Despliegue

La aplicación usa `BrowserRouter` y toma la ruta base de `VITE_APP_BASE_URL`. Para GitHub Pages, esta variable debe coincidir exactamente con el nombre del repositorio, por ejemplo `/DIRIFinal/`. El frontend y el backend se despliegan por separado: GitHub Pages no puede ejecutar Express ni alojar MySQL. En producción, `VITE_API_URL` debe contener la URL pública HTTPS del backend antes de generar el frontend.
