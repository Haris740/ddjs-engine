// Made by Model Media

// Copyright @ Model_Media

export const canvas = document.createElement('canvas');
export const ctx = canvas.getContext('2d');
export let cW = canvas.width;
export let cH = canvas.height;
export let graphics;

/**
 * 
 * @param {Number} width - Type the width of canvas
 * @param {Number} height - Type the height of canvas
 * @param {String} color - Type the background color of canvas. type in "".(ignore for white)
 */
export function drawCanvas(color) {
    if (color == undefined) color = 'white';
    canvas.style.background = color;
}

export class rect {
    /**
     * 
     * @param {Number} posX -please type X-position of Rectangle
     * @param {Number} posY -please type Y-position of Rectangle
     * @param {Number} width -please type width of Rectangle
     * @param {Number} height -please type height of Rectangle
     * @param {String} color -please type color of Rectangle with ""
     * @param {Number} alpha -please type alpha of Rectangle (don't mind if it is 1)
     * @param {Number} mass -please type the mass of this Box. 
     */
    constructor(posX, posY, width, height, color, features, alpha, mass) {
        this.x = (posX - width / 2) * graphics;
        this.y = (posY - height / 2) * graphics;
        this.posX = posX;
        this.posY = posY
        this.width = width * graphics;
        this.height = height * graphics;
        this.color = color;
        this.draggable = features.draggable || false;
        this.alpha = alpha || 1;
        this.mass = mass;
        this.acceleration = 0;
        this.gravity = 0.7;
        this.h = {
            start: posX - width / 2,
            end: posX + width / 2
        }
        this.v = {
            start: posY + height / 2,
            end: posY - height / 2
        }
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    addForce(force) {
        this.v = {
            start: this.y - this.height,
            end: this.y + this.height
        }
        if (this.v.end <= cH - 10) {
            this.acceleration += force / this.mass;
            this.acceleration += this.gravity;
            this.y += this.acceleration;
        } else {
            this.acceleration = 0;
        }
    }

    update() {
        this.draw();
    }

    onClickDown(functif, functelse) {
        let h = {
            start: this.h.start,
            end: this.h.end
        }
        let v = {
            start: this.v.start,
            end: this.v.end
        }
        let offsetLeft = Number(window.getComputedStyle(canvas).marginLeft.replace('px', ''));
        let offsetTop = Number(window.getComputedStyle(canvas).marginTop.replace('px', ''));

        canvas.addEventListener('mousedown', (function (e) {
            let clickedX = e.clientX - offsetLeft;
            let clickedY = e.clientY - offsetTop;

            if (clickedX > h.start && clickedX < h.end && clickedY < v.start && clickedX > v.end) {
                functif();
            } else {
                functelse();
            }
        }));
    }

    onClickUp(functif, functelse) {
        let h = {
            start: this.h.start,
            end: this.h.end
        }
        let v = {
            start: this.v.start,
            end: this.v.end
        }
        let offsetLeft = Number(window.getComputedStyle(canvas).marginLeft.replace('px', ''));
        let offsetTop = Number(window.getComputedStyle(canvas).marginTop.replace('px', ''));

        canvas.addEventListener('mouseup', (function (e) {
            let clickedX = e.clientX - offsetLeft;
            let clickedY = e.clientY - offsetTop;

            if (clickedX > h.start && clickedX < h.end && clickedY < v.start && clickedX > v.end) {
                functif();
            } else {
                functelse();
            }
        }));
    }

    onHover(functif, functelse) {
        let h = {
            start: this.h.start,
            end: this.h.end
        }
        let v = {
            start: this.v.start,
            end: this.v.end
        }
        let offsetLeft = Number(window.getComputedStyle(canvas).marginLeft.replace('px', ''));
        let offsetTop = Number(window.getComputedStyle(canvas).marginTop.replace('px', ''));

        canvas.addEventListener('mousemove', (function (e) {
            let clickedX = e.clientX - offsetLeft;
            let clickedY = e.clientY - offsetTop;

            if (clickedX > h.start && clickedX < h.end && clickedY < v.start && clickedX > v.end) {
                functif();
            } else {
                functelse();
            }
        }));
    }

    enableDragging() {
        if (this.draggable) {
            let isDragging = false;
            let offsetX, offsetY;
            let clickedX, clickedY;
            let elementGravity = this.gravity;
            let offsetLeft = Number(window.getComputedStyle(canvas).marginLeft.replace('px', ''));
            let offsetTop = Number(window.getComputedStyle(canvas).marginTop.replace('px', ''));

            canvas.addEventListener('mousedown', (e) => {
                clickedX = e.clientX - offsetLeft;
                clickedY = e.clientY - offsetTop;
                if (
                    clickedX >= this.posX &&
                    clickedX <= this.posX + this.width / graphics &&
                    clickedY >= this.posY &&
                    clickedY <= this.posY + this.height / graphics
                ) {
                    isDragging = true;
                    offsetX = clickedX - this.posX;
                    offsetY = clickedY - this.posY;
                }
            });

            canvas.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.gravity = 0;
                    this.posX = clickedX - offsetX;
                    this.posY = clickedY - offsetY;
                }
            });

