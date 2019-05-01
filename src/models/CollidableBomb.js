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
            if (distance <= (this.units * 50) + this.collidableRadius) {
                callback(intersections, player);
            }
        }


    }



    collideLeft(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
            console.log('eliminados');
        }
        this.collide({ x: 1, y: 0, z: 0 }, callback, player);
    }

    collideRight(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
            console.log('eliminados');
        }
        this.collide({ x: -1, y: 0, z: 0 }, callback, player);
    }
    collideFront(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
            console.log('eliminados');
        }
        this.collide({ x: 0, y: 0, z: 1 }, callback, player);
    }

    collideBack(player) {
        let callback = (intersections, player) => {
            deleteObjects(intersections, player);
            console.log('eliminados');
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
                    players[player].vidas -= 1;
                    players[player].element.position.set(0, 200, 0);
                    playerOwner.score += 50;
                    console.log('Quitó vidas y posicionó');
                    console.log('Puntaje');
                    console.log(`El puntaje de ${playerOwner.name} es ${playerOwner.score}`);
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