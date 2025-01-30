const canvas = document.getElementById('game-map');
const ctx = canvas.getContext('2d');
const logDiv = document.getElementById('log');
const battleButton = document.getElementById('battle-button');
const battleModal = document.getElementById('battle-modal');
const battleLog = document.getElementById('battle-log');

const playerMonster = { name: "Dracofly", hp: 30, maxHp: 30, attacks: { "basic-attack": { name: "Morso", damage: 5 }, "special-attack": { name: "Soffio di Fiamma", damage: 8 } } };
const enemyMonster = { name: "Slime", hp: 20, maxHp: 20, attacks: { "basic-attack": { name: "Schianto Gelatinoso", damage: 3 }, "special-attack": { name: "Acido Corrosivo", damage: 6 } } };

let turn = "player";

function startBattle() {
  playerMonster.hp = playerMonster.maxHp;
  enemyMonster.hp = enemyMonster.maxHp;
  turn = "player";
  updateBattleUI();
  battleLog.textContent = "È iniziata la battaglia!";
  battleModal.classList.remove('hidden');
}

function updateBattleUI() {
  document.getElementById('player-monster-name').textContent = playerMonster.name;
  document.getElementById('player-monster-hp').textContent = `HP: ${playerMonster.hp} / ${playerMonster.maxHp}`;
  document.getElementById('enemy-monster-name').textContent = enemyMonster.name;
  document.getElementById('enemy-monster-hp').textContent = `HP: ${enemyMonster.hp} / ${enemyMonster.maxHp}`;
}

function performAttack(attacker, defender, moveKey) {
  const move = attacker.attacks[moveKey];
  if (!move) return;
  defender.hp -= move.damage;
  if (defender.hp < 0) defender.hp = 0;
  battleLog.textContent = `${attacker.name} usa ${move.name}! (${move.damage} danni)`;
}

function checkBattleEnd() {
  if (enemyMonster.hp <= 0) {
    battleLog.textContent += `
${enemyMonster.name} è sconfitto! Hai vinto!`;
    setTimeout(() => battleModal.classList.add('hidden'), 1500);
    return true;
  }
  if (playerMonster.hp <= 0) {
    battleLog.textContent += `
${playerMonster.name} è stato sconfitto... Hai perso.`;
    setTimeout(() => battleModal.classList.add('hidden'), 1500);
    return true;
  }
  return false;
}

document.querySelectorAll('.attack-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (turn !== "player") return;
    performAttack(playerMonster, enemyMonster, btn.getAttribute('data-move'));
    updateBattleUI();
    if (checkBattleEnd()) return;
    turn = "enemy";
    setTimeout(() => performAttack(enemyMonster, playerMonster, "basic-attack"), 1000);
    updateBattleUI();
    checkBattleEnd();
    turn = "player";
  });
});

document.getElementById('run-btn').addEventListener('click', () => {
  battleLog.textContent = "Sei fuggito dalla battaglia!";
  setTimeout(() => battleModal.classList.add('hidden'), 1000);
});

battleButton.addEventListener('click', startBattle);