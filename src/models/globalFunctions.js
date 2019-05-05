document.onkeydown = (e) => {
    // mySound3D.play();
    // mySound3D2.play();
    // mySound3D3.play();
    // mySound3D4.play();

    //cámara default
    if (e.key == "1") {
        console.log('Camera default puesta');
        console.log(cameras.default.cam.position);
        resetIsCurrent(cameras);//Aquí todas las cámaras tiene isCurren = false;
        cameras.default.isCurrent = true;//Aquí la default isCurrent
        cameras.current.cam = cameras.default.cam;
        cameraControl = new THREE.OrbitControls(cameras.current.cam, renderer.domElement);
    }
    // if (e.key == "2") {
    //     console.log('Camera camera2 puesta');
    //     cameras.current.cam = cameras.camera2.cam;//Aquí todas las cámaras tiene isCurren = false;
    //     resetIsCurrent(cameras);//Aquí la cámara 2 es la incurrent
    //     cameras.camera2.isCurrent = true;
    //     cameraControl = new THREE.OrbitControls(cameras.current.cam, renderer.domElement);
    // }
    // if (e.key == "3") {
    //     console.log('Camera camera3 puesta');
    //     cameras.current.cam = cameras.camera3.cam;//Aquí todas las cámaras tiene isCurren = false;
    //     resetIsCurrent(cameras);//Aquí la cámara 3 es la incurrent
    //     cameras.camera3.isCurrent = true;
    //     cameraControl = new THREE.OrbitControls(cameras.current.cam, renderer.domElement);
    // }
    // if (e.key == "4") {
    //     console.log('Camera camera4 puesta');
    //     cameras.current.cam = cameras.camera4.cam;//Aquí todas las cámaras tiene isCurren = false;
    //     resetIsCurrent(cameras);//Aquí la cámara 3 es la incurrent
    //     cameras.camera4.isCurrent = true;
    //     cameraControl = new THREE.OrbitControls(cameras.current.cam, renderer.domElement);
    // }
    // if (e.key == "5") {
    //     console.log('Camera camera5 puesta');
    //     cameras.current.cam = cameras.camera5.cam;//Aquí todas las cámaras tiene isCurren = false;
    //     resetIsCurrent(cameras);//Aquí la cámara 3 es la incurrent
    //     cameras.camera5.isCurrent = true;
    //     cameraControl = new THREE.OrbitControls(cameras.current.cam, renderer.domElement);
    // }

    for (let i = 0; i < Object.keys(players).length; i++) {
        let key = Object.keys(players)[i];
        if (players[key] == null) { return false; }
        let elControl = players[key]["control"];
        //console.log(`Tecla presionada: ${e.key} Tecla up de este jugador ${elControl.up}`)
        switch (e.key) {
            case elControl.up:
                elControl.pressUp();
                break;
            case elControl.right:
                elControl.pressRight();
                break;
            case elControl.down:
                elControl.pressDown();
                break;
            case elControl.left:
                elControl.pressLeft();
                break;
            case elControl.jump:
                elControl.pressJump();
                break;
            case elControl.placeBomb:
                elControl.pressBomb();
                break;
            default:
                break;
        }

    }



}

document.onkeyup = (e) => {
    //console.log(Object.keys(players));
    for (let i = 0; i < Object.keys(players).length; i++) {

        let key = Object.keys(players)[i];
        if (players[key] == null) { return false; }
        let elControl = players[key]["control"];

        switch (e.key) {
            case elControl.up:
                elControl.releaseUp();
                break;
            case elControl.right:
                elControl.releaseRight();
                break;
            case elControl.down:
                elControl.releaseDown();
                break;
            case elControl.left:
                elControl.releaseLeft();
                break;
            case elControl.jump:
                elControl.releaseJump();
                break;
            case elControl.placeBomb:
                elControl.releasePlaceBomb();
                break;
            default:
                break;
        }
    }


}
