# Contexto de trabajo — MARÃO y pensamiento de ingeniería

## 1. Contexto general

Estoy trabajando en un proyecto real de software llamado **MARÃO**, una tienda virtual de lentes de contacto cosméticos, pestañas pelo a pelo y accesorios.

Mi objetivo no es solamente desarrollar el software. Quiero utilizar este proyecto como un **laboratorio para desarrollar una mentalidad de programador, desarrollador de software e ingeniero de sistemas**, aplicando procesos, metodologías y formas de pensamiento que también puedan transferirse a problemas de mi vida cotidiana, incluso cuando esos problemas no tengan relación con software.

Quiero aprender a pensar de forma:

- computacional;
- científica;
- sistémica;
- estructurada;
- basada en evidencia;
- orientada a problemas;
- iterativa;
- experimental;
- de mejora continua.

La idea es que el desarrollo de MARÃO sea una oportunidad para practicar esa forma de pensar.

---

# 2. Idea central: aprender ingeniería a través de problemas reales

No quiero que simplemente me digan:

> "Haz un CRUD."

Quiero aprender primero a comprender:

> ¿Cuál es el problema?
> ¿Cómo funciona actualmente el sistema?
> ¿Qué está pasando?
> ¿Por qué está pasando?
> ¿Qué alternativas existen?
> ¿Qué solución tiene más sentido?
> ¿Cómo puedo demostrar que funciona?
> ¿Qué aprendí del proceso?

La ruta de trabajo que estamos utilizando es:

```text
PROBLEMA REAL
    ↓
1. OBSERVAR
    ↓
2. FORMULAR HIPÓTESIS
    ↓
3. INVESTIGAR
    ↓
4. DESCOMPONER
    ↓
5. DISEÑAR
    ↓
6. IMPLEMENTAR
    ↓
7. PROBAR
    ↓
8. OBSERVAR RESULTADOS
    ↓
9. VERIFICAR
    ↓
10. DOCUMENTAR
    ↓
11. MEJORAR
```

No necesariamente debe aplicarse de forma rígida a todos los problemas. La idea es aprender a reconocer qué herramienta mental sirve para cada situación.

---

# 3. Pensamiento transferible fuera del software

Una parte importante de este proceso es identificar qué habilidades de ingeniería puedo trasladar a mi vida cotidiana.

Ejemplos:

| Software / ingeniería | Aplicación general |
|---|---|
| Requisitos | Definir qué necesito realmente |
| Observación | Comprender cómo funciona actualmente una situación |
| Descomposición | Dividir problemas grandes en partes manejables |
| Hipótesis | "Creo que X está provocando Y" |
| Experimentación | Probar una intervención pequeña |
| Testing | Comprobar si algo realmente funciona |
| Debugging | Encontrar dónde se produjo una desviación |
| Análisis de causa raíz | Buscar la causa en lugar de atacar solamente el síntoma |
| Pensamiento sistémico | Analizar relaciones y efectos secundarios |
| Métricas | Medir resultados |
| Iteración | Mejorar progresivamente |
| Refactoring | Mejorar la estructura sin cambiar el propósito |
| Regresión | Comprobar que una mejora no haya dañado otra cosa |
| Code review | Revisar decisiones y detectar problemas antes de avanzar |
| Git | Registrar evolución y decisiones |
| Gestión de riesgos | Anticipar qué podría salir mal |

Ejemplo cotidiano:

En lugar de decir:

> "Soy impuntual."

puedo observar el proceso:

```text
Despertar
↓
Prepararme
↓
Buscar cosas
↓
Desayunar
↓
Salir
↓
Transporte
↓
Llegar
```

Y descubrir que el cuello de botella está, por ejemplo, en buscar cosas antes de salir.

La idea es cambiar el sistema en lugar de reducir todo a una característica personal.

---

# 4. Debugging como forma de pensamiento

También estamos trabajando el debugging como una habilidad transferible.

