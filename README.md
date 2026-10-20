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

Las categorías son datos, no rutas codificadas. La ficha destacada es la de mayor number. El catálogo muestra categorías todavía vacías con una explicación, no juegos ficticios.

## Privacidad y avance

No hay cuentas, servidor de datos, cookies de seguimiento, analytics ni dependencias externas. Cada juego mantiene su avance en localStorage con una clave propia. En GitHub Pages, los repositorios del mismo usuario comparten origen, por lo que el catálogo puede leer el resumen del progreso. Si un juego se mueve a otro dominio, su avance sigue guardándose allí pero el catálogo no puede leerlo por la política del mismo origen. No se promete sincronización entre dispositivos o navegadores. El modo privado y el borrado de datos pueden eliminar el avance.

## Estructura

- index.html / styles.css / app.js: interfaz accesible y adaptable.
- games.json: única fuente de metadatos de la colección.
- assets/: portada original SVG, favicon y lectura segura del avance.
- tests/: validación de metadatos, independencia de repositorios y almacenamiento.

No contiene automatización que garantice por sí sola un lanzamiento diario; la frecuencia es el objetivo editorial del proyecto.
