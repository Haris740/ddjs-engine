// Made by Model Media

// Copyright @ Model_Media

export const canvas = document.createElement('canvas');
export const ctx = canvas.getContext('2d');
export let cW = canvas.width;
export let cH = canvas.height;
export let graphics;

/**
 * Set up the canvas with specified dimensions, scaling, and background color.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {number} [graphics=1] - The scaling factor for the canvas (higher values for higher quality, uses more memory). Defaults to 1.
 * @param {string} [color='white'] - The background color of the canvas. Defaults to 'white' if not provided.
 */
export function setupCanvas(width, height, graphic = 1, color = 'white') {
    if (typeof width !== 'number' || typeof height !== 'number') {
        throw new Error('Width and height must be numbers.');
    }

    graphics = graphic;
    cW = canvas.width;
    cH = canvas.height;

    canvas.width = cW = width * graphics;
    canvas.height = cH = height * graphics;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.style.background = color;
}

export class rect {
    constructor(options) {
        this.posX = options.posX || 0;
        this.posY = options.posY || 0;
        this.width = options.width || 0;
        this.height = options.height || 0;
        this.color = options.color || 'black';
        this.draggable = options.features?.draggable || false;
        this.alpha = options.alpha || 1;
        this.mass = options.mass || 1;
        this.acceleration = 0;
        this.gravity = 0.7;
        this.isClicked = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX * graphics, this.posY * graphics, this.width * graphics, this.height * graphics);
    }

    addForce(force) {
        // Apply gravity
        const gravity = 0.7;
        const friction = 0.95; // Adjust this to control friction

        this.acceleration += force / this.mass;
        this.acceleration += gravity;

        this.posY += this.acceleration;
        this.acceleration *= friction; // Apply friction to the acceleration

        // Simulate collision with the ground or other boundaries
        if (this.posY + this.height >= cH) {
            this.posY = cH - this.height; // Reset position at the ground level
            this.acceleration = 0; // Stop further acceleration (grounded)
        }
    }

    update() {
        this.draw();

        // Using original acceleration due to gravity formula
        const bottomY = this.posY + this.height;

        if (bottomY < cH / graphics) {
            const gravityAcceleration = 0.95; // Gravity's acceleration constant (adjust as needed)
            this.acceleration += gravityAcceleration / this.mass; // Apply the gravity formula
            this.posY += this.acceleration;
        } else {
            this.acceleration = 0;
            this.posY = cH / graphics - this.height;
        }
    }

    isPointInside(x, y) {
        return (
            x >= this.posX - this.width / 2 &&
            x <= this.posX + this.width / 2 &&
            y >= this.posY - this.height / 2 &&
            y <= this.posY + this.height / 2
        );
    }

    onClickDown(x, y) {
        if (this.isPointInside(x, y)) {
            this.isClicked = true;
            this.offsetX = x - this.posX;
            this.offsetY = y - this.posY;
        }
    }

    onClickUp() {
        this.isClicked = false;
    }

    onMouseMove(x, y) {
        if (this.isClicked) {
            this.posX = x - this.offsetX;
            this.posY = y - this.offsetY;
        }
    }

    enableDragging(canvas) {
        let isDragging = false;
        let offsetX, offsetY;
        let elementGravity = this.gravity;

        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check if the mouse click is within the rectangle
            if (
                mouseX >= this.posX - this.width / 2 &&
                mouseX <= this.posX + this.width / 2 &&
                mouseY >= this.posY - this.height / 2 &&
                mouseY <= this.posY + this.height / 2
            ) {
                isDragging = true;
                offsetX = mouseX - this.posX;
                offsetY = mouseY - this.posY;
                this.gravity = 0; // To stop the regular gravity while dragging
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Update the position based on mouse movement
                this.posX = mouseX - offsetX;
                this.posY = mouseY - offsetY;
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            this.gravity = elementGravity; // Restore the original gravity after dragging
        });
    }

    changeColor(newColor) {
        this.color = newColor;
    }

    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
    }

    setAlpha(newAlpha) {
        this.alpha = newAlpha;
    }

    toggleDraggable() {
        this.draggable = !this.draggable;
    }

    rotate(angleInDegrees) {
        const angleInRadians = angleInDegrees * Math.PI / 180;
        const centerX = this.posX + this.width / 2;
        const centerY = this.posY + this.height / 2;
        const dx = this.posX - centerX;
        const dy = this.posY - centerY;

        this.posX = centerX + dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians);
        this.posY = centerY + dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians);
    }

    isCollidingWith(otherRect) {
        return (
            this.posX < otherRect.posX + otherRect.width &&
            this.posX + this.width > otherRect.posX &&
            this.posY < otherRect.posY + otherRect.height &&
            this.posY + this.height > otherRect.posY
        );
    }

    scale(factor) {
        this.width *= factor;
        this.height *= factor;
    }

    adjustOpacity(newAlpha) {
        if (newAlpha >= 0 && newAlpha <= 1) {
            this.alpha = newAlpha;
        }
    }

    changeMass(newMass) {
        if (newMass > 0) {
            this.mass = newMass;
        }
    }

    adjustAcceleration(newAcc) {
        this.acceleration = newAcc;
    }
}