El procedimiento es:

```text
ERROR
  ↓
1. REPRODUCIR
  ↓
2. OBSERVAR
  ↓
3. FORMULAR HIPÓTESIS
  ↓
4. INVESTIGAR
  ↓
5. PROBAR UNA SOLUCIÓN
  ↓
6. VERIFICAR
  ↓
7. DOCUMENTAR
```

## 4.1 Reproducir

Pregunta:

> ¿Puedo hacer que el problema ocurra nuevamente?

En lugar de:

> "A veces falla."

buscar:

> "Falla cuando ocurre X después de hacer A, B y C."

---

## 4.2 Observar

No modificar inmediatamente.

Observar:

- logs;
- consola;
- mensajes;
- entradas;
- salidas;
- stack traces;
- Network;
- estados;
- base de datos;
- comportamiento del usuario.

Un error es evidencia, no necesariamente la causa.

Analogía:

> La fiebre es información, pero no necesariamente es la enfermedad.

---

## 4.3 Formular hipótesis

En lugar de:

> "No funciona."

formular:

> "Creo que X está provocando Y."

La hipótesis es provisional.

---

## 4.4 Investigar

Buscar evidencia para confirmar o descartar la hipótesis.

Fuentes posibles:

- código;
- documentación oficial;
- logs;
- Git;
- documentación de librerías;
- GitHub;
- Stack Overflow;
- IA;
- experimentos.

No investigar solamente:

> "¿Cómo arreglo este error?"

sino:

> "¿Qué necesito descubrir para confirmar o descartar mi hipótesis?"

---

## 4.5 Probar una solución

Hacer un cambio concreto.

Siempre que sea posible:

> cambiar una cosa a la vez.

Así puedo entender qué produjo el resultado.

---

## 4.6 Verificar

No basta con:

> "Ya no aparece el error."

Hay que comprobar:

1. que el problema original esté solucionado;
2. que el comportamiento esperado se cumpla;
3. que no se hayan roto funcionalidades anteriores.

---

## 4.7 Documentar

Registrar:

```text
Problema:
Causa:
Solución:
Prueba realizada:
Resultado:
Aprendizaje:
```

Esto permite entender posteriormente cómo evolucionó el sistema y también cómo evolucionó mi propio pensamiento.

---

# 5. Pruebas de regresión

También hemos profundizado en regresión.

Una regresión ocurre cuando:

> Una funcionalidad que anteriormente funcionaba deja de funcionar después de realizar un cambio.

La pregunta mental es:

> "¿Qué pude haber roto al arreglar esto?"

No solamente:

> "¿Arreglé el problema?"

Ejemplo:

```text
Versión 1

Login       ✅
Productos   ✅
Pedidos     ✅
Reportes    ✅
```

Después de implementar una nueva funcionalidad:

```text
Login       ❌
Productos   ✅
Pedidos     ✅
Reportes    ✅
Nueva       ✅
```

La nueva funcionalidad puede funcionar y aun así haber introducido una regresión.

Las pruebas de regresión pueden ser:

- unitarias;
- de integración;
- de sistema;
- E2E;
- manuales;
- automatizadas.

"Regresión" describe principalmente el propósito:

> comprobar que lo que funcionaba anteriormente siga funcionando después de un cambio.

---

# 6. Pruebas no funcionales

También hemos hablado de que probar software no significa solamente comprobar funcionalidades.

Un sistema puede funcionar y aun así ser una mala solución.

Aspectos no funcionales que hemos identificado:

- rendimiento;
- carga;
- estrés;
- seguridad;
- usabilidad;
- disponibilidad;
- compatibilidad;
- escalabilidad;
- mantenibilidad;
- resiliencia.

La pregunta cambia de:

> "¿Hace lo que debe hacer?"

a:

> "¿Lo hace con la calidad necesaria para su contexto?"

Ejemplo:

