class Player {
    constructor(name, element, control, ap = {}) {
        this.name = name;
        this.control = control;
        this.element = element;
        this.label = this.getLabel();
        this.radius = 25;

        this.vy = 0;
        this.vx = 2;
        this.m = 2;

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
            let geometry = new THREE.SphereGeometry(25, 32, 32);
            let material = new THREE.MeshPhongMaterial({
                color: 0x3498db,
                wireframe: false
            });
            var object1 = new THREE.Mesh(geometry, material);
            object1.castShadow = true;
            object1.receiveShadow = true;
            object1.position.x = 1475;
            object1.position.y = 25;
            object1.position.z = 1475;

            console.log(object1.position);
            this._element = object1;
        }
        this.control.element = this._element;
    }

    get element() {
        return this._element;
    }

    updateControls() {
        this.control.update(this.vx, this.vy, this.m, 90);
    }

    getLabel() {
        return Utilities.label(
            this.element.position,
            Utilities.textTure(this.name, 128, "Bold", "10px", "Arial", "0,0,0,1", 64, 50)
        )
    }

    showLabel() {
        this.element.add(this.label);
    }

    play(scene) {
        this.collidableBox = new CollidableBox(this._element, this.radius);
        scene.add(this.element);
    }
}