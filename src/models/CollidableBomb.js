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
        if (playerOwner.element.position.x == this.mesh.position.x && playerOwner.element.position.z == this.mesh.position.z) {
            if (!playerOwner.inmune) {
                if (playerOwner.vidas >= 2) {
                    playerOwner.vidas -= 1;
                    playerOwner.element.position.set(playerOwner.position.x, playerOwner.position.y, playerOwner.position.z);
                } else if (playerOwner.vidas == 1) {
                    playerOwner.vidas -= 1;
                    scene.remove(playerOwner.element);
                    for (const player of Object.keys(players)) {
                        if (players[player] != null) {
                            if (playerOwner == players[player]) {
                                players[player] = null;
                            }
                        }
                    }
                } else {
                    scene.remove(playerOwner.element);
                    playerOwner = null;
                }
            }
            let dead = new Sound(["./assets/songs/dead.wav"]);
            let soundDead = () => dead.play();
            setTimeout(soundDead, 200);
        }
    }

    collideLeft(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
        }
        this.collide({ x: 1, y: 0, z: 0 }, callback, player);
    }

    collideRight(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
        }
        this.collide({ x: -1, y: 0, z: 0 }, callback, player);
    }
    collideFront(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
        }
        this.collide({ x: 0, y: 0, z: 1 }, callback, player);
    }

    collideBack(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
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
        for (const player of Object.keys(players)) {
            if (players[player].element == intersections[0].object) {
                if (!players[player].inmune) {
                    if (players[player].vidas >= 2) {
                        players[player].vidas -= 1;
                        players[player].element.position.set(players[player].position.x, players[player].position.y, players[player].position.z);
                    } else if (players[player].vidas == 1) {
                        players[player].vidas -= 1;
                        scene.remove(players[player].element);
                        players[player] = null;
                    } else {
                        scene.remove(players[player].element);
                        players[player] = null;
                    }
                    if (playerOwner != players[player] && players[player] != null) {
                        playerOwner.score += 50;
                    }
                    let dead = new Sound(["./assets/songs/dead.wav"]);
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