```text
FUNCIONAL:
¿El menú aparece?

NO FUNCIONAL:
¿El menú aparece suficientemente rápido?
¿Es usable?
¿Es accesible?
¿Funciona en los dispositivos previstos?
¿Está disponible cuando se necesita?
```

No todos los sistemas necesitan el mismo nivel de cada atributo.

La ingeniería debe considerar el contexto.

---

# 7. Sistema real: MARÃO

MARÃO es una tienda virtual de lentes de contacto cosméticos, pestañas pelo a pelo y accesorios.

Según su documentación actual:

- Frontend: HTML5, CSS3 y JavaScript vanilla.
- Usa ES Modules.
- No tiene framework.
- No tiene backend.
- No tiene proceso de build.
- El checkout actualmente envía pedidos por WhatsApp.
- El catálogo de lentes está renderizado desde JavaScript.
- Tiene carrito, checkout, login con Google, filtros, paginación y modal de detalles.

Arquitectura aproximada:

```text
index.html
    ↓
main.js
    ↓
┌──────────────────────────────────────┐
│ catalog.js                            │
│ cart.js                               │
│ checkout.js                           │
│ auth.js                               │
│ ui.js                                 │
│ etc.                                  │
└──────────────────────────────────────┘
    ↓
Datos de productos
    ↓
lentes.js
productos.js
cosplay.js
```

El README describe 85 referencias cosméticas en `lentes.js`, 19 referencias cosplay y otros productos. El proyecto también tiene una deuda técnica conocida relacionada con el catálogo hardcodeado, ausencia de backend, falta de testing automatizado, inventario, persistencia del carrito, etc.

---

# 8. Problema real que estamos trabajando

El cliente quiere tener **mayor control sobre su negocio y no depender de los desarrolladores para gestionar sus productos**.

Es importante distinguir:

## Necesidad del cliente

> Tener mayor autonomía y control sobre su catálogo/productos y reducir la dependencia del desarrollador.

## Problema actual

Actualmente, para realizar modificaciones en el catálogo, los cambios deben hacerse directamente en el código.

Los clientes no saben programar, por lo que necesitan recurrir al desarrollador incluso para cambios relativamente simples como:

- modificar un precio;
- cambiar información de un producto;
- modificar características;
- eventualmente agregar o retirar productos.

El flujo actual es aproximadamente:

```text
Cliente detecta que necesita cambiar un producto
                ↓
Busca una forma de hacerlo
                ↓
No existe sección/interfaz para gestión del catálogo
                ↓
Contacta al desarrollador
                ↓
Desarrollador abre el proyecto en VS Code
                ↓
Busca el producto en archivos JavaScript
                ↓
Modifica constantes/variables/datos
                ↓
Guarda cambios
                ↓
Actualmente se verifica/publica en desarrollo
```

El problema principal no es simplemente:

> "No existe un CRUD."

El problema es:

> **La gestión de información del negocio está acoplada al código y requiere conocimientos técnicos para realizar cambios, generando dependencia del desarrollador.**

---

# 9. Observación importante descubierta durante el análisis

Mientras reconstruía el proceso, también identifiqué otro problema:

> El código no parece tener una mantenibilidad óptima.

Esto no debe aceptarse automáticamente como una verdad.

Estamos tratando esta afirmación como una **evaluación que debe ser respaldada por evidencia**.

Por eso estamos investigando:

> ¿Qué características concretas del código hacen que modificar un producto sea difícil o poco mantenible?

Queremos separar:

### Hechos observables

```text
- El cliente no tiene una interfaz para modificar productos.
- El cliente necesita contactar al desarrollador.
- El desarrollador abre VS Code.
- El producto está definido en archivos JavaScript.
- El desarrollador modifica datos directamente en código.
- El proyecto actualmente está en desarrollo.
```

de:

### Evaluaciones / hipótesis

```text
- El código tiene baja mantenibilidad.
- Existe demasiado acoplamiento.
- La arquitectura actual dificulta la gestión del catálogo.
- Los cambios tienen riesgo elevado.
```

