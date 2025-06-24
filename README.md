# Instrucciones para ejecutar el Sistema de Monitoreo de Sensores

## Configuración del Backend

1. Asegúrate de tener un servidor web como Apache o Nginx con PHP habilitado
2. Configura tu base de datos MySQL:
   - Base de datos: `CIMARQ`
   - Tablas:
     - `temperatura`: id (int, PK), nombre_sensor (varchar), valor (float), fecha (datetime)
     - `ph`: id (int, PK), nombre_sensor (varchar), valor (float), fecha (datetime)
     - `oxigeno`: id (int, PK), nombre_sensor (varchar), valor (float), fecha (datetime)
3. Coloca todos los archivos de la carpeta `backend` en tu servidor web
4. Edita el archivo `conexion.php` para configurar tus credenciales de base de datos

## Configuración del Frontend (Angular)

1. Asegúrate de tener Node.js y npm instalados
2. Navega a la carpeta `frontend/monitoreo`
3. Instala las dependencias:
   ```
   npm install
   ```
4. Configura el uso de datos reales o simulados:
   - En `src/app/services/sensor.service.ts`, establece `useMockData` en `true` si quieres usar datos simulados para desarrollo
   - Establece `useMockData` en `false` y actualiza la `apiUrl` si tienes el backend en funcionamiento
5. Ejecuta la aplicación en modo desarrollo:
   ```
   ng serve
   ```
6. Abre un navegador y ve a `http://localhost:4200`

## Rangos de Valores para los Sensores

### Temperatura
- **Verde (óptimo)**: 18 a 22 °C
- **Amarillo (alerta)**: 16-17 o 23-24 °C
- **Rojo (crítico)**: <16 o >24 °C

### pH
- **Verde (óptimo)**: 6.5 a 8.5
- **Amarillo (alerta)**: 6.0-6.5 o 8.5-9.0
- **Rojo (crítico)**: <6.0 o >9.0

### Oxígeno
- **Verde (óptimo)**: 6.5 a 8 mg/L
- **Amarillo (alerta)**: 5-6.5 o 8-9 mg/L
- **Rojo (crítico)**: <5 o >9 mg/L

## Funcionamiento

La aplicación consulta automáticamente los datos de los sensores cada 10 segundos y actualiza la pantalla con los valores más recientes.

## Solución de problemas

- **Error de conexión a la base de datos**: Verifica las credenciales en `conexion.php`
- **Error de conexión HTTP**: 
  1. Asegúrate de que el servidor web esté ejecutándose
  2. Verifica que la URL en `sensor.service.ts` apunta al servidor correcto
  3. Si estás en desarrollo, activa el modo de datos simulados (`useMockData = true`)
- **Los colores de las tarjetas no cambian**: Verifica que los valores están dentro de los rangos esperados
