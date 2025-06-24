# Preparación de la Aplicación Angular para Producción en cPanel

Este documento describe cómo preparar tu aplicación Angular para producción y subirla a tu entorno de cPanel.

## 1. Actualizar la configuración para producción

Antes de compilar la aplicación para producción, asegúrate de actualizar las siguientes configuraciones:

1. En `src/app/services/sensor.service.ts`:
   - Actualiza `private apiUrl` con la URL correcta de tu subdominio:
   ```typescript
   private apiUrl = 'https://tu-subdominio.ejemplo.com'; // Reemplaza con tu subdominio real
   ```
   
   - Cambia `useMockData` a `false` cuando el backend esté funcionando:
   ```typescript
   private useMockData = false;
   ```

## 2. Compilar la aplicación para producción

Una vez que hayas configurado correctamente la URL del backend, compila la aplicación para producción:

```bash
cd c:\Portafolio-sensor\frontend\monitoreo
npm run build --configuration production
```

Esto generará un directorio `dist/monitoreo/browser` con los archivos optimizados para producción.

## 3. Subir archivos a cPanel

### Opción A: Subir manualmente

1. Accede a tu cPanel
2. Abre el Administrador de archivos (File Manager)
3. Navega hasta la carpeta pública de tu sitio web (generalmente `public_html`)
4. Sube todos los archivos y carpetas del directorio `dist/monitoreo/browser`

### Opción B: Subir vía FTP

1. Utiliza un cliente FTP como FileZilla, WinSCP o similar
2. Conecta a tu servidor con tus credenciales de cPanel
3. Sube todo el contenido de `dist/monitoreo/browser` a la carpeta raíz de tu sitio web

## 4. Configurar redirecciones en cPanel (Opcional)

Si quieres que tu aplicación Angular maneje todas las rutas, necesitas configurar una redirección para que todas las solicitudes se dirijan a index.html:

1. Crea o edita un archivo `.htaccess` en la carpeta raíz de tu sitio:

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## 5. Verificar la instalación

1. Visita tu sitio web en `https://tu-subdominio.ejemplo.com`
2. Verifica que la aplicación se cargue correctamente y muestre los datos de los sensores

## Solución de problemas

- **Error 404 en la aplicación Angular**: Asegúrate de haber configurado correctamente el archivo `.htaccess`
- **Error CORS**: Verifica que los archivos PHP tengan las cabeceras CORS configuradas
- **No aparecen datos de sensores**: Verifica que la URL del API en `sensor.service.ts` sea correcta y que el backend esté funcionando
