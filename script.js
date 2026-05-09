// ==================== CONFIGURACIÓN DEL MUNDO ====================
const SIZE = 5;
const walls = [[1,1], [1,2], [2,2], [3,2], [3,1]];
const goal = { x: 4, y: 4 };

let robot = { x: 0, y: 0, dir: 'RIGHT' };
let commandQueue = [];
let gameActive = true;
let victory = false;

const dirVectors = {
    'UP':    { dx: -1, dy: 0 },
    'RIGHT': { dx: 0, dy: 1 },
    'DOWN':  { dx: 1, dy: 0 },
    'LEFT':  { dx: 0, dy: -1 }
};
const orderTurn = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

// ==================== FUNCIONES AUXILIARES ====================
function isWall(x, y) {
    return walls.some(w => w[0] === x && w[1] === y);
}

function updateFeedback(msg, isError = false) {
    const fb = document.getElementById('feedback');
    fb.innerHTML = msg;
    fb.style.borderLeftColor = isError ? '#ff8a7a' : '#f5b642';
    if (isError) {
        setTimeout(() => {
            if (document.getElementById('feedback').innerHTML === msg)
                fb.style.borderLeftColor = '#f5b642';
        }, 2000);
    }
}

function renderGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (isWall(i, j)) {
                cell.classList.add('wall');
                cell.textContent = '🧱';
            } else if (robot.x === i && robot.y === j) {
                cell.classList.add('robot');
                const arrow = { 'UP': '⬆️', 'RIGHT': '➡️', 'DOWN': '⬇️', 'LEFT': '⬅️' }[robot.dir];
                cell.textContent = arrow;
            } else if (goal.x === i && goal.y === j) {
                cell.classList.add('goal');
                cell.textContent = '🏆';
            } else {
                cell.textContent = '·';
            }
            gridContainer.appendChild(cell);
        }
    }
}

function updateCommandDisplay() {
    const timeline = document.getElementById('commandTimeline');
    const limitSpan = document.getElementById('limitIndicator');
    limitSpan.innerText = `${commandQueue.length} / 6`;
    
    if (commandQueue.length === 0) {
        timeline.innerHTML = '<div class="empty-commands">✦ Añade comandos con los botones ✦</div>';
        return;
    }
    timeline.innerHTML = '';
    commandQueue.forEach((cmd, idx) => {
        const badge = document.createElement('span');
        badge.className = 'command-badge';
        let icon = '';
        if (cmd === 'AVANZAR') icon = ' ';
        if (cmd === 'GIRAR') icon = '🔄 ';
        if (cmd === 'SALTAR') icon = '⭐ ';
        badge.textContent = `${icon}${cmd}`;
        timeline.appendChild(badge);
    });
}

function checkWin() {
    if (robot.x === goal.x && robot.y === goal.y && gameActive && !victory) {
        victory = true;
        gameActive = false;
        updateFeedback('¡VICTORIA! Lograste la secuencia perfecta. Usa LIMPIAR TODO para otra partida. 🏆');
        renderGrid();
        return true;
    }
    return false;
}

function executeSingleCommand(cmd) {
    if (!gameActive) return false;
    
    if (cmd === 'AVANZAR') {
        const vec = dirVectors[robot.dir];
        const newX = robot.x + vec.dx;
        const newY = robot.y + vec.dy;
        if (newX < 0 || newX >= SIZE || newY < 0 || newY >= SIZE || isWall(newX, newY)) {
            gameActive = false;
            updateFeedback('¡CHOQUE! El robot golpeó un muro o se salió. Partida terminada. 💥', true);
            renderGrid();
            return false;
        }
        robot.x = newX;
        robot.y = newY;
        renderGrid();
        return true;
    }
    else if (cmd === 'GIRAR') {
        let idx = orderTurn.indexOf(robot.dir);
        robot.dir = orderTurn[(idx + 1) % 4];
        renderGrid();
        return true;
    }
    else if (cmd === 'SALTAR') {
        const vec = dirVectors[robot.dir];
        const newX = robot.x + vec.dx * 2;
        const newY = robot.y + vec.dy * 2;
        if (newX < 0 || newX >= SIZE || newY < 0 || newY >= SIZE || isWall(newX, newY)) {
            gameActive = false;
            updateFeedback('🚫 SALTO FALLIDO: No puedes saltar fuera del mapa o contra un muro. 🚫', true);
            renderGrid();
            return false;
        }
        robot.x = newX;
        robot.y = newY;
        renderGrid();
        return true;
    }
    return true;
}

function runProgram() {
    if (!gameActive && victory) {
        updateFeedback('Ya ganaste. Presiona LIMPIAR TODO para un nuevo desafío.', true);
        return;
    }
    if (!gameActive) {
        updateFeedback('Juego terminado. Usa "LIMPIAR TODO" para reiniciar.', true);
        return;
    }
    if (commandQueue.length === 0) {
        updateFeedback(' No has programado nada. Añade AVANZAR, GIRAR o SALTAR.', true);
        return;
    }
    
    updateFeedback('Ejecutando programa...');
    // pequeño delay para dar feedback visual
    setTimeout(() => {
        for (let i = 0; i < commandQueue.length; i++) {
            if (!gameActive) break;
            executeSingleCommand(commandQueue[i]);
            if (checkWin()) break;
        }
        
        if (gameActive && !victory && robot.x === goal.x && robot.y === goal.y) {
            checkWin();
        }
        else if (gameActive && !victory && !(robot.x === goal.x && robot.y === goal.y)) {
            updateFeedback('La secuencia terminó, pero NO llegaste a la meta. Revisa tu algoritmo. Prueba usar Girar.', false);
        } else if (!gameActive && !victory) {
            // ya se mostró error específico
        }
        
        // Limpiar comandos después de ejecutar
        commandQueue = [];
        updateCommandDisplay();
        renderGrid();
    }, 20);
}

function addCommand(cmd) {
    if (!gameActive && !victory) {
        updateFeedback('Juego terminado por error. Usa LIMPIAR TODO para reiniciar.', true);
        return;
    }
    if (victory) {
        updateFeedback('Ya ganaste. Presiona LIMPIAR TODO para jugar de nuevo.', true);
        return;
    }
    if (commandQueue.length >= 6) {
        updateFeedback('Máximo 6 comandos. Presiona EJECUTAR o LIMPIAR TODO.', true);
        return;
    }
    commandQueue.push(cmd);
    updateCommandDisplay();
    // feedback amigable
    let msg = `➕ Comando "${cmd}" añadido. `;
    msg += (commandQueue.length === 6) ? '¡Límite alcanzado! Ejecuta o limpia.' : `Tienes ${commandQueue.length}/6 comandos.`;
    updateFeedback(msg);
}

function resetGame() {
    robot = { x: 0, y: 0, dir: 'RIGHT' };
    gameActive = true;
    victory = false;
    commandQueue = [];
    updateCommandDisplay();
    renderGrid();
    updateFeedback('Todo reiniciado. ¡Crea tu mejor algoritmo para llegar a la meta!');
}

// ==================== EVENTOS Y ARRANQUE ====================
document.getElementById('btnForward').addEventListener('click', () => addCommand('AVANZAR'));
document.getElementById('btnTurn').addEventListener('click', () => addCommand('GIRAR'));
document.getElementById('btnJump').addEventListener('click', () => addCommand('SALTAR'));
document.getElementById('btnRun').addEventListener('click', runProgram);
document.getElementById('btnReset').addEventListener('click', resetGame);

resetGame();