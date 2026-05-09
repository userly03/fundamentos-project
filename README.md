# Laberinto del Robot - Pensamiento Computacional

## Descripción del Proyecto
Juego educativo para enseñar **Pensamiento Computacional** mediante la programación de un robot que debe llegar a la meta usando una secuencia de comandos (algoritmo).

## Objetivos del Juego
- El jugador aprende a **descomponer** un problema en pasos pequeños
- Practica la **secuenciación lógica** de instrucciones
- Comprende el concepto de **algoritmo** (lista de comandos)
- Desarrolla habilidades de **depuración** (probar y corregir)

## Cómo Jugar
1. El robot comienza en (0,0) mirando hacia la DERECHA
2. La meta está en (4,4) - esquina inferior derecha
3. Hay paredes que no se pueden atravesar
4. **Programa** una secuencia de hasta 6 comandos:
   - **AVANZAR** → mueve el robot 1 casilla
   - **GIRAR** → cambia dirección 90° a la derecha
   - **SALTAR** → mueve el robot 2 casillas
5. Presiona **EJECUTAR** para que el robot obedezca
6. Si llegas a la meta → GANAS
7. Si chocas con una pared → PIERDES

## Pseudocódigo del Algoritmo

ALGORITMO juegoLaberinto

tablero[5][5]
muros ← {(1,1), (1,2), (2,2), (3,2), (3,1)}
robot ← (0,0, dirección="DERECHA")
meta ← (4,4)
comandos ← []

REPETIR
    SEGUN boton_presionado
        "AVANZAR": agregar("AVANZAR", comandos)
        "GIRAR": agregar("GIRAR", comandos)
        "SALTAR": agregar("SALTAR", comandos)
        "EJECUTAR":
            PARA cada cmd EN comandos
                SI cmd = "AVANZAR": mover(robot, 1)
                SI cmd = "GIRAR": girar(robot)
                SI cmd = "SALTAR": mover(robot, 2)
                SI choca: error() y TERMINAR
                SI llega a meta: victoria() y TERMINAR
            FIN PARA
            mensaje("No llegaste a la meta")
            comandos ← []
    FIN SEGUN
HASTA QUE juego_terminado


## Tecnologías Usadas
| Tecnología | Justificación |
|:---|:---|
| **HTML5** | Estructura de la interfaz |
| **CSS3** | Estilos visuales y diseño responsivo |
| **JavaScript** | Lógica del juego. Se eligió porque: corre en cualquier navegador sin instalación, es ideal para principiantes, y permite manipular el DOM fácilmente |

## Estructura del Proyecto
/
├── index.html          # Estructura principal
├── style.css           # Estilos visuales
├── script.js           # Lógica del juego
├── pseudocodigo.txt    # Algoritmo en pseudocódigo
└── README.md           # Este archivo

## Instalación y Ejecución
```bash
# Clonar o descargar los archivos
# Luego simplemente abrir index.html en el navegador

# O usar un servidor local (opcional)
python3 -m http.server 8000
# Luego ir a http://localhost:8000