export class circle {
    constructor(posX, posY, radius, color, features, alpha = 1, mass = 1) {
        this.x = posX;
        this.y = posY;
        this.radius = radius;
        this.color = color;
        this.alpha = alpha;
        this.mass = mass;
        this.features = features || {};

        this.draggable = this.features.draggable || false;
        this.acceleration = 0;
        this.gravity = 0.7;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x * graphics, this.y * graphics, this.radius * graphics, 0, Math.PI * 2, false);
        ctx.fill();
    }

    update() {
        this.draw();

        // Using original acceleration due to gravity formula
        const bottomY = this.y + this.radius;

        if (bottomY < cH / graphics) {
            const gravityAcceleration = 0.95; // Gravity's acceleration constant (adjust as needed)
            this.acceleration += gravityAcceleration / this.mass; // Apply the gravity formula
            this.y += this.acceleration;
        } else {
            this.acceleration = 0;
            this.y = cH / graphics - this.radius;
        }
    }

    isPointingInside(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return distance <= this.radius;
    }

    onClickDown(functif, functelse) {
        canvas.addEventListener('mousedown', (e) => {
            const clickedX = e.clientX;
            const clickedY = e.clientY;

            if (this.isPointingInside(clickedX, clickedY)) {
                functif();
            } else {
                functelse();
            }
        });
    }

    onClickUp(functif) {
        canvas.addEventListener('mouseup', (e) => {
            if (this.isPointingInside(e.clientX, e.clientY)) {
                functif();
            }
        });
    }

    onHover(functif, functelse) {
        canvas.addEventListener('mousemove', (e) => {
            if (this.isPointingInside(e.clientX, e.clientY)) {
                functif();
            } else {
                functelse();
            }
        });
    }

    enableDragging() {
        if (this.draggable) {
            let isDragging = false;
            let offsetX, offsetY;
            let elementGravity = this.gravity;

            canvas.addEventListener('mousedown', (e) => {
                const clickedX = e.clientX;
                const clickedY = e.clientY;

                if (this.isPointingInside(clickedX, clickedY)) {
                    isDragging = true;
                    offsetX = clickedX - this.x;
                    offsetY = clickedY - this.y;
                }
            });

            canvas.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.gravity = 0;
                    this.x = e.clientX - offsetX;
                    this.y = e.clientY - offsetY;
                }
            });

            canvas.addEventListener('mouseup', () => {
                isDragging = false;
                this.gravity = elementGravity;
            });
        }
    }

    addForce(force) {
        this.acceleration += force / this.mass;
        this.acceleration += this.gravity;
        this.y += this.acceleration;
    }

    changeColor(newColor) {
        this.color = newColor;
    }

    resize(newRadius) {
        this.radius = newRadius * graphics;
    }

    setAlpha(newAlpha) {
        this.alpha = newAlpha;
    }

    toggleDraggable() {
        this.draggable = !this.draggable;
    }

    isCollidingWith(otherCircle) {
        const distance = Math.sqrt((otherCircle.x - this.x) ** 2 + (otherCircle.y - this.y) ** 2);
        return distance <= this.radius + otherCircle.radius;
    }

    scale(scaleFactor) {
        this.radius *= scaleFactor;
    }

    adjustOpacity(opacityChange) {
        this.alpha += opacityChange;
        this.alpha = Math.max(0, Math.min(1, this.alpha));
    }

    changeMass(newMass) {
        this.mass = newMass;
    }

    adjustAcceleration(accelerationChange) {
        this.acceleration += accelerationChange;
    }
}

