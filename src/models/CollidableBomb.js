class CollidableBomb {
    constructor(mesh, boundingRadius, units) {
        this.mesh = mesh;
        this.collidableRadius = boundingRadius;
        this.units = units;
        this.isFalling = { state: false, acc: 0 };
        // this.initBoundingMesh(this.mesh);
    }

    initBoundingMesh(mesh) {
        console.log(mesh);
        this.collidableRadius = mesh.geometry.boundingSphere.radius;
    }

    collide(normal, callback, player) {
        let collidableRay = new THREE.Raycaster();
        collidableRay.ray.direction.set(normal.x, normal.y, normal.z);

        let origin = this.mesh.position.clone();
        collidableRay.ray.origin.copy(origin);

        let intersections = collidableRay.intersectObjects(collidableDestructible);
        // let intersectPowerUps = collidableRay.intersectObjects(powerUpList);


        if (intersections.length > 0) {
            let distance = intersections[0].distance;
            if (distance <= (this.units * 52) + this.collidableRadius) {
                callback(intersections, player);
            }
        }


    }

    collideIn(playerOwner) {
        console.log(playerOwner);
        console.log(this.mesh);
        if (playerOwner.element.position.x == this.mesh.position.x && playerOwner.element.position.z == this.mesh.position.z) {
            playerOwner.vidas -= 1;
            if (playerOwner.vidas > 0) {
                playerOwner.element.position.set(playerOwner.position.x, playerOwner.position.y, playerOwner.position.z);
            } else {
                scene.remove(playerOwner.element);
            }
            console.log('Quitó vidas y posicionó');
            console.log('Puntaje');
            console.log(`El puntaje de ${playerOwner.name} es ${playerOwner.score}`);
            let dead = new Sound(["./assets/songs/dead.wav"], 15, scene, {
                debug: true,
                position: { x: 50, y: 0, z: 0 }
            });
            let soundDead = () => dead.play();
            setTimeout(soundDead, 200);
        }
    }

    collideLeft(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
            console.log('eliminados Left');
        }
        this.collide({ x: 1, y: 0, z: 0 }, callback, player);
    }

    collideRight(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
            console.log('eliminados Right');
        }
        this.collide({ x: -1, y: 0, z: 0 }, callback, player);
    }
    collideFront(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
            console.log('eliminados Front');
        }
        this.collide({ x: 0, y: 0, z: 1 }, callback, player);
    }

    collideBack(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
            console.log('eliminados Back');
        }
        this.collide({ x: 0, y: 0, z: -1 }, callback, player);
    }

    update() {
        this.collideLeft();
        this.collideRight();
        this.collideFront();
        this.collideBack();
        this.collideBottom();
    }
}

function deleteObjects(intersections, playerOwner) {
    if (intersections[0].object.name == "Player") {
        console.log('Explotó Player');
        for (const player of Object.keys(players)) {
            if (players[player].element == intersections[0].object) {
                if (!players[player].inmune) {
                    if (players[player].vidas > 0) {
                        players[player].vidas -= 1;
                        players[player].element.position.set(players[player].position.x, players[player].position.y, players[player].position.z);
                    } else {
                        scene.remove(players[player].element);
                    }
                    if (playerOwner != players[player]) {
                        players[player].score += 50;
                    }
                    console.log('Quitó vidas y posicionó');
                    console.log('Puntaje');
                    console.log(`El puntaje de ${playerOwner.name} es ${playerOwner.score} y sus vidas ${playerOwner.vidas}`);
                    let dead = new Sound(["./assets/songs/dead.wav"], 15, scene, {
                        debug: true,
                        position: { x: 50, y: 0, z: 0 }
                    });
                    let soundDead = () => dead.play();
                    setTimeout(soundDead, 200);

                }
            }
        }
    } else {
        var posCD = collidableDestructible.indexOf(intersections[0].object);
        collidableDestructible.splice(posCD, 1);
        var pos = collidableList.indexOf(intersections[0].object);
        collidableList.splice(pos, 1);
        scene.remove(intersections[0].object);
    }
}