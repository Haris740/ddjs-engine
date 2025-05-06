import { setupCanvas, rect, clearCanvas, circle, text, eqTriangle } from '../dd.js';

setupCanvas(800, 500, 2, 'lightblue');

const player = new rect({
    posX: 100,
    posY: 100,
    width: 50,
    height: 30,
    color: 'blue',
});

const ball = new circle({
    posX: 250,
    posY: 300,
    radius: 20,
    color: 'red',
    restitution: 0.6,
});

const smallBall = new circle({
    posX: 300,
    posY: 300,
    radius: 15,
    color: 'black',
    restitution: 0.8,
});

const bouncer = new circle({
    posX: 350,
    posY: 300,
    radius: 10,
    color: 'green',
    restitution: 1,
});

const tri = new eqTriangle({
    posX: 25,
    posY: 300,
    length: 50,
    color: 'purple',
    restitution: 0.5,
});

const message = new text({
    posX: 100,
    posY: 100,
    text: 'Click space to jump',
    color: 'black',
    font: "50px cursive",
});

// Handle keyboard input
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function animate() {
    clearCanvas();
    
    // Jump when spacebar is pressed
    if (keys[' '] && !player.isJumping) {
        player.jump();
        ball.jump();
        smallBall.jump();
        bouncer.jump();
    }
    
    player.update();
    ball.update();
    smallBall.update();
    bouncer.update();
    message.update();
    tri.update();
    
    requestAnimationFrame(animate);
}

animate();