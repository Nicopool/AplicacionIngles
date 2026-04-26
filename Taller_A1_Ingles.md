# Taller de Actividades - Nivel A1 (Principiante)
## Proyecto: English Interactive Learning

Este documento contiene las primeras 3 actividades diseñadas específicamente para el nivel **A1**, siguiendo los requerimientos del proyecto Linguist.

---

### Actividad 1: Módulo de Reading (Lectura Activa)
**Título:** *My First Day in London*

**Texto:**
"Hello! My name is Mario. I am from Spain. Today is my first day in London. I am happy but I am a little nervous. The city is very big and beautiful. I have a map and a camera. I want to see the Big Ben and the river Thames. My hotel is near the park. London is amazing!"

**Vocabulario para Tap-to-Translate (Banco de Repaso):**
- **Nervous:** Nervioso
- **Beautiful:** Hermoso/a
- **Near:** Cerca de
- **Amazing:** Increíble

**Cuestionario de Comprensión:**
1. Where is Mario from?
   - a) London
   - b) Spain
   - c) USA
2. How does Mario feel today?
   - a) Sad
   - b) Angry
   - c) Happy and nervous
3. Where is the hotel?
   - a) Near the park
   - b) Near the river
   - c) In Spain

---

### Actividad 2: Módulo de Writing (Escritura)
**Objetivo:** Uso del verbo "To Be" (Ser/Estar) y artículos básicos.

**Instrucción:** Completa las siguientes frases escribiendo la palabra correcta en el espacio en blanco.

1. I ______ a student. (am / is)
2. She ______ from Mexico. (is / are)
3. They ______ my friends. (am / are)
4. It is ______ orange. (a / an)
5. We ______ very happy today. (is / are)

**Soluciones (Para validación del Backend):**
1. `am`
2. `is`
3. `are`
4. `an`
5. `are`

---

### Actividad 3: Módulo de Juego (El Ahorcado / Vocabulary)
**Tema:** Common Objects (Objetos Comunes)

**Palabras/Frases para el juego:**
1. **COMPUTER** (Computadora)
2. **BACKPACK** (Mochila)
3. **NOTEBOOK** (Cuaderno)
4. **UMBRELLA** (Paraguas)
5. **KEYBOARD** (Teclado)

**Contexto de ayuda (Hint):**
- *COMPUTER:* You use this to work or play games.
- *BACKPACK:* Students use this to carry books.
- *UMBRELLA:* You use this when it rains.

---

### Notas de Implementación (Backend/DB):
- Los textos de la Actividad 1 deben guardarse en la tabla `texts` con `level_id = 'A1'`.
- El vocabulario traducido por el usuario debe disparar un trigger para insertarse en `vocabulary_bank`.
- Los ejercicios de Writing deben validarse contra el campo `correct_answer` en la tabla `exercises`.

---
*Generado por Antigravity - Experto en Desarrollo Móvil y Python*
