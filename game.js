// Carichiamo Phaser.js per il gioco
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // Sfondo celeste per debugging
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let monsters = [];
let battleMode = false;

function preload() {
    this.load.image('tiles', 'tilemap.png');
    this.load.tilemapTiledJSON('map', 'map.json'); // Carichiamo un tilemap JSON
    this.load.spritesheet('player', 'player.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('monster', 'monster.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('battle_bg', 'battle_bg.png');
}

function create() {
    // Creazione della mappa
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
    const worldLayer = map.createLayer('World', tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    
    // Aggiungiamo il player nella posizione corretta
    player = this.physics.add.sprite(100, 100, 'player');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, worldLayer);
    
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    cursors = this.input.keyboard.createCursorKeys();
    
    // Aggiungere mostri visibili e posizionati correttamente
    for (let i = 0; i < 3; i++) {
        let monster = this.physics.add.sprite(300 + i * 100, 200, 'monster');
        monsters.push(monster);
    }
    
    this.physics.add.overlap(player, monsters, startBattle, null, this);
}

function update() {
    if (battleMode) return;
    
    player.setVelocity(0);
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('walk', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('walk', true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('walk', true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('walk', true);
    } else {
        player.anims.stop();
    }
}

function startBattle(player, monster) {
    battleMode = true;
    player.setVelocity(0);
    
    let battleBg = this.add.image(400, 300, 'battle_bg');
    let enemy = this.add.sprite(500, 300, 'monster');
    
    let attackButton = this.add.text(350, 500, 'Attacco', { fontSize: '32px', fill: '#fff' })
        .setInteractive()
        .on('pointerdown', () => attackEnemy(enemy));
}

function attackEnemy(enemy) {
    enemy.setTint(0xff0000);
    setTimeout(() => {
        enemy.clearTint();
        battleMode = false;
        enemy.destroy();
    }, 500);
}