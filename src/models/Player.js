class Player {
    constructor(name, element, control, radius, ap = {}) {
        this.name = name;
        this.control = control;
        this.element = element;
        this.label = this.getLabel();
        this.radius = radius;
        this.potenciaBomba = 2;
        this.inmune = false;
        this.vidas = 4;
        this.score = 0;
        this.vy = 0;
        this.vx = 5;
        this.m = 2;
        this.position = {
            x: null,
            y: null,
            z: null,
        };

        if ("label" in ap) {
            if (ap.label) {
                this.showLabel();
            }
        }
    }

    set element(mesh) {
        if (mesh instanceof THREE.Mesh) {
            this._element = mesh;
        } else {

            let geometry = new THREE.BoxGeometry(50, 50, 50);
            let material = new THREE.MeshPhongMaterial({
                color: 0x3498db,
                wireframe: false,
                transparent: true
            });

            var object1 = new THREE.Mesh(geometry, material);
            object1.castShadow = true;
            object1.receiveShadow = true;

            var caja = new THREE.Mesh(
                new THREE.BoxGeometry(50, 50, 50),
                new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false, transparent: true, opacity: 0.0 })
            );


            var num = 0;
            var creado = false;
            for (const player of Object.keys(players)) {
                if (players[player] == null && !creado) {
                    switch (num) {
                        case 0:
                            this.position = { x: 1425, y: 25, z: 1425 };
                            console.log(this.position);
                            object1.position.set(this.position.x, this.position.y, this.position.z);
                            creado = true;
                            break;
                        case 1:
                            this.position = { x: -1425, y: 25, z: 1425 };
                            object1.position.set(this.position.x, this.position.y, this.position.z);
                            creado = true;
                            break;
                        case 2:
                            this.position = { x: -1425, y: 25, z: -1425 };
                            object1.position.set(this.position.x, this.position.y, this.position.z);
                            creado = true;
                            break;
                        case 3:
                            this.position = { x: 1425, y: 25, z: -1425 };
                            object1.position.set(this.position.x, this.position.y, this.position.z);
                            creado = true;
                            break;
                    }
                }
                num++;
                if (creado) {
                    break;
                }
            }

            // console.log(object1.position);
            // object1.name = "Player";


            object1.add(caja);
            this._element = object1;

            this._element.name = "Player";
            collidableDestructible.push(this._element);
            console.log(this._element.name);
        }
        this.control.element = this._element;
        // collidableList.push(this.control.element);
    }

    get element() {
        return this._element;
    }
    // get control() {
    //     return this._control;
    // }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

    updateControls() {
        this.control.update(this.vx, this.vy, this.m, 90, this.potenciaBomba);
    }

    savePosRespawn() {
        this.position.x = this.element.position.x;
        this.position.y = this.element.position.y;
        this.position.z = this.element.position.z;
    }
    getLabel() {
        return Utilities.label(
            this.element.position,
            Utilities.textTure(this.name, 10, "Bold", "10px", "Arial", "0,0,0,1", 64, 50)
        )
    }

    showLabel() {
        this.element.add(this.label);
    }

    play(scene) {
        // console.log('Jugador');
        // console.log(this);
        this.collidableBox = new CollidableBox(this._element, 25);
        scene.add(this.element);
    }

}