export class eqTriangle {
    constructor(posX, posY, length, color) {
        if (color === undefined) {
            color = 'white';
        }

        this.posX = posX;
        this.posY = posY;
        this.length = length;
        this.color = color;
        this.height = (Math.sqrt(3) / 2) * this.length;
        this.draggable = false;
        this.alpha = 1;
        this.mass = 1;
        this.acceleration = 0;
        this.gravity = 0.7;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posX * graphics, this.posY * graphics - this.height / 2 * graphics);
        ctx.lineTo(this.posX * graphics + this.length / 2 * graphics, this.posY * graphics + this.height / 2 * graphics);
        ctx.lineTo(this.posX * graphics - this.length / 2 * graphics, this.posY * graphics + this.height / 2 * graphics);
        ctx.lineTo(this.posX * graphics, this.posY * graphics - this.height / 2 * graphics);
        ctx.fill();
    }

    update() {
        this.draw();
    }

    changeColor(newColor) {
        this.color = newColor;
    }

    resize(newLength) {
        this.length = newLength;
        this.height = (Math.sqrt(3) / 2) * this.length;
    }

    setAlpha(newAlpha) {
        this.alpha = newAlpha;
    }

    toggleDraggable() {
        this.draggable = !this.draggable;
    }

    rotate(angle) {
        const radians = (Math.PI / 180) * angle;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const newX = cos * (this.posX - this.length / 2) - sin * (this.posY + this.height / 2);
        const newY = sin * (this.posX - this.length / 2) + cos * (this.posY + this.height / 2);

        this.posX = newX + this.length / 2;
        this.posY = newY - this.height / 2;
    }

    isCollidingWith(otherObject) {
        const distanceX = Math.abs(this.posX - otherObject.posX);
        const distanceY = Math.abs(this.posY - otherObject.posY);

        if (distanceX < this.length / 2 + otherObject.length / 2 && distanceY < this.height / 2 + otherObject.height / 2) {
            return true;
        }

        return false;
    }

    scale(factor) {
        this.length *= factor;
        this.height = (Math.sqrt(3) / 2) * this.length;
    }

    adjustOpacity(change) {
        this.alpha += change;
        if (this.alpha < 0) this.alpha = 0;
        if (this.alpha > 1) this.alpha = 1;
    }

    changeMass(newMass) {
        this.mass = newMass;
    }

    adjustAcceleration(change) {
        this.acceleration += change;
    }
}

export class text {
    constructor(posX, posY, text, font, color, alpha) {
        if (alpha === undefined) {
            alpha = 1;
        }

        this.x = posX * graphics;
        this.y = posY * graphics;
        this.text = text;
        this.font = font;
        this.color = color;
        this.alpha = alpha;
        this.rotation = 0;
        this.scale = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }

    update() {
        this.draw();
    }

    changeColor(newColor) {
        this.color = newColor;
    }

    setAlpha(newAlpha) {
        this.alpha = newAlpha;
    }

    rotate(angle) {
        this.rotation += angle;
    }

    scaleText(factor) {
        this.scale *= factor;
    }

    setText(newText) {
        this.text = newText;
    }
}

export class DrawImg {
    constructor() {
        this.img = new Image();
        this.loaded = false;
        this.x = 0;
        this.y = 0;
        this.gravity = 0;
    }

    load(src) {
        return new Promise((resolve, reject) => {
            this.img.onload = () => {
                this.loaded = true;
                resolve();
            };
            this.img.src = src;
        });
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    applyGravity(gravity) {
        this.gravity = gravity;
        this.y += this.gravity;
    }

    setFramePosition(sourceX, sourceY, sourceWidth, sourceHeight) {
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.sourceWidth = sourceWidth;
        this.sourceHeight = sourceHeight;
    }

    updateFrame(frameWidth, frameHeight, frameIndex) {
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameIndex = frameIndex;
    }

    draw({ destWidth, destHeight }) {
        if (!this.loaded) return;

        ctx.drawImage(
            this.img,
            this.sourceX,
            this.sourceY,
            this.sourceWidth,
            this.sourceHeight,
            this.x,
            this.y,
            destWidth,
            destHeight
        );
    }
}

export class Character {
    constructor(imgData, gravity, velocity, swordData, health) {
        this.imgData = imgData;
        this.framesShown = 0;
        this.framesDelay = 7;
        this.gravity = gravity;
        this.velocity = velocity;
        this.sword = swordData;
        this.isAttacking = false;
        this.extraGravity = 0.3;
        this.jumpStrength = -8;
        this.isJumping = false;
        this.health = health || 100;
        this.animationSpeed = 0.1; // Modify animation speed as needed
        this.currentFrame = 0;
        this.totalFrames = 6; // Set the total number of frames
        this.currentImage = new Image();
        this.currentImage.src = this.imgData.src;
        this.attackSound = new Audio('path_to_attack_sound.mp3');
        this.state = 'idle';
    }

