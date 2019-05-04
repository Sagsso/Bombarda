class Player {
    constructor(name, namePlayer, element, control, radius, image, ap = {}) {
        this.image = image;
        this.name = name;
        this.namePlayer = namePlayer;
        this.control = control;
        this.element = element;
        this.label = this.getLabel();
        this.radius = radius;
        this.potenciaBomba = 2;
        this.inmune = false;
        this.vidas = 4;
        this.score = 0;
        this.vy = 0;
        this.vx = 7;
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
                wireframe: false,
                map: THREE.ImageUtils.loadTexture('assets/textures/personajes.jpg'), transparent: true, opacity: 1
            });



            var caja = new THREE.Mesh(
                new THREE.BoxGeometry(50, 50, 50),
                new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false, transparent: true, opacity: 0.0 })
            );


            let imgHP = () => {
                var UV5 = {


                    Harry: [
                        new THREE.Vector2(0.0, 0.5),
                        new THREE.Vector2(0.0, 0.0),
                        new THREE.Vector2(0.22, 0.0),
                        new THREE.Vector2(0.22, 0.5)

                    ]

                };

                //Mapeo de las texturas sobre las caras
                geometry.faceVertexUvs[0] = [];
                geometry.faceVertexUvs[0][8] = [
                    UV5.Harry[0],
                    UV5.Harry[1],
                    UV5.Harry[3]
                ];
                geometry.faceVertexUvs[0][9] = [
                    UV5.Harry[1],
                    UV5.Harry[2],
                    UV5.Harry[3]
                ];
                geometry.faceVertexUvs[0][0] = [
                    UV5.Harry[0],
                    UV5.Harry[1],
                    UV5.Harry[3]
                ];
                geometry.faceVertexUvs[0][1] = [
                    UV5.Harry[1],
                    UV5.Harry[2],
                    UV5.Harry[3]
                ];
                geometry.faceVertexUvs[0][2] = [
                    UV5.Harry[0],
                    UV5.Harry[1],
                    UV5.Harry[3]
                ];
                geometry.faceVertexUvs[0][3] = [
                    UV5.Harry[1],
                    UV5.Harry[2],
                    UV5.Harry[3]
                ];
                geometry.faceVertexUvs[0][10] = [
                    UV5.Harry[0],
                    UV5.Harry[1],
                    UV5.Harry[3]
                ];
                geometry.faceVertexUvs[0][11] = [
                    UV5.Harry[1],
                    UV5.Harry[2],
                    UV5.Harry[3]
                ];
            }

            let imgSirius = () => {
                var UV6 = {


                    Snape: [
                        new THREE.Vector2(0.25, 0.5),
                        new THREE.Vector2(0.25, 0.0),
                        new THREE.Vector2(0.48, 0.0),
                        new THREE.Vector2(0.48, 0.5)

                    ]

                }

                //Mapeo de las texturas sobre las caras
                geometry.faceVertexUvs[0] = [];
                geometry.faceVertexUvs[0][8] = [
                    UV6.Snape[0],
                    UV6.Snape[1],
                    UV6.Snape[3]
                ];
                geometry.faceVertexUvs[0][9] = [
                    UV6.Snape[1],
                    UV6.Snape[2],
                    UV6.Snape[3]
                ];
                geometry.faceVertexUvs[0][0] = [
                    UV6.Snape[0],
                    UV6.Snape[1],
                    UV6.Snape[3]
                ];
                geometry.faceVertexUvs[0][1] = [
                    UV6.Snape[1],
                    UV6.Snape[2],
                    UV6.Snape[3]
                ];
                geometry.faceVertexUvs[0][2] = [
                    UV6.Snape[0],
                    UV6.Snape[1],
                    UV6.Snape[3]
                ];
                geometry.faceVertexUvs[0][3] = [
                    UV6.Snape[1],
                    UV6.Snape[2],
                    UV6.Snape[3]
                ];
                geometry.faceVertexUvs[0][10] = [
                    UV6.Snape[0],
                    UV6.Snape[1],
                    UV6.Snape[3]
                ];
                geometry.faceVertexUvs[0][11] = [
                    UV6.Snape[1],
                    UV6.Snape[2],
                    UV6.Snape[3]
                ];
            }

            let imgVoldi = () => {
                var UV7 = {

                    Volde: [
                        new THREE.Vector2(0.50, 0.5),
                        new THREE.Vector2(0.50, 0.0),
                        new THREE.Vector2(0.75, 0.0),
                        new THREE.Vector2(0.75, 0.5)

                    ]

                }

                //Mapeo de las texturas sobre las caras
                geometry.faceVertexUvs[0] = [];
                geometry.faceVertexUvs[0][8] = [
                    UV7.Volde[0],
                    UV7.Volde[1],
                    UV7.Volde[3]
                ];
                geometry.faceVertexUvs[0][9] = [
                    UV7.Volde[1],
                    UV7.Volde[2],
                    UV7.Volde[3]
                ];

                geometry.faceVertexUvs[0][0] = [
                    UV7.Volde[0],
                    UV7.Volde[1],
                    UV7.Volde[3]
                ];
                geometry.faceVertexUvs[0][1] = [
                    UV7.Volde[1],
                    UV7.Volde[2],
                    UV7.Volde[3]
                ];
                geometry.faceVertexUvs[0][2] = [
                    UV7.Volde[0],
                    UV7.Volde[1],
                    UV7.Volde[3]
                ];
                geometry.faceVertexUvs[0][3] = [
                    UV7.Volde[1],
                    UV7.Volde[2],
                    UV7.Volde[3]
                ];
                geometry.faceVertexUvs[0][10] = [
                    UV7.Volde[0],
                    UV7.Volde[1],
                    UV7.Volde[3]
                ];
                geometry.faceVertexUvs[0][11] = [
                    UV7.Volde[1],
                    UV7.Volde[2],
                    UV7.Volde[3]
                ];
            }

            let imgDementor = () => {
                var UV8 = {

                    Demen: [
                        new THREE.Vector2(0.78, 0.5),
                        new THREE.Vector2(0.78, 0.0),
                        new THREE.Vector2(1.0, 0.0),
                        new THREE.Vector2(1.0, 0.5)

                    ],

                }

                //Mapeo de las texturas sobre las caras
                geometry.faceVertexUvs[0] = [];
                geometry.faceVertexUvs[0][8] = [
                    UV8.Demen[0],
                    UV8.Demen[1],
                    UV8.Demen[3]
                ];
                geometry.faceVertexUvs[0][9] = [
                    UV8.Demen[1],
                    UV8.Demen[2],
                    UV8.Demen[3]
                ];
                geometry.faceVertexUvs[0][0] = [
                    UV8.Demen[0],
                    UV8.Demen[1],
                    UV8.Demen[3]
                ];
                geometry.faceVertexUvs[0][1] = [
                    UV8.Demen[1],
                    UV8.Demen[2],
                    UV8.Demen[3]
                ];
                geometry.faceVertexUvs[0][2] = [
                    UV8.Demen[0],
                    UV8.Demen[1],
                    UV8.Demen[3]
                ];
                geometry.faceVertexUvs[0][3] = [
                    UV8.Demen[1],
                    UV8.Demen[2],
                    UV8.Demen[3]
                ];
                geometry.faceVertexUvs[0][10] = [
                    UV8.Demen[0],
                    UV8.Demen[1],
                    UV8.Demen[3]
                ];
                geometry.faceVertexUvs[0][11] = [
                    UV8.Demen[1],
                    UV8.Demen[2],
                    UV8.Demen[3]
                ];
            }
            var num = 0;
            var creado = false;
            for (const player of Object.keys(players)) {
                if (players[player] == null && !creado) {
                    switch (num) {
                        case 0:
                            switch (this.image) {
                                case "harry":
                                    imgHP();
                                    break;
                                case "sirius":
                                    imgSirius();
                                    break;
                                case "voldi":
                                    imgVoldi();
                                    break;
                                case "dementor":
                                    imgDementor();
                                    break;
                                default:
                                    break;
                            }

                            var object1 = new THREE.Mesh(geometry, material);
                            object1.castShadow = true;
                            object1.receiveShadow = true;
                            this.position = { x: 1425, y: 25, z: 1425 };
                            console.log(this.position);
                            object1.position.set(this.position.x, this.position.y, this.position.z);
                            creado = true;
                            break;
                        case 1:
                            switch (this.image) {
                                case "harry":
                                    imgHP();
                                    break;
                                case "sirius":
                                    imgSirius();
                                    break;
                                case "voldi":
                                    imgVoldi();
                                    break;
                                case "dementor":
                                    imgDementor();
                                    break;
                                default:
                                    break;
                            }
                            var object1 = new THREE.Mesh(geometry, material);
                            object1.castShadow = true;
                            object1.receiveShadow = true;
                            this.position = { x: -1425, y: 25, z: 1425 };
                            object1.position.set(this.position.x, this.position.y, this.position.z);
                            creado = true;
                            break;
                        case 2:

                            switch (this.image) {
                                case "harry":
                                    imgHP();
                                    break;
                                case "sirius":
                                    imgSirius();
                                    break;
                                case "voldi":
                                    imgVoldi();
                                    break;
                                case "dementor":
                                    imgDementor();
                                    break;
                                default:
                                    break;
                            }

                            var object1 = new THREE.Mesh(geometry, material);
                            object1.castShadow = true;
                            object1.receiveShadow = true;
                            this.position = { x: -1425, y: 25, z: -1425 };
                            object1.position.set(this.position.x, this.position.y, this.position.z);
                            creado = true;
                            break;
                        case 3:
                            switch (this.image) {
                                case "harry":
                                    imgHP();
                                    break;
                                case "sirius":
                                    imgSirius();
                                    break;
                                case "voldi":
                                    imgVoldi();
                                    break;
                                case "dementor":
                                    imgDementor();
                                    break;
                                default:
                                    break;
                            }
                            var object1 = new THREE.Mesh(geometry, material);
                            object1.castShadow = true;
                            object1.receiveShadow = true;
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
    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
        let uiElement = document.querySelector(`#${this.name} .score`);
        console.log(uiElement)
        if (uiElement != undefined) {
            uiElement.innerHTML = this.score;
            console.log("creado")
        }
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
        let uiElement = document.querySelector(`#${this.namePlayer} .name`);
        console.log(uiElement);
        if (uiElement != undefined) {
            uiElement.innerHTML = this.name;
        }
    }

    setUpUI() {
        //wrapper
        let playerUI = document.createElement("div");
        playerUI.id = this.namePlayer;
        playerUI.classList.add("playerUI");

        //Name
        let playerName = document.createElement("div");
        playerName.classList.add("name");
        playerName.innerHTML = this.name;

        //Score
        let scoreField = document.createElement("div");
        scoreField.classList.add("score");
        scoreField.innerHTML = this.score;

        playerUI.appendChild(playerName);
        playerUI.appendChild(scoreField);

        let jugadores = document.querySelector(".wrapper");
        jugadores.appendChild(playerUI);
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
        this.setUpUI();
    }

}