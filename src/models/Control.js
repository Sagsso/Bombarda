class Control {
    //myControl = new Control("w","d","s","a");
    constructor(up, right, down, left, jump, placeBomb) {
        this.initControls();
        this.up = up || "w";
        this.right = right || "d";
        this.down = down || "s";
        this.left = left || "a";
        this.velocity = 10;
        this.jump = jump || " ";
        this.placeBomb = placeBomb || "e";
        this.capacityBombs = 1;
        this.isInAir = false;
        this.isFalling = false;
        this.isJumping = false;
        this.availableBomb = true;
        this.element = null;

        this.player = null;

        this.initListeners();
    }

    set up(key) {
        this._up.key = key;
    }

    get up() {
        return this._up.key;
    }

    set right(key) {
        this._right.key = key;
    }

    get right() {
        return this._right.key;
    }

    set down(key) {
        this._down.key = key;
    }

    get down() {
        return this._down.key;
    }

    set left(key) {
        this._left.key = key;
    }

    get left() {
        return this._left.key;
    }

    set jump(key) {
        this._jump.key = key;
    }

    get jump() {
        return this._jump.key;
    }
    set placeBomb(key) {
        this._placeBomb.key = key;
    }

    get placeBomb() {
        return this._placeBomb.key;
    }

    initControls() {
        this._up = { key: "", isPressed: false };
        this._right = { key: "", isPressed: false };
        this._down = { key: "", isPressed: false };
        this._left = { key: "", isPressed: false };
        this._jump = { key: "", isPressed: false };
        this._placeBomb = { key: "", isPressed: false };
    }

    initListeners() {


    }



    update(vx, vy, m, jf, units) {
        this.velocity = vx;
        this.vy = vy;
        this.m = m;
        this.jumpForce = jf;

        if (this._up.isPressed) {
            this.element.position.z -= this.velocity;
        }
        if (this._right.isPressed) {
            this.element.position.x += this.velocity;
        }
        if (this._down.isPressed) {
            this.element.position.z += this.velocity;
        }
        if (this._left.isPressed) {
            this.element.position.x -= this.velocity;
        }
        if (this._placeBomb.isPressed && !this.isInAir) {

            let sumarBombas = () => this.capacityBombs += 1;
            let activarBombas = () => this.availableBomb = true;
            let boom = () => {
                collidableBomb.collideLeft(this.player);
                collidableBomb.collideRight(this.player);
                collidableBomb.collideFront(this.player);
                collidableBomb.collideBack(this.player);
                collidableBomb.collideIn(this.player);

                var pos = collidableList.indexOf(group);
                collidableList.splice(pos, 1);
                scene.remove(group);

            }

            if (this.capacityBombs > 0 && this.availableBomb) {
                let x = this.element.position.x;
                let y = this.element.position.y;
                let z = this.element.position.z;
                let geometry = new THREE.SphereGeometry(25, 32, 32);
                let material = new THREE.MeshPhongMaterial({
                    color: 0x000000,
                    wireframe: false,
                    transparent: false
                });
                var bomb = new THREE.Mesh(geometry, material);
                bomb.castShadow = true;
                bomb.receiveShadow = true;

                bomb.position.x = x;
                bomb.position.y = y;
                bomb.position.z = z;

                var boxBombMTL = new THREE.MeshPhongMaterial({ transparent: true, opacity: 0 });
                var boxBombGEO = new THREE.BoxGeometry(50, 50, 50);
                var boxBomb = new THREE.Mesh(boxBombGEO, boxBombMTL);

                boxBomb.position.x = x;
                boxBomb.position.y = y;
                boxBomb.position.z = z;
                var group = new THREE.Group();
                group.add(bomb);
                group.add(boxBomb);

                scene.add(group);
                collidableList.push(boxBomb);
                this.capacityBombs -= 1;
                this.availableBomb = false;
                var collidableBomb = new CollidableBomb(boxBomb, 25, units);
                let renderLights = () => {
                    for (var i = 1; i <= units; i++) {
                        var c2 = 0x50bdff;
                        var intensity = 5.5;
                        var distance = 100;
                        var decay = 2.0;
                        var light = new THREE.PointLight(c2, intensity, distance, decay);
                        light.position.x = x;
                        light.position.y = y;
                        light.position.z = z;
                        // scene.add(light);

                        // setTimeout(disappearBoom, 200, light);
                        createExplode(x + (50 * i), y, z);
                        createExplode(x - (50 * i), y, z);
                        createExplode(x, y, z + (50 * i));
                        createExplode(x, y, z - (50 * i));

                    }
                    let bombSound = new Sound(["./assets/songs/Bomb.mp3"]);
                    bombSound.play();

                };

                let disappearBoom = (explode) => {
                    scene.remove(explode);
                }

                let createExplode = (x, y, z) => {
                    var c2 = 0x50bdff;
                    var sphere = new THREE.SphereGeometry(25);
                    var material = new THREE.MeshBasicMaterial({ opacity: 1, transparent: true, map: THREE.ImageUtils.loadTexture('assets/personajes/flame.png') })
                    var explode = new THREE.Mesh(sphere, material);
                    explode.position.x = x;
                    explode.position.y = y;
                    explode.position.z = z;
                    scene.add(explode);

                    // while (material.opacity != 0) {
                    //     material.opacity -= 0.1;
                    // }
                    // disminuirLuz(light);
                    TweenLite.to(explode.material, 2, { opacity: 0 });
                    // TweenLite.to(explode.light.intensity, 1, { intensity: 0.0 });
                    setTimeout(disappearBoom, 2000, explode);
                    // return explode;
                }


                setTimeout(sumarBombas, 4000);
                setTimeout(boom, 4000);
                setTimeout(activarBombas, 500);
                setTimeout(renderLights, 4000);
            }



        }
        if (this._jump.isPressed) {
            if (!this.isJumping && !this.isInAir) {
                this.isJumping = true;
                this.element.position.y += this.jumpForce;
                let jump = new Sound(["./assets/songs/jump.wav"]);
                jump.play();
            }
        }
    }

    pressUp() {
        this._up.isPressed = true;
    }
    pressRight() {
        this._right.isPressed = true;
    }
    pressDown() {
        this._down.isPressed = true;
    }
    pressLeft() {
        this._left.isPressed = true;
    }
    pressJump() {
        this._jump.isPressed = true;
    }
    pressBomb() {
        this._placeBomb.isPressed = true;
    }

    releaseUp() {
        this._up.isPressed = false;
    }
    releaseRight() {
        this._right.isPressed = false;
    }
    releaseDown() {
        this._down.isPressed = false;
    }
    releaseLeft() {
        this._left.isPressed = false;
    }
    releaseJump() {
        this._jump.isPressed = false;
    }
    releasePlaceBomb() {
        this._placeBomb.isPressed = false;
    }

}

//Esta función es la magia, pone false al isCurrent de todas las cámaras
function resetIsCurrent(object) {
    for (const key in object) {
        object[key].isCurrent = false;
        console.log(object[key].isCurrent)
    }
}



// function bombToCollidableList(bomb){
//     this.collidableList.push(bomb);
//     console.log('añadida')
// }
