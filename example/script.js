import * as DD from '../build/DD.js';

DD.setupCanvas(500, 500, 10, 'black');
DD.centerCanvas();
DD.curvedCanvas('11px');
const writings = new DD.text(15, 15, 'Hello World', '150px cursive', 'white');
let box = new DD.rect({
    posX: 222,
    posY: 0,
    width: 150,
    height: 300,
    color: 'Blue',
    features: { "draggable": true },
    alpha: 1,
    mass: 1,
});
const katta = new DD.rect({
    posX: 55,
    posY: 0,
    width: 50,
    height: 50,
    color: "yellow",
    features: { draggable: true },
    alpha: 1,
    mass: 1,
});
const vattam = new DD.circle(33, 277, 50, 'green');
const vattam2 = new DD.circle(333, 277, 50, 'red');
// const moola = new DD.eqTriangle(55, 55, 450);

// const newone = new DD.eqTriangle(200, 200, 300, 'red');

// const newone1 = new DD.eqTriangle(300, 300, 300, 'cyan');

function animate(){
    DD.clearCanvas();
    box.update();
    // moola.update();
    // newone.update();
    // newone1.update();
    vattam.update();
    vattam2.update();
    writings.update();
    katta.update();

    requestAnimationFrame(animate);
}

animate();