    draw() {
        ctx.drawImage(
            this.currentImage,
            this.currentFrame * this.imgData.sw,
            0,
            this.imgData.sw,
            this.imgData.sh,
            this.imgData.dx,
            this.imgData.dy,
            this.imgData.dw,
            this.imgData.dh
        );
    }

    update() {
        const { dy, dh } = this.imgData;
        this.sword.x = this.imgData.dx + this.sword.x;
        this.sword.y = this.imgData.dy + 50;

        this.draw();
        this.imgData.dy += this.gravity;
        this.imgData.dx += this.velocity;

        // Apply gravity
        this.imgData.dy += this.gravity;

        // Adjust gravity dynamically if needed
        if (this.imgData.dy + this.imgData.dh + this.gravity >= cH - 32) {
            this.gravity = 0;
        } else {
            this.gravity += this.extraGravity;
        }

        // Jumping mechanism (modify gravity)
        if (this.isJumping) {
            this.imgData.dy += this.gravity;
            this.gravity += this.extraGravity;

            if (this.imgData.dy + this.gravity >= cH - 32) {
                this.gravity = 0;
                this.isJumping = false;
            }
        }

        this.animateSprite();
    }

    setState(newState) {
        this.state = newState;
    }

    onAttack(callback) {
        // Logic to trigger callback when attacking
        if (this.isAttacking) {
            callback();
        }
    }

    animateSprite() {
        const { sx, sw, frames } = this.imgData;
        this.framesShown++;
        if (frames > 1 && this.framesShown % this.framesDelay === 0) {
            if (sx / sw < frames - 1) {
                this.imgData.sx += this.imgData.sw;
            } else {
                this.imgData.sx = 0;
            }
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

    moveLeft() {
        this.imgData.dx -= this.velocity;
    }

    moveRight() {
        this.imgData.dx += this.velocity;
    }

    moveUp() {
        this.imgData.dy -= this.velocity;
    }

    moveDown() {
        this.imgData.dy += this.velocity;
    }

    jump() {
        if (!this.isJumping) {
            this.gravity = this.jumpStrength;
            this.isJumping = true;
        }
    }

    // Collision detection method (example)
    isCollidingWith(object) {
        return (
            this.imgData.dx < object.x + object.width &&
            this.imgData.dx + this.imgData.dw > object.x &&
            this.imgData.dy < object.y + object.height &&
            this.imgData.dy + this.imgData.dh > object.y
        );
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            // Handle character death or other actions when health reaches zero
        }
    }

    heal(amount) {
        this.health += amount;
        // Ensure health doesn't exceed maximum health value
        const maxHealth = 100;
        if (this.health > maxHealth) {
            this.health = maxHealth;
        }
    }

    animate() {
        this.currentFrame += this.animationSpeed;
        if (this.currentFrame >= this.totalFrames) {
            this.currentFrame = 0;
        }
        this.imgData.sx = this.currentFrame * this.imgData.sw; // Update source X position for sprite sheet
    }

    drawHealthBar() {
        const barWidth = 100;
        const barHeight = 10;
        const xPos = this.imgData.dx; // Adjust the X position as needed
        const yPos = this.imgData.dy - 20; // Adjust the Y position as needed
        const healthPercentage = this.health / 100; // Normalize health to a percentage value

        // Draw the border of the health bar
        ctx.fillStyle = 'black';
        ctx.fillRect(xPos, yPos, barWidth, barHeight);

        // Draw the filled portion based on current health
        ctx.fillStyle = 'green';
        ctx.fillRect(xPos, yPos, barWidth * healthPercentage, barHeight);
    }
}







/**
 * 
 * @param {string} size -please type with 'px'
 */
export function curvedCanvas(size) {
    canvas.style.borderRadius = size;
}

export function clearCanvas() {
    ctx.clearRect(0, 0, cW, cH);
}

export function centerCanvas() {
    var body = document.body;
    var centre = document.createElement('div');
    body.appendChild(centre);
    centre.appendChild(canvas);
    centre.style.width = '100%';
    centre.style.height = '100vh';
    centre.style.display = 'flex';
    canvas.style.margin = 'auto auto';
    body.style.margin = '0px';
    body.style.padding = '0px';
}