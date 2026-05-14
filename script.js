// ========== CLASE ROBOT ==========
class Robot {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir; // UP, RIGHT, DOWN, LEFT
    }
    
    avanzar() {
        const v = { 'UP':[-1,0], 'RIGHT':[0,1], 'DOWN':[1,0], 'LEFT':[0,-1] };
        const d = v[this.dir];
        return { x: this.x + d[0], y: this.y + d[1] };
    }
    
    saltar() {
        const v = { 'UP':[-1,0], 'RIGHT':[0,1], 'DOWN':[1,0], 'LEFT':[0,-1] };
        const d = v[this.dir];
        return { x: this.x + d[0]*2, y: this.y + d[1]*2 };
    }
    
    girar() {
        const orden = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        let idx = orden.indexOf(this.dir);
        this.dir = orden[(idx + 1) % 4];
    }
    
    moverA(x, y) {
        this.x = x;
        this.y = y;
    }
}

// ========== CLASE TABLERO ==========
class Tablero {
    constructor() {
        this.size = 5;
        this.walls = [[1,1], [1,2], [2,2], [3,2], [3,1]];
        this.goal = { x: 4, y: 4 };
    }
    
    hayMuro(x, y) {
        return this.walls.some(w => w[0] === x && w[1] === y);
    }
    
    esMeta(x, y) {
        return this.goal.x === x && this.goal.y === y;
    }
    
    esValido(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size && !this.hayMuro(x, y);
    }
}

// ========== CLASE JUEGO (controla todo) ==========
class JuegoLaberinto {
    constructor() {
        this.tablero = new Tablero();
        this.robot = new Robot(0, 0, 'RIGHT');
        this.comandos = [];
        this.activo = true;
        this.gano = false;
    }
    
    agregarComando(cmd) {
        if (!this.activo || this.gano) return false;
        if (this.comandos.length >= 6) return false;
        this.comandos.push(cmd);
        return true;
    }
    
    ejecutarPrograma() {
        if (!this.activo) return { error: "Juego terminado" };
        if (this.gano) return { error: "Ya ganaste" };
        if (this.comandos.length === 0) return { error: "Sin comandos" };
        
        for (let cmd of this.comandos) {
            let resultado = this._ejecutarUnComando(cmd);
            if (!resultado.exito) {
                this.comandos = [];
                return { error: resultado.error };
            }
            if (this.tablero.esMeta(this.robot.x, this.robot.y)) {
                this.gano = true;
                this.activo = false;
                this.comandos = [];
                return { victoria: true };
            }
        }
        
        let llego = this.tablero.esMeta(this.robot.x, this.robot.y);
        this.comandos = [];
        return { llego: llego };
    }
    
    _ejecutarUnComando(cmd) {
        let nuevaPos;
        switch(cmd) {
            case 'AVANZAR':
                nuevaPos = this.robot.avanzar();
                if (!this.tablero.esValido(nuevaPos.x, nuevaPos.y)) {
                    this.activo = false;
                    return { exito: false, error: "CHOQUE" };
                }
                this.robot.moverA(nuevaPos.x, nuevaPos.y);
                break;
            case 'GIRAR':
                this.robot.girar();
                break;
            case 'SALTAR':
                nuevaPos = this.robot.saltar();
                if (!this.tablero.esValido(nuevaPos.x, nuevaPos.y)) {
                    this.activo = false;
                    return { exito: false, error: "SALTO FALLIDO" };
                }
                this.robot.moverA(nuevaPos.x, nuevaPos.y);
                break;
        }
        return { exito: true };
    }
    
    reiniciar() {
        this.robot = new Robot(0, 0, 'RIGHT');
        this.comandos = [];
        this.activo = true;
        this.gano = false;
    }
}

// ========== CONECTAR CON HTML ==========
const juego = new JuegoLaberinto();

function renderGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const celda = document.createElement('div');
            celda.classList.add('cell');
            if (juego.tablero.hayMuro(i, j)) {
                celda.classList.add('wall');
                celda.textContent = '🧱';
            } else if (juego.robot.x === i && juego.robot.y === j) {
                celda.classList.add('robot');
                const flecha = { 'UP':'⬆️', 'RIGHT':'➡️', 'DOWN':'⬇️', 'LEFT':'⬅️' };
                celda.textContent = flecha[juego.robot.dir];
            } else if (juego.tablero.esMeta(i, j)) {
                celda.classList.add('goal');
                celda.textContent = '🏆';
            } else {
                celda.textContent = '·';
            }
            grid.appendChild(celda);
        }
    }
}

function actualizarComandos() {
    const timeline = document.getElementById('commandTimeline');
    const indicador = document.getElementById('limitIndicator');
    indicador.innerText = `${juego.comandos.length} / 6`;
    if (juego.comandos.length === 0) {
        timeline.innerHTML = '<div class="empty-commands">✦ Añade comandos con los botones ✦</div>';
        return;
    }
    timeline.innerHTML = '';
    juego.comandos.forEach(cmd => {
        const badge = document.createElement('span');
        badge.className = 'command-badge';
        const icono = cmd === 'AVANZAR' ? '⬆️ ' : cmd === 'GIRAR' ? '🔄 ' : '⭐ ';
        badge.textContent = icono + cmd;
        timeline.appendChild(badge);
    });
}

function feedback(msg, error = false) {
    const fb = document.getElementById('feedback');
    fb.innerHTML = msg;
    fb.style.borderLeftColor = error ? '#ff8a7a' : '#f5b642';
}

function addCommand(cmd) {
    if (!juego.agregarComando(cmd)) {
        feedback('No se puede agregar: juego terminado', true);
        return;
    }
    actualizarComandos();
    renderGrid();
    feedback(`➕ ${cmd} agregado`);
}

function ejecutar() {
    const resultado = juego.ejecutarPrograma();
    if (resultado.error) {
        feedback(`❌ ${resultado.error}`, true);
    } else if (resultado.victoria) {
        feedback('🏆 ¡VICTORIA! 🏆');
    } else if (!resultado.llego) {
        feedback('No llegaste a la meta. Sigue intentando.');
    }
    actualizarComandos();
    renderGrid();
}

function reiniciar() {
    juego.reiniciar();
    actualizarComandos();
    renderGrid();
    feedback('Juego reiniciado. ¡Programa tu secuencia!');
}

// Eventos
document.getElementById('btnForward').onclick = () => addCommand('AVANZAR');
document.getElementById('btnTurn').onclick = () => addCommand('GIRAR');
document.getElementById('btnJump').onclick = () => addCommand('SALTAR');
document.getElementById('btnRun').onclick = ejecutar;
document.getElementById('btnReset').onclick = reiniciar;

// Iniciar
reiniciar();