Estas evaluaciones deben investigarse y demostrarse.

---

# 10. Punto exacto en el que quedamos

Estamos todavía en la fase:

# OBSERVAR

No queremos saltar todavía a:

> "Construyamos un panel administrativo."

Primero queremos entender el sistema actual.

La siguiente tarea concreta es hacer una **auditoría exploratoria del recorrido de un producto**.

Elegir un producto real de MARÃO y seguir su trayectoria:

```text
¿Dónde nace el producto?
        ↓
¿Dónde se almacena?
        ↓
¿Quién lo consume?
        ↓
¿Dónde se transforma?
        ↓
¿Dónde se muestra?
        ↓
¿Dónde se agrega al carrito?
        ↓
¿Dónde llega al checkout?
```

La intención es descubrir cómo viaja una entidad por el sistema.

Esto permite practicar una habilidad de ingeniería:

> **Seguir el rastro de una entidad a través de un sistema antes de decidir cómo modificarlo.**

---

# 11. Regla metodológica para continuar

No adelantarse a soluciones.

Si aparece algo como:

> "Podríamos usar MongoDB."

o:

> "Necesitamos un backend."

o:

> "Hagamos un CRUD."

primero preguntar:

> ¿Qué evidencia del problema nos lleva a esa solución?

La solución debe surgir del análisis, no al revés.

---

# 12. Cómo quiero trabajar con la IA

Quiero que la IA actúe como un **mentor de pensamiento de ingeniería**, no simplemente como generador de código.

Cuando trabajemos en MARÃO:

1. Guiarme paso a paso.
2. No resolver inmediatamente los problemas por mí.
3. Hacer preguntas que me obliguen a observar.
4. Ayudarme a separar hechos de hipótesis.
5. Señalar cuándo estoy razonando como ingeniero.
6. Explicarme qué principio o metodología estoy aplicando.
7. Relacionar la experiencia con pensamiento científico, computacional y sistémico.
8. Mostrarme cómo la habilidad podría transferirse fuera del software.
9. Evitar sobreingeniería.
10. Priorizar evidencia sobre suposiciones.
11. Cuando sea necesario, ayudarme a investigar el código real.
12. No saltar directamente a una implementación sin comprender primero el problema.

Una buena interacción sería:

> Yo observo algo → la IA me ayuda a formular preguntas → yo investigo → analizamos evidencia → formulamos hipótesis → diseñamos experimentos → tomamos decisiones.

No quiero simplemente:

> Yo pregunto → IA escribe código → yo copio.

---

# 13. Filosofía general

El objetivo final no es solamente mejorar MARÃO.

Es desarrollar la capacidad de pensar:

> **"Tengo un problema. Antes de actuar, voy a entenderlo."**

Después:

> **"Tengo una hipótesis. ¿Cómo puedo comprobarla?"**

Después:

> **"Tengo una solución. ¿Cómo sé que realmente funcionó?"**

Y finalmente:

> **"¿Qué aprendí del proceso y cómo puedo mejorar el sistema?"**

La idea es que esta forma de pensar se convierta progresivamente en una forma natural de enfrentar problemas de software, ingeniería, estudio, proyectos, decisiones y vida cotidiana.

# Estado actual

Estamos en:

```text
PROBLEMA REAL
    ↓
OBSERVACIÓN  ← AQUÍ
    ↓
HIPÓTESIS
    ↓
INVESTIGACIÓN
    ↓
DESCOMPOSICIÓN
    ↓
DISEÑO
    ↓
IMPLEMENTACIÓN
    ↓
PRUEBAS
    ↓
VERIFICACIÓN
    ↓
DOCUMENTACIÓN
    ↓
MEJORA
```

### Próximo paso

**Seguir el rastro de un producto real dentro del código de MARÃO y documentar qué descubrimos, sin modificar todavía el sistema ni decidir todavía la solución.**