PROMPT APP MÓVIL DE INGLÉS (VERSIÓN MEJORADA - FRONTEND AGNOSTICO)

El Concepto: App interactiva y dinámica para aprender inglés, que evalúa, adapta y gamifica el contenido con ejercicios prácticos de las cuatro habilidades principales (Reading, Writing, Listening, Speaking) y minijuegos.
La Innovación: Sistema de "Reading" inmersivo con Tap-to-Translate y audio en tiempo real que guarda el vocabulario automáticamente para un repaso posterior. Incluye modo offline básico, reconocimiento de voz para pronunciación y un juego de ahorcado clásico.

Proyecto: App Móvil - English Interactive Learning
Rol del agente: Desarrollador de aplicaciones móviles y backend experto con 12 años de experiencia (Especialista en Python).
Objetivo: Crear una aplicación móvil exclusiva para el cliente/usuario dedicada a la práctica y aprendizaje del inglés. El sistema evaluará el nivel inicial, ajustará el contenido y ofrecerá actividades interactivas y gamificadas para mantener la retención del usuario.
API Externa: API de Text-to-Speech (TTS) y Diccionario (para traducciones y audio en tiempo real), y API de Speech-to-Text (para validar la pronunciación del usuario).

Funcionalidades de la aplicación:

Módulo de Acceso y Configuración:

Login / Registro: Acceso único para el rol de usuario/cliente.

Prueba de Nivel (Placement Test) o Selección Manual: Al registrarse, el usuario tiene la opción de hacer un test rápido de 10 preguntas. Según su puntaje, la app le asigna su nivel real (A1, A2, B1, B2, C1), o bien, puede seleccionarlo manualmente. El sistema filtrará las actividades según este nivel.

Sistema de Retención y Gamificación:

Rachas (Streaks) y Experiencia (XP): Medidor de días consecutivos de estudio y puntos de experiencia ganados al completar lecciones para fomentar el uso diario.

Progreso Visual: Barra de avance visible en el perfil para que el usuario sepa cuánto le falta para pasar al siguiente nivel.

Módulos de Estudio (Funcionalidades principales logueadas):

Módulo de Reading (Lectura Activa): * Textos en inglés adaptados al nivel del usuario.

Funcionalidad Tap-to-Translate: Al tocar una palabra, aparece su traducción al español y se reproduce automáticamente el audio con la pronunciación.

Captura automática de vocabulario: Toda palabra traducida se guarda de forma automática en el "Banco de Repaso" del usuario.

Cuestionario de comprensión al finalizar la lectura.

Módulo de Writing (Escritura):

Ejercicios de completar frases. El usuario debe escribir la palabra o conjunto de palabras correctas en los espacios en blanco según la gramática de su nivel.

Módulo de Listening (Escucha):

Reproductor de audio integrado para reproducir clips en inglés, acompañado de un ejercicio de escuchar y rellenar espacios en un texto incompleto.

Módulo de Speaking (Pronunciación):

La app muestra una frase en pantalla, el usuario usa el micrófono para grabarse leyéndola y el sistema evalúa si la pronunciación fue correcta, marcando en rojo las palabras que debe mejorar.

Banco de Repaso (Flashcards):

Una sección donde el usuario puede repasar todas las palabras que ha ido traduciendo en el módulo de Reading o que ha fallado en otras actividades, presentadas como tarjetas de memoria.

Módulo de Juego (El Ahorcado):

Minijuego clásico para completar frases o palabras en inglés vinculadas al vocabulario del nivel.

Representación visual (UI) del muñeco del ahorcado que se va dibujando con cada error.

Modo Offline Básico:

Descarga en segundo plano: Los textos de Reading del nivel actual, el banco de repaso de vocabulario y las palabras del Ahorcado se deben guardar en la base de datos local del celular (ej. SQLite) para que el usuario pueda practicar sin internet.

Backend y Base de Datos:

Infraestructura: Python como lenguaje principal para la lógica del servidor/API, usando una librería/framework (ej. FastAPI) para que la app "tenga vida propia" y gestione la base de datos central.

Base de datos: Se guardarán usuarios, progreso (XP y Rachas), niveles, textos, audios, preguntas, el banco de palabras personal de cada usuario (flashcards) y el diccionario del ahorcado.

Rellenar la base de datos (seeding):

Nombre de la base de datos: EnglishAppDB.

Uso de MCP: @mcp:supabase-mcp-server para crear y poblar las tablas.

Datos de prueba:

5 usuarios de prueba (con datos de XP y rachas simuladas).

20 textos de Reading (4 por nivel) con sus preguntas.

50 ejercicios de Writing, Listening y Speaking.

100 frases/palabras para el juego del Ahorcado.

Stack de tecnología:

Frontend/Móvil: Framework o tecnología adecuada para desarrollo de aplicaciones móviles nativas o multiplataforma.

Almacenamiento Local: SQLite o equivalente móvil para el Modo Offline.

Backend: Python (Lógica core, evaluación de nivel, validación de respuestas).

Base de Datos: PostgreSQL / Supabase.

Preferencias de diseño y estilos:

Estética: Diseño moderno, intuitivo (Mobile-first). Botones grandes y elementos visuales atractivos para la gamificación (ej. icono de fuego para las rachas).

Interfaz del Ahorcado: Diseño gráfico limpio para el muñeco del ahorcado (SVG o elementos nativos dibujados por pasos).

Idioma de la interfaz: Toda la navegación e instrucciones deben estar en español, el contenido de estudio estrictamente en inglés.

Responsividad: Totalmente optimizada para pantallas de smartphones (iOS y Android).

Preferencias de código:

No saltarse NINGÚN paso en el código, el diseño, ni la configuración de la base de datos hasta llegar a agents.md.

Modularidad: Separar claramente la lógica de Reading, Writing, Listening, Speaking, Repaso y el Minijuego.

Calidad: Priorizar código sencillo, legible y mantenible con comentarios explicando la lógica en Python.

Manejo de permisos: Implementar correctamente la solicitud de permisos para el uso del micrófono (Speaking).

Sincronización: Lógica para sincronizar el progreso offline con la base de datos principal cuando regrese la conexión.

Estructura de archivos:

Carpeta /design (contiene los diseños de referencia).

Estructura de archivos adecuada para un proyecto móvil (screens/, components/, services/, models/, local_db/).

sigue lo que esta en la carpeta PANTALLAS/ las imagenes que estan adentro son como deberia quedar la app

AGENTS.md (especificaciones del proyecto, arquitectura y directrices de uso de la base de datos central y local).