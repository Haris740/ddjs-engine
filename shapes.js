// shapes.js - Rectangle, circle, triangle classes

import { ctx, graphics, cH } from './core.js';

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
        this.velocity = { x: 0, y: 0 };
        this.gravity = options.gravity || 0.3;
        this.isJumping = false;
        this.jumpStrength = -10;
        this.restitution = options.restitution || 0; // Bounce factor (0 = no bounce, 1 = perfect bounce)
        this.isClicked = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX * graphics, this.posY * graphics, this.width * graphics, this.height * graphics);
    }

    update() {
        // Apply gravity
        this.velocity.y += this.gravity;

        // Update position
        this.posY += this.velocity.y;

        // Check for collision with ground
        if (this.posY + this.height >= cH / graphics) {
            this.posY = cH / graphics - this.height;
            this.velocity.y = -this.velocity.y * this.restitution; // Apply restitution
            this.isJumping = false;
        }

        this.draw();
    }

    jump() {
        if (!this.isJumping) {
            this.velocity.y = this.jumpStrength;
            this.isJumping = true;
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

            if (
                mouseX >= this.posX - this.width / 2 &&
                mouseX <= this.posX + this.width / 2 &&
                mouseY >= this.posY - this.height / 2 &&
                mouseY <= this.posY + this.height / 2
            ) {
                isDragging = true;
                offsetX = mouseX - this.posX;
                offsetY = mouseY - this.posY;
                this.gravity = 0;
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                this.posX = mouseX - offsetX;
                this.posY = mouseY - offsetY;
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            this.gravity = elementGravity;
        });
    }

    changeColor(newColor) {
        this.color = newColor;
        return this;
    }

    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
        return this;
    }

    setAlpha(newAlpha) {
        this.alpha = newAlpha;
        return this;
    }

    toggleDraggable() {
        this.draggable = !this.draggable;
        return this;
    }

    rotate(angleInDegrees) {
        const angleInRadians = angleInDegrees * Math.PI / 180;
        const centerX = this.posX + this.width / 2;
        const centerY = this.posY + this.height / 2;
        const dx = this.posX - centerX;
        const dy = this.posY - centerY;

        this.posX = centerX + dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians);
        this.posY = centerY + dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians);
        return this;
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
        return this;
    }

    adjustOpacity(newAlpha) {
        if (newAlpha >= 0 && newAlpha <= 1) {
            this.alpha = newAlpha;
        }
        return this;
    }

    changeMass(newMass) {
        if (newMass > 0) {
            this.mass = newMass;
        }
        return this;
    }

    adjustAcceleration(newAcc) {
        this.velocity.y = newAcc;
        return this;
    }
}

export class circle {
    constructor(options) {
        this.posX = options.posX || 0;
        this.posY = options.posY || 0;
        this.radius = options.radius || 0;
        this.color = options.color || 'black';
        this.alpha = options.alpha || 1;
        this.mass = options.mass || 1;
        this.features = options.features || {};
        this.draggable = this.features.draggable || false;
        this.velocity = { x: 0, y: 0 };
        this.gravity = this.features.gravity || 0.3;
        this.isJumping = false;
        this.jumpStrength = options.jumpStrength || -10;
        this.restitution = options.restitution || 0; // Bounce factor (0 = no bounce, 1 = perfect bounce)
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.posX * graphics, this.posY * graphics, this.radius * graphics, 0, Math.PI * 2, false);
        ctx.fill();
    }


    update() {
        // Apply gravity
        this.velocity.y += this.gravity;

        // Update position
        this.posY += this.velocity.y;

        // Check for collision with ground
        if (this.posY + this.radius >= cH / graphics) {
            this.posY = cH / graphics - this.radius;
            this.velocity.y = -this.velocity.y * this.restitution; // Apply restitution
            this.isJumping = false;
        }

        this.draw();
    }

    jump() {
        if (!this.isJumping) {
            this.velocity.y = this.jumpStrength;
            this.isJumping = true;
        }
    }

    isPointingInside(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.posX) ** 2 + (mouseY - this.posY) ** 2);
        return distance <= this.radius;
    }

    onClickDown(functif, functelse) {
        const canvas = document.querySelector('canvas');
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
        const canvas = document.querySelector('canvas');
        canvas.addEventListener('mouseup', (e) => {
            if (this.isPointingInside(e.clientX, e.clientY)) {
                functif();
            }
        });
    }

    onHover(functif, functelse) {
        const canvas = document.querySelector('canvas');
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
            const canvas = document.querySelector('canvas');
            let isDragging = false;
            let offsetX, offsetY;
            let elementGravity = this.gravity;

            canvas.addEventListener('mousedown', (e) => {
                const clickedX = e.clientX;
                const clickedY = e.clientY;

                if (this.isPointingInside(clickedX, clickedY)) {
                    isDragging = true;
                    offsetX = clickedX - this.posX;
                    offsetY = clickedY - this.posY;
                }
            });

            canvas.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.gravity = 0;
                    this.posX = e.clientX - offsetX;
                    this.posY = e.clientY - offsetY;
                }
            });

            canvas.addEventListener('mouseup', () => {
                isDragging = false;
                this.gravity = elementGravity;
            });
        }
    }

    addForce(force) {
        this.velocity.y += force / this.mass;
        this.velocity.y += this.gravity;
        this.posY += this.velocity.y;
    }

    changeColor(newColor) {
        this.color = newColor;
        return this;
    }

    resize(newRadius) {
        this.radius = newRadius;
        return this;
    }

    setAlpha(newAlpha) {
        this.alpha = newAlpha;
        return this;
    }

    toggleDraggable() {
        this.draggable = !this.draggable;
        return this;
    }

    isCollidingWith(otherCircle) {
        const distance = Math.sqrt((otherCircle.posX - this.posX) ** 2 + (otherCircle.posY - this.posY) ** 2);
        return distance <= this.radius + otherCircle.radius;
    }

    scale(factor) {
        this.radius *= factor;
        return this;
    }

    adjustOpacity(opacityChange) {
        this.alpha += opacityChange;
        this.alpha = Math.max(0, Math.min(1, this.alpha));
        return this;
    }

    changeMass(newMass) {
        this.mass = newMass;
        return this;
    }

    adjustAcceleration(accelerationChange) {
        this.velocity.y += accelerationChange;
        return this;
    }
}