            canvas.addEventListener('mouseup', () => {
                isDragging = false;
                this.gravity = elementGravity;
            });
        }
    }
}

/**
 * 
 * @param {Number} posX -please type X-position of Circle
 * @param {Number} posY -please type Y-position of Circle
 * @param {Number} radius -please type radius of Circle
 * @param {String} color -please type color of Circle with ""
 * @param {Number} alpha -please type alpha of Circle (don't mind if it is 1)
 */
export class circle {
    constructor(posX, posY, radius, color, alpha) {
        if (alpha == undefined) {
            alpha = 1;
        }

        this.x = posX * graphics;
        this.y = posY * graphics;
        this.radius = radius * graphics;
        this.color = color;
        this.alpha = alpha;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    update() {
        this.draw();
    }
}

/**
 * 
 * @param {Number} posX - Type X position of Equilateral Triangle
 * @param {Number} posY - Type Y position of Equilateral Triangle
 * @param {Number} length - Type length of sides in Eqilateral Triangle
 * @param {String} color - Please Type Color of Triangle with ""
 * 
 */
export class eqTriangle {
    constructor(posX, posY, length, color) {
        if (color == undefined) {
            color = 'white';
        }

        this.x = posX * graphics;
        this.y = posY * graphics;
        this.length = length * graphics;
        this.color = color;
        this.height = this.length * 0.125;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.moveTo(this.x, this.y - this.height / 2);
        ctx.lineTo(this.x + this.height, this.y + this.height);
        ctx.lineTo(this.x - this.height, this.y + this.height);
        ctx.lineTo(this.x, this.y - this.height / 2);
        ctx.fill();
    }

