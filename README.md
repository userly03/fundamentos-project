# Laberinto del Robot - Pensamiento Computacional

## Descripción del Proyecto

Laberinto del Robot es un juego educativo desarrollado para enseñar conceptos básicos de Pensamiento Computacional mediante la programación de un robot virtual.

El jugador debe construir una secuencia lógica de instrucciones para guiar al robot hasta la meta evitando obstáculos y paredes dentro del tablero.

Este proyecto busca reforzar habilidades de resolución de problemas y comprensión de algoritmos de manera visual e interactiva.

---

# Objetivos del Juego

El juego permite al estudiante:

- Comprender el concepto de algoritmo
- Descomponer problemas en pasos pequeños
- Practicar la secuenciación lógica
- Desarrollar habilidades de depuración
- Analizar errores y corregir instrucciones

---

# Cómo Jugar

## Reglas del Juego

1. El robot inicia en la posición (0,0) mirando hacia la DERECHA
2. La meta se encuentra en (4,4)
3. Existen paredes que el robot no puede atravesar
4. El jugador puede programar hasta 6 comandos
5. Luego debe presionar EJECUTAR

---

## Comandos Disponibles

| Comando | Acción |
|---|---|
| AVANZAR | Mueve el robot 1 casilla |
| GIRAR | Gira 90° hacia la derecha |
| SALTAR | Avanza 2 casillas |

---

## Condiciones del Juego

- Si el robot llega a la meta → GANAS
- Si el robot choca con una pared → PIERDES

---

# Algoritmo del Juego (Pseudocódigo)

```text
ALGORITMO juegoLaberinto

    DEFINIR tablero[5][5]
    DEFINIR muros ← {(1,1), (1,2), (2,2), (3,2), (3,1)}

    DEFINIR robot ← (0,0, direccion="DERECHA")
    DEFINIR meta ← (4,4)

    DEFINIR comandos ← []

    REPETIR

        SEGUN boton_presionado HACER

            CASO "AVANZAR":
                agregar("AVANZAR", comandos)

            CASO "GIRAR":
                agregar("GIRAR", comandos)

            CASO "SALTAR":
                agregar("SALTAR", comandos)

            CASO "EJECUTAR":

                PARA cada cmd EN comandos HACER

                    SI cmd = "AVANZAR" ENTONCES
                        mover(robot, 1)
                    FIN SI

                    SI cmd = "GIRAR" ENTONCES
                        girar(robot)
                    FIN SI

                    SI cmd = "SALTAR" ENTONCES
                        mover(robot, 2)
                    FIN SI

                    SI robot choca CON muro ENTONCES
                        mostrar("ERROR: Colisión detectada")
                        TERMINAR
                    FIN SI

                    SI robot llega A meta ENTONCES
                        mostrar("¡Victoria!")
                        TERMINAR
                    FIN SI

                FIN PARA

                mostrar("No llegaste a la meta")
                comandos ← []

        FIN SEGUN

    HASTA QUE juego_terminado
```

# Explicación de la Estructura del Algoritmo

El algoritmo del juego se divide en las siguientes etapas:

| Etapa | Función |
|---|---|
| Inicialización | Configura tablero, robot y meta |
| Entrada | El jugador agrega comandos |
| Procesamiento | El sistema ejecuta instrucciones |
| Validación | Se verifica colisión o victoria |
| Finalización | Se muestra el resultado |

---

# Tecnologías Utilizadas

| Tecnología | Uso en el Proyecto |
|---|---|
| HTML5 | Estructura de la interfaz |
| CSS3 | Diseño visual y estilos |
| JavaScript | Lógica y comportamiento del juego |

---

# Estructura del Proyecto

```text
/
├── index.html
├── style.css
├── script.js
├── pseudocodigo.txt
└── README.md
```

Descripción de archivos:

- index.html → Estructura principal del juego
- style.css → Diseño visual y estilos
- script.js → Lógica y comportamiento del juego
- pseudocodigo.txt → Algoritmo en pseudocódigo
- README.md → Documentación del proyecto

---

# Instalación y Ejecución

## Opción 1: Ejecutar directamente

Abrir el archivo:

```text
index.html
```

en cualquier navegador moderno.

---

# Conceptos de Pensamiento Computacional Aplicados

- Descomposición
- Reconocimiento de patrones
- Secuenciación
- Algoritmos
- Depuración
- Resolución de problemas

---

# Arquitectura del Proyecto

```text
Usuario
   ↓
Interfaz HTML/CSS
   ↓
JavaScript
   ↓
Procesamiento de comandos
   ↓
Actualización visual del tablero
```

---

# Autor

Proyecto desarrollado con fines educativos para el curso de Fundamentos de Programacion.