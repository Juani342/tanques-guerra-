import { Tank } from './Tank.js';
import { Bullet } from './Bullet.js';
import { Cloud } from './Cloud.js';
import { Structure } from './Structure.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const angleInput = document.getElementById('angleInput');
const powerInput = document.getElementById('powerInput');
const valAngle = document.getElementById('valAngle');
const valPower = document.getElementById('valPower');
const fireBtn = document.getElementById('fireBtn');
const turnIndicator = document.getElementById('turnIndicator');
const hp1Badge = document.getElementById('hp1');
const hp2Badge = document.getElementById('hp2');

const victoryModal = document.getElementById('victoryModal');
const victoryMessage = document.getElementById('victoryMessage');
const restartBtn = document.getElementById('restartBtn');

const levelUpModal = document.getElementById('levelUpModal');
const nextLevelNumber = document.getElementById('nextLevelNumber');
const nextLevelBtn = document.getElementById('nextLevelBtn');

let score = 0;
let level = 1;
let isAnimating = false;
let bullets = [];
let structures = [];
let clouds = [new Cloud(), new Cloud(), new Cloud(), new Cloud()];

let player = new Tank(100, 375, '#0000FF', true);
let enemy = new Tank(800, 375, '#FF0000', false);
let currentPlayer = player;

const backgroundImg = new Image();
backgroundImg.src = 'assets/img/background.jpg'; 

backgroundImg.onload = () => { startSystem(); };
backgroundImg.onerror = () => { startSystem(); };

function updateScoreUI() {
    const scoreText = document.getElementById('highScore');
    if (scoreText) scoreText.textContent = score.toString().padStart(3, '0');
}

function generateLevel() {
    structures = [];
    const groundY = 370;
    enemy.x = Math.floor(Math.random() * 150) + 700; 
    enemy.hp = 100 + (level * 10); 
    enemy.active = true;

    const centerX = 350 + Math.random() * 150; 
    const wallHeight = Math.floor(Math.random() * 3) + 2 + Math.floor(level / 3); 
    for(let i = 0; i < wallHeight; i++) {
        structures.push(new Structure(centerX, groundY - (i * 40), 'stone'));
    }

    if (level >= 2) {
        for(let i = 0; i < 2; i++) {
            structures.push(new Structure(enemy.x - 60, groundY - (i * 40), 'wood'));
        }
    }

    if (level >= 3) {
        for(let i = 0; i < level; i++) {
            let fx = Math.floor(Math.random() * 500) + 200; 
            let fy = Math.floor(Math.random() * 200) + 50;  
            structures.push(new Structure(fx, fy, 'stone'));
        }
    }

    if (level >= 5) {
        structures.push(new Structure(player.x + 40, 150, 'stone'));
    }

    updateScoreUI();
    if (turnIndicator) {
        turnIndicator.textContent = `NIVEL ${level} - TU TURNO`;
        turnIndicator.className = "text-info fw-bold";
    }
}

function startSystem() {
    score = 0; level = 1; player.hp = 100;
    currentPlayer = player; isAnimating = false; bullets = [];
    generateLevel();
    update();
}

function enemyTurn() {
    if (enemy.hp <= 0) return;
    if (turnIndicator) {
        turnIndicator.textContent = "ENEMIGO APUNTANDO...";
        turnIndicator.className = "text-danger fw-bold";
    }
    setTimeout(() => {
        const distance = enemy.x - player.x; 
        const aiAngle = Math.floor(Math.random() * 25) + 130; 
        const aiPower = (distance / 6.4) + (Math.random() * 6 - 3); 
        enemy.updateAngle(aiAngle);
        bullets.push(new Bullet(enemy.x, enemy.y + 5, aiAngle, aiPower));
        isAnimating = true;
    }, 1500);
}

angleInput.addEventListener('input', () => {
    if (currentPlayer === player) {
        let val = parseInt(angleInput.value);
        if (val > 90) val = 90;
        angleInput.value = val;
        valAngle.textContent = val;
        player.updateAngle(val);
    }
});

powerInput.addEventListener('input', () => valPower.textContent = powerInput.value);

fireBtn.addEventListener('click', () => {
    if (isAnimating || currentPlayer !== player) return;
    bullets.push(new Bullet(player.x + 40, player.y + 5, player.currentAngle, parseInt(powerInput.value)));
    isAnimating = true;
});

if (nextLevelBtn) {
    nextLevelBtn.addEventListener('click', () => {
        levelUpModal.style.display = 'none';
        generateLevel();
        isAnimating = false;
    });
}

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        victoryModal.style.display = 'none';
        startSystem();
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (backgroundImg.complete && backgroundImg.naturalWidth !== 0) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    clouds.forEach(c => { c.update(); c.draw(ctx); });
    structures.forEach(s => s.draw(ctx));
    if (player.hp > 0) player.draw(ctx);
    if (enemy.hp > 0) enemy.draw(ctx);

    if (hp1Badge) hp1Badge.textContent = `${Math.max(0, player.hp)}%`;
    if (hp2Badge) hp2Badge.textContent = `${Math.max(0, enemy.hp)}%`;

    bullets.forEach((b, i) => {
        b.update(); b.draw(ctx);

        if (currentPlayer === player && !b.isExploding && 
            b.x > enemy.x && b.x < enemy.x + 80 && b.y > enemy.y && b.y < enemy.y + 35) {
            enemy.hp -= 34; b.isExploding = true; score += 100; updateScoreUI();
        }

        if (currentPlayer === enemy && !b.isExploding && 
            b.x > player.x && b.x < player.x + 80 && b.y > player.y && b.y < player.y + 35) {
            player.hp -= 20; b.isExploding = true;
        }

        structures.forEach(s => {
            if(s.active && !b.isExploding && b.x > s.x && b.x < s.x + 40 && b.y > s.y && b.y < s.y + 40) {
                s.hp -= 20; if(s.hp <= 0) { s.active = false; score += 20; updateScoreUI(); }
                b.isExploding = true;
            }
        });

        if (!b.active) {
            bullets.splice(i, 1); isAnimating = false;
            if (enemy.hp <= 0) {
                level++; score += 500; updateScoreUI();
                if (nextLevelNumber) nextLevelNumber.textContent = level;
                if (levelUpModal) levelUpModal.style.display = 'flex';
                currentPlayer = player;
                isAnimating = true; 
            } else if (player.hp <= 0) {
                if (victoryModal) {
                    victoryMessage.textContent = `PUNTUACIÓN FINAL: ${score}`;
                    victoryModal.style.display = 'flex';
                }
                isAnimating = true;
            } else {
                currentPlayer = (currentPlayer === player) ? enemy : player;
                if (currentPlayer === enemy) enemyTurn();
                else {
                    turnIndicator.textContent = `NIVEL ${level} - TU TURNO`;
                    turnIndicator.className = "text-info fw-bold";
                }
            }
        }
    });
    requestAnimationFrame(update);
}