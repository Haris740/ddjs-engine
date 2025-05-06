// Import necessary functions and classes from the DD.js library
import { setupCanvas, clearCanvas, rect, Camera, ctx, graphics } from '../dd.js';

// Set up the canvas with specified dimensions, scaling, and background color
setupCanvas(1000, 500, 2, 'lightblue');

// Initialize the player character
const player = new rect({
    posX: 100,
    posY: 100,
    width: 30,
    height: 50,
    color: 'blue',
    gravity: 0.5,
    restitution: 0.5,
    jumpStrength: -10,
    isJumping: false,
    velocity: { x: 0, y: 0 }
});

// Create some platforms
const platformData = [
    { posX: 0, posY: 480, width: 5000, height: 20, color: 'red' },
    { posX: 50, posY: 350, width: 100, height: 20, color: 'green' },
    { posX: 200, posY: 460, width: 500, height: 20, color: 'green' },
    { posX: 400, posY: 440, width: 200, height: 20, color: 'green' },
    { posX: 800, posY: 400, width: 300, height: 20, color: 'green' },
    { posX: 1200, posY: 300, width: 300, height: 20, color: 'green' },
    { posX: 1500, posY: 460, width: 1000, height: 20, color: 'green' },
    { posX: 1800, posY: 440, width: 500, height: 20, color: 'green' },
    { posX: 2700, posY: 420, width: 500, height: 20, color: 'green' },
    { posX: 3300, posY: 420, width: 50, height: 20, color: 'green' },
    { posX: 3400, posY: 420, width: 40, height: 20, color: 'green' },
    { posX: 3500, posY: 420, width: 30, height: 20, color: 'green' },
    { posX: 3600, posY: 420, width: 20, height: 20, color: 'green' },
    { posX: 3700, posY: 420, width: 10, height: 20, color: 'green' },
    { posX: 3900, posY: 460, width: 500, height: 20, color: 'green' },
    { posX: 4500, posY: 380, width: 300, height: 20, color: 'green' },
];

const platforms = platformData.map(data => new rect(data));

// Initialize the camera
const camera = new Camera();
camera.setTarget(player);
camera.setLevelWidth(5000); // Set your level width

// Handle keyboard input
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Function to handle collisions between the player and platforms
function handleCollisions() {
    if (player.isCollidingWith(platforms[0])) alert('Collided with the ground!');
    platforms.forEach(platform => {
        // Check for collision on the bottom of the player
        if (player.posY + player.height >= platform.posY &&
            player.posY + player.height <= platform.posY + platform.height/2 &&
            player.posX + player.width > platform.posX &&
            player.posX < platform.posX + platform.width) {
            player.posY = platform.posY - player.height;
            player.velocity.y = 0;
            player.isJumping = false;
        }

        // Check for collision on the top of the player
        if (player.posY <= platform.posY + platform.height &&
            player.posY >= platform.posY + platform.height/2 &&
            player.posX + player.width > platform.posX &&
            player.posX < platform.posX + platform.width) {
            player.posY = platform.posY + platform.height;
            player.velocity.y = 0;
        }

        // Check for collision on the left of the player
        if (player.posX <= platform.posX + platform.width &&
            player.posX >= platform.posX &&
            player.posY + player.height > platform.posY &&
            player.posY < platform.posY + platform.height) {
            player.posX = platform.posX + platform.width;
        }

        // Check for collision on the right of the player
        if (player.posX + player.width >= platform.posX &&
            player.posX + player.width <= platform.posX + platform.width &&
            player.posY + player.height > platform.posY &&
            player.posY < platform.posY + platform.height) {
            player.posX = platform.posX - player.width;
        }
    });
}

// Game loop function
function animate() {
    clearCanvas(); // Clear the canvas

    // Update camera position
    camera.update();

    // Apply gravity to the player
    player.velocity.y += player.gravity;

    // Handle player movement
    if (keys['ArrowLeft']) {
        player.posX -= 5; // Move left
    }
    if (keys['ArrowRight']) {
        player.posX += 5; // Move right
    }
    if (keys[' '] && !player.isJumping) {
        player.velocity.y = player.jumpStrength;
        player.isJumping = true;
    }

    // Update player position
    player.posY += player.velocity.y;

    // Handle player-platform collisions
    handleCollisions();

    // Draw platforms with camera offset
    platforms.forEach(platform => {
        ctx.globalAlpha = 1;
        ctx.fillStyle = platform.color;
        ctx.fillRect(
            (platform.posX - camera.x) * graphics,
            platform.posY * graphics,
            platform.width * graphics,
            platform.height * graphics
        );
    });

    // Draw player with camera offset
    ctx.globalAlpha = 1;
    ctx.fillStyle = player.color;
    ctx.fillRect(
        (player.posX - camera.x) * graphics,
        player.posY * graphics,
        player.width * graphics,
        player.height * graphics
    );

    // Request the next animation frame
    requestAnimationFrame(animate);
}

// Start the game loop
animate();