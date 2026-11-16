# CineCloud — Frontend Administrador

Panel de administración de CineCloud. Permite gestionar películas, funciones, sucursales, géneros y clasificaciones, y consultar la cartelera de todas las sucursales en modo lectura.

- **Stack:** React 19 + Vite 8, Tailwind CSS 4 + daisyUI 5, `react-router` 8, MSAL (Azure Entra ID), `react-icons`.
- **Puerto de desarrollo:** `5173`.
- **Ruta base:** `/cine-frontend-admin/` (debe coincidir con el nombre del repo en GitHub Pages).

## Requisitos

- Node.js 20 o superior y npm.
- El backend [`ms-catalogo`](../cine-ms-catalogo) corriendo en `http://localhost:8081`.
- Un App Registration en Azure Entra ID (para el login con Microsoft).

## Configuración

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar la plantilla de variables de entorno:

   ```bash
   cp .env.example .env
   ```

   En Windows:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Completar `.env`:

   | Variable | Descripción |
   |---|---|
   | `VITE_AZURE_CLIENT_ID` | **Requerida.** Client ID del App Registration (también es el audience de la API: `api://{client-id}`). |
   | `VITE_AZURE_AUTHORITY` | **Requerida.** Tenant ID. MSAL arma `https://login.microsoftonline.com/{tenant}/v2.0`. |
   | `VITE_AZURE_SCOPE` | Opcional. Scope delegado de la API. Si falta, se usa `api://{client-id}/access_as_user`. |
   | `VITE_SUPER_ADMIN_ROLE_ID` | Valor del claim `groups`/`roles` que identifica al Super Admin (por defecto `super_admin`). |
   | `VITE_BRANCH_ADMIN_ROLE_ID` | Valor del claim que identifica al Admin de Sucursal (por defecto `branch_admin`). |
   | `VITE_CATALOGO_API_URL` | URL del backend. Acepta `http://localhost:8081` o `http://localhost:8081/api`; el servicio agrega `/api` si falta. También se acepta `VITE_API_URL` como alias. |

   `VITE_AZURE_REDIRECT_URI` aparece en `.env.example` pero **no se lee**: el redirect se calcula como `window.location.origin + BASE_URL`. En local debe estar registrado en Azure como `http://localhost:5173/cine-frontend-admin/`.

   Los valores de `.env.example` son placeholders (`REEMPLAZAR_CLIENT_ID`, `REEMPLAZAR_TENANT_ID`): completalos con los datos reales de tu App Registration. El `.env` real no se versiona.

   Si ambos `VITE_*_ROLE_ID` quedan vacíos, el modo desarrollo trata a todos como `SUPER_ADMIN`.

4. Arrancar:

   ```bash
   npm run dev
   ```

   Abrir `http://localhost:5173/cine-frontend-admin/`.

## Roles y navegación

| Rol | Acceso |
|---|---|
| `SUPER_ADMIN` | Panel Inicio, Películas (ver/crear/editar/eliminar), Géneros, Clasificaciones, Sucursales, Ciudades y vista de cartelera. |
| `BRANCH_ADMIN` | Panel Inicio, Películas en solo lectura (sin crear/editar/eliminar), Funciones de su sucursal y vista de cartelera. |

La navegación es un navbar superior con los desplegables **Sección Películas** y **Sección Sucursales** (este último oculto para `BRANCH_ADMIN`), más un menú de usuario con correo, sucursal asignada y Cerrar Sesión. La sucursal del Branch Admin se resuelve buscando su correo en `GET /api/sucursales` (`adminEmail`).

### Rutas

```
/                              Login (Azure AD)
/login                         Login (Azure AD)
/panel-inicio                  Panel de inicio
/panel-inicio/peliculas        Tabla de películas
/panel-inicio/peliculas/crear  Añadir película (solo Super Admin)
/panel-inicio/peliculas/:id/editar
/pelicula/:slug                Cartelera: funciones reales, solo lectura
/panel-inicio/funciones        Funciones de mi sucursal (Branch Admin)
/panel-inicio/funciones/crear
/panel-inicio/sucursales       Solo Super Admin
/panel-inicio/sucursales/crear
/panel-inicio/sucursales/:id/editar
/panel-inicio/generos
/panel-inicio/clasificaciones
/panel-inicio/ciudades
```

Cualquier ruta desconocida redirige al login.

## Comportamiento y limitaciones

- Todo el HTTP pasa por `src/services/catalogoApi.js`; el token MSAL se inyecta desde `App.jsx` con `setCatalogoAuthProvider`. No llamar a MSAL desde las páginas.
- La vista de cartelera (`/pelicula/:slug`) usa funciones reales de todas las sucursales para los próximos 7 días. La disponibilidad de butacas es un placeholder: depende de `ms-reservas`, que no forma parte de este repositorio.
- Géneros, clasificaciones y ciudades se guardan en `localStorage` (`CatalogMetaContext`), con intento best-effort contra la API.
- Si el backend falla, `PeliculasPage` y `EditarPeliculaPage` caen a datos mock (`src/data/peliculasMock.js`).
- Las tablas se muestran como cards en pantallas menores a `md` y la app avisa en móvil que está pensada para escritorio.
- La sección de Usuarios fue eliminada (no hay páginas ni rutas).

## Build y despliegue

```bash
npm run build     # genera dist/
npm run preview   # sirve el build localmente
```

El despliegue a GitHub Pages está en `.github/workflows/main.yml` (push a `main`) y usa estos secrets del repositorio:

`VITE_AZURE_CLIENT_ID`, `VITE_AZURE_AUTHORITY`, `VITE_AZURE_REDIRECT_URI`, `VITE_AZURE_SCOPE`, `VITE_CATALOGO_API_URL` (o `VITE_API_URL`), `VITE_SUPER_ADMIN_ROLE_ID`, `VITE_BRANCH_ADMIN_ROLE_ID`.

El workflow copia `dist/index.html` a `dist/404.html` para que funcione el routing de SPA. `vite.config.js` fija `base: '/cine-frontend-admin/'`; si el repositorio cambia de nombre, hay que actualizar ese base y registrar el redirect correspondiente en Azure.

## Lint

`npm run lint` hoy no está en verde (faltan reglas/plugin de React y hay deuda de hooks). No es bloqueante para el build; evitá agregar errores nuevos.