    update() {
        this.draw();
    }
}

/**
 * 
 * @param {Number} posX -please type X-position of Text
 * @param {Number} posY -please type Y-position of Text
 * @param {String} text -please type Text displays
 * @param {String} font -please type font and size of Text in the form "7px cursive"
 * @param {String} color -please type color of Rectangle with ""
 * @param {Number} alpha -please type alpha of Rectangle (don't mind if it is 1)
 */
export class text {
    constructor(posX, posY, text, font, color, alpha) {
        if (alpha == undefined) {
            alpha = 1;
        }

        this.x = posX * graphics;
        this.y = posY * graphics;
        this.text = text;
        this.font = font;
        this.color = color;
        this.alpha = alpha;
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

export class DrawImg {
    /**
     * 
     * @param {ImageSource} src - Type source of the image
     * @param {Number} sorX 
     * @param {Number} sorY 
     * @param {Number} sorW 
     * @param {Number} sorH 
     * @param {Number} draX 
     * @param {Number} draY 
     * @param {Number} draW 
     * @param {Number} draH 
     */
    constructor(src, sorX, sorY, sorW, sorH, draX, draY, draW, draH) {
        let img = new Image();
        img.src = src;
        img.onload = function (e) {
            ctx.drawImage(img, sorX, sorY, sorW, sorH, draX, draY, draW, draH);
        }
    }
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

export function clearCanvas() {
    ctx.clearRect(0, 0, cW, cH);
}

/**
 * 
 * @param {number} width - type width of canvas
 * @param {number} height - type height of canvas
 * @param {number} graphics - type the graphics for your game, higher graphics means higher quality and it will use more momory to run
 */
export function canvasSize(width, height, graphic = 1) {
    graphics = graphic;
    canvas.width = width * graphics;
    canvas.height = height * graphics;
    cW = canvas.width;
    cH = canvas.height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

/**
 * 
 * @param {string} size -please type with 'px'
 */
export function curvedCanvas(size) {
    canvas.style.borderRadius = size;
}

/**
 * 
 * @param {Function} funct - add function name to execute when mouse right button is down
 */
export function onMouseDown(funct) {
    canvas.addEventListener("mousedown", funct, false);
}

/**
 * 
 * @param {Function} funct - add function name to execute when mouse right button is up
 */
export function onMouseUp(funct) {
    canvas.addEventListener("mouseup", funct, false);
}

/**
 * 
 * @param {Function} funct - add function name to execute when mouse is moving
 */
export function onMouseMove(funct) {
    canvas.addEventListener("mousemove", funct, false);
}

/**
 * 
 * @param {Function} funct - add function name to execute when keybord key is down
 */
export function onKeyDown(funct) {
    canvas.addEventListener("keydown", funct, false);
}

/**
 * 
 * @param {Function} funct - add function name to execute when keybord key is up
 */
export function onKeyUp(funct) {
    canvas.addEventListener("keyup", funct, false);
}

/**
 * 
 * @param {Function} funct - add function name to execute when keybord key is pressed
 */
export function onKeyPress(funct) {
    canvas.addEventListener("keypress", funct, false);
}





// Classes
export class Character {
    /**
     * 
     * @param {Object} imgData -Type in curly brackets - src for Image source, and sx, sy, sw, sh, dx, dy, dw, dh as same as this name
     * @param {Integer} gravity -Type the gravity applied on character in Integer
     * @param {Integer} velocity -Type the velocity applied on character in Integer
     * @param {Object} swordData -Type in curly brackets - x, y, w, h, offset as same as this name
     */
    constructor(imgData, gravity, velocity, swordData) {
        this.imgData = imgData
        this.image = new Image();
        this.image.src = this.imgData.src;
        this.framesShown = 0;
        this.framesDelay = 7;
        this.gravity = gravity;
        this.velocity = velocity;
        this.sword = swordData;
        this.isAttacking;
    }

    draw() {
        ctx.drawImage(this.image, this.imgData.sx, this.imgData.sy, this.imgData.sw, this.imgData.sh, this.imgData.dx, this.imgData.dy, this.imgData.dw, this.imgData.dh);
    }
    update() {
        this.swordData.x = this.imgData.dx + this.swordData.x;
        this.swordData.y = this.imgData.dy + 50;
        this.draw();
        this.imgData.dy += this.gravity;
        this.imgData.dx += this.imgData.velocity;

        if (this.imgData.dy + this.imgData.dh + this.gravity >= cH - 32) {
            this.gravity = 0;
        } else this.gravity += extraGravity;

        this.framesShown++;
        if (this.imgData.frames > 1) {
            if (this.framesShown % this.framesDelay === 0) {
                if (this.imgData.sx / this.imgData.sw < this.frames - 1) {
                    this.imgData.sx += this.imgData.sw;
                } else {
                    this.imgData.sx = 0;
                }
            }
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}