export class eqTriangle {
    constructor(options) {
        this.posX = options.posX || 0;
        this.posY = options.posY || 0;
        this.length = options.length || 0;
        this.color = options.color || 'black';
        this.height = (Math.sqrt(3) / 2) * this.length;
        this.draggable = options.draggable || false;
        this.alpha = options.alpha || 1;
        this.mass = options.mass || 1;
        this.velocity = { x: 0, y: 0 };
        this.gravity = options.gravity || 0.3;
        this.isJumping = false;
        this.jumpStrength = options.jumpStrength || -10;
        this.restitution = options.restitution || 0;
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
        // Apply gravity
        this.velocity.y += this.gravity;

        // Update position
        this.posY += this.velocity.y;

        // Check for collision with ground
        if (this.posY + this.height / 2 >= cH / graphics) {
            this.posY = cH / graphics - this.height / 2;
            this.velocity.y = -this.velocity.y * this.restitution; // Apply restitution
            this.isJumping = false;
        }

        this.draw();
    }

    jump() {
        if (!this.isJumping) {
            this.velocity.y = this.jumpStrength;
            this.isJumping = true;
        }
    }

    changeColor(newColor) {
        this.color = newColor;
        return this;
    }

    resize(newLength) {
        this.length = newLength;
        this.height = (Math.sqrt(3) / 2) * this.length;
        return this;
    }

    setAlpha(newAlpha) {
        this.alpha = newAlpha;
        return this;
    }

    toggleDraggable() {
        this.draggable = !this.draggable;
        return this;
    }

    rotate(angle) {
        const angleInRadians = angle * Math.PI / 180;
        const cos = Math.cos(angleInRadians);
        const sin = Math.sin(angleInRadians);

        const newX = cos * (this.posX - this.length / 2) - sin * (this.posY + this.height / 2);
        const newY = sin * (this.posX - this.length / 2) + cos * (this.posY + this.height / 2);

        this.posX = newX + this.length / 2;
        this.posY = newY - this.height / 2;
        return this;
    }

    isCollidingWith(otherObject) {
        const distanceX = Math.abs(this.posX - otherObject.posX);
        const distanceY = Math.abs(this.posY - otherObject.posY);

        if (distanceX < this.length / 2 + otherObject.length / 2 && distanceY < this.height / 2 + otherObject.height / 2) {
            return true;
        }

        return false;
    }

    isCollidingWithRect(rect) {
        return (
            this.posX - this.length / 2 < rect.posX + rect.width &&
            this.posX + this.length / 2 > rect.posX &&
            this.posY - this.height / 2 < rect.posY + rect.height &&
            this.posY + this.height / 2 > rect.posY
        );
    }

    scale(factor) {
        this.length *= factor;
        this.height = (Math.sqrt(3) / 2) * this.length;
        return this;
    }

    adjustOpacity(opacityChange) {
        this.alpha += opacityChange;
        this.alpha = Math.max(0, Math.min(1, this.alpha));
        return this;
    }

    changeMass(newMass) {
        this.mass = newMass;
        return this;
    }

    adjustAcceleration(accelerationChange) {
        this.velocity.y += accelerationChange;
        return this;
    }
}

export class text {
    constructor(options) {
        this.x = options.posX * graphics;
        this.y = options.posY * graphics;
        this.text = options.text;
        this.font = options.font;
        this.color = options.color;
        this.alpha = options.alpha;

        if (this.alpha == undefined) {
            this.alpha = 1;
        }
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y);
    }

    update() {
        this.draw();
    }
}