# Un juego cada día

Catálogo público en español de juegos originales. Cada juego vive en su propio repositorio y se publica de forma independiente. Este repositorio contiene solamente la página principal y sus metadatos.

- Catálogo: https://mitchell-castillo.github.io/daily-games/
- Primer juego: https://mitchell-castillo.github.io/orbita-de-rescate/
- Segundo juego: https://mitchell-castillo.github.io/faro-de-medianoche/
- Código del segundo juego: https://github.com/mitchell-castillo/faro-de-medianoche
- Código del primer juego: https://github.com/mitchell-castillo/orbita-de-rescate

- Tercer juego: https://mitchell-castillo.github.io/jardin-de-bolsillo/
- Código del tercer juego: https://github.com/mitchell-castillo/jardin-de-bolsillo

## Ejecutar localmente

No hay dependencias ni compilación. Con Python 3 y Node.js 24:

```sh
npm start
# Abrir http://localhost:8080
npm run check
```

Se debe servir por HTTP, no abrir index.html como archivo, porque el catálogo se carga con fetch.

## Publicación

GitHub Pages → Deploy from a branch → main → / (root). El archivo .nojekyll habilita la publicación de los archivos estáticos. Las rutas locales son relativas, compatibles con el subdirectorio /daily-games/. Los juegos apuntan a URLs absolutas para permitir repositorios y despliegues independientes.

El workflow check.yml comprueba sintaxis y pruebas en cada push y pull request; no necesita secretos. GitHub Pages se publica por separado desde main.

## Agregar un juego

1. Revisar las mecánicas y la descripción de originalidad de todos los juegos en games.json. No publicar una repetición con otro nombre o aspecto.
2. Crear un repositorio independiente para el nuevo juego. Debe tener controles de teclado y táctiles, progreso local con clave única, instrucciones y pruebas.
3. Publicar y verificar el juego antes de añadirlo al catálogo.
4. Añadir su imagen de portada a assets/ y su ficha a games.json. Conservar los IDs y números existentes.
5. Incluir id, number, title, subtitle, description, category, tags, date, duration, difficulty, levels, status, href, repository, cover, storageKey, controls, mechanic y uniqueness. La URL href debe ser absoluta y apuntar al despliegue independiente. Solo las fichas con status "published" aparecen.
6. Ejecutar npm run check y comprobar búsqueda, categoría, detalle y enlace al juego en escritorio y móvil.

El campo opcional levelLabel permite llamar a las etapas «noches» u otro nombre, sin cambiar las fichas existentes. Los resúmenes de progreso admiten mejores movimientos para puzles y mejores puntos/estrellas para arcade.

Las categorías son datos, no rutas codificadas. La ficha destacada es la de mayor number. Los filtros muestran solo categorías que contienen juegos publicados. La búsqueda combina categoría, título, descripción y etiquetas, sin distinguir mayúsculas ni tildes. El botón para limpiar filtros restaura toda la colección.

## Privacidad y avance

No hay cuentas, servidor de datos, cookies de seguimiento, analytics ni dependencias externas. Cada juego mantiene su avance en localStorage con una clave propia. En GitHub Pages, los repositorios del mismo usuario comparten origen, por lo que el catálogo puede leer el resumen del progreso. Si un juego se mueve a otro dominio, su avance sigue guardándose allí pero el catálogo no puede leerlo por la política del mismo origen. No se promete sincronización entre dispositivos o navegadores. El modo privado y el borrado de datos pueden eliminar el avance.

## Estructura

- index.html / styles.css / app.js: interfaz accesible y adaptable.
- games.json: única fuente de metadatos de la colección.
- assets/: portada original SVG, favicon y lectura segura del avance.
- tests/: validación de metadatos, independencia de repositorios y almacenamiento.

No contiene automatización que garantice por sí sola un lanzamiento diario; la frecuencia es el objetivo editorial del proyecto.


## Descubrir juegos y ranking

«Top 5 más jugados» y «Todos los juegos» son secciones independientes. El destacado es el lanzamiento más reciente, no el más popular. Actualmente hay tres juegos y ninguna fuente global de partidas: el Top 5 muestra «Aún sin datos suficientes» y no inventa posiciones, cifras ni dos juegos adicionales. No se cuentan visitas, clics del catálogo ni avance local como partidas globales.

La interfaz mantiene el foco en el filtro pulsado, anuncia el número de resultados con role=status, permite restablecer filtros y funciona con teclado y pantallas pequeñas. No introduce peticiones externas, cookies, cuentas ni recopilación de datos.

### Propuesta para activar un ranking real (pendiente de backend)

No hay endpoint ni infraestructura de estadísticas autorizada/configurada en este repositorio. GitHub Pages sirve archivos estáticos; no recibe ni agrega eventos. No reutilizar la aplicación privada de sugerencias ni exponer su base de datos.

Contrato mínimo para un servicio separado, sin login de jugadores:

- POST /plays: recibe solo gameId de una lista permitida y un identificador aleatorio de partida, no de persona. No enviar nombres, correos, IP en el payload, identificadores de dispositivo, huellas digitales ni datos de progreso. El servidor decide la fecha UTC.
- Contar una partida por intento de nivel/noche/huerto, al primer cambio de estado válido provocado por el jugador. Abrir el catálogo, pulsar un enlace, reanudar, pausar, recargar o realizar una acción inválida no suma. Definir la misma unidad en los tres juegos y mostrarla al usuario.
- Órbita: tras el primer movimiento válido. Faro: primer paso de simulación activa después de iniciar una nueva noche. Jardín: primera acción válida que cambia el huerto. Guardar el token de la partida junto al intento local para que continuar/recargar no duplique. Reiniciar genera un intento nuevo, que solo cuenta al comenzar a jugar.
- Idempotencia en el servidor por token aleatorio de intento; conservarlo únicamente el tiempo necesario para la deduplicación. Agregar por día y juego; evitar registro persistente de IP, user-agent o referrer y revisar también los registros del proveedor. Sin claves secretas en el navegador. Si el almacenamiento está bloqueado, suprimir el evento antes que inflar conteos tras recargas.
- GET /ranking devuelve únicamente agregados por juego, ventana de los últimos 7 días UTC, fecha de actualización y unidad de medida. Ordenar por partidas descendentes, desempatar por ID estable y mostrar hasta cinco juegos publicados con partidas, nunca rellenar con juegos ficticios. Etiquetar como «Partidas iniciadas · últimos 7 días», no jugadores únicos.
- Lista de IDs permitidos, validación estricta, límite global de frecuencia y cuerpo pequeño; CORS restringido al origen de los juegos no reemplaza protección contra abuso. El ranking anónimo puede recibir bots y no debe presentarse como antifraude ni cantidad exacta de personas.
- La captura es opcional para jugar: timeout corto, sin bloquear el juego, sin cola de reintentos infinita, sin errores visibles en pantalla de juego. En el catálogo, fallo o datos insuficientes conserva el estado honesto actual. Añadir aviso de conteo anónimo y opt-out antes de activar eventos.

La implementación del servicio, su retención, límites y coste requieren una infraestructura disponible y revisada. Esta entrega no crea credenciales, pagos, un servicio de estadísticas ni eventos de telemetría. No hay datos anteriores que migrar.
