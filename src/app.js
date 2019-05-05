/**
 * GLOBAL VARS
 */


centesimas = 0;
segundos = 0;
minutos = 0;
horas = 0;
var cronos;
var tiempo;
function init() {
    cronos = setInterval(function () { timer() }, 1000);
}
function timer() {
    seconds = document.getElementById('Segundos');
    minutes = document.getElementById('Minutos');
    tiempo = parseInt(seconds.value);
    if (minutes.value != 3) {
        if (tiempo == 59) {
            seconds.innerHTML = ":00";
            seconds.value = "0";
            minutes.innerHTML = "0" + (parseInt(minutes.value) + 1);
            minutes.value = parseInt(minutes.value) + 1;
        } else {
            seconds.value = eval(tiempo + 1);
            if (seconds.value < 10) {
                seconds.innerHTML = ":0" + seconds.value;
            } else {
                seconds.innerHTML = ":" + seconds.value;
            }
        }
    }
}

minutosDiv = document.createElement("div");
minutosDiv.value = "0";
minutosDiv.id = "Minutos";
minutosDiv.classList = "reloj";
minutosDiv.innerHTML = "00";

segundosDiv = document.createElement("div");
segundosDiv.value = "0";
segundosDiv.id = "Segundos";
segundosDiv.classList = "reloj";
segundosDiv.innerHTML = ":00";

// centesimasDiv = document.createElement("div");
// centesimasDiv.id = "Centesimas";
// centesimasDiv.classList = "reloj";
// centesimasDiv.innerHTML = ":00";

let contenedor = document.querySelector(".contenedor");
contenedor.appendChild(minutosDiv);
contenedor.appendChild(segundosDiv);
// contenedor.appendChild(centesimasDiv);

volume = 0.5;

function changeVolume() {
    var volu3 = document.getElementById('myRange');
    var x = volu3.value;
    volume = x;
    console.log(volume);
}
// function parar() {
//     clearInterval(control);
//     document.getElementById("parar").disabled = true;
//     document.getElementById("continuar").disabled = false;
// }
// function reinicio() {
//     clearInterval(control);
//     centesimas = 0;
//     segundos = 0;
//     minutos = 0;
//     horas = 0;
//     Centesimas.innerHTML = ":00";
//     Segundos.innerHTML = ":00";
//     Minutos.innerHTML = ":00";
//     Horas.innerHTML = "00";
//     document.getElementById("inicio").disabled = false;
//     document.getElementById("parar").disabled = true;
//     document.getElementById("continuar").disabled = true;
//     document.getElementById("reinicio").disabled = true;
// }
function cronometro() {
    if (centesimas < 99) {
        centesimas++;
        if (centesimas < 10) { centesimas = "0" + centesimas }
        Centesimas.innerHTML = ":" + centesimas;
    }
    if (centesimas == 99) {
        centesimas = -1;
    }
    if (centesimas == 0) {
        segundos++;
        if (segundos < 10) { segundos = "0" + segundos }
        segundosDiv.innerHTML = ":" + segundos;
    }
    if (segundos == 59) {
        segundos = -1;
    }
    if ((centesimas == 0) && (segundos == 0)) {
        minutos++;
        if (minutos < 10) { minutos = "0" + minutos }
        minutosDiv.innerHTML = ":" + minutos;
    }
    if (minutos == 59) {
        minutos = -1;
    }
    if ((centesimas == 0) && (segundos == 0) && (minutos == 0)) {
        horas++;
        if (horas < 10) { horas = "0" + horas }
        // Horas.innerHTML = horas;
    }
}



lastTime = Date.now();
//Ahora cameras es un objeto, y cada una de las cámaras es otro objeto que tiene cam y el isCurrent
//cam es donde irá asignada la cámara creada desde Three.js
cameras = {
    default: { cam: null, isCurrent: false },
    camera2: { cam: null, isCurrent: false },
    camera3: { cam: null, isCurrent: false },
    camera4: { cam: null, isCurrent: false },
    camera5: { cam: null, isCurrent: false },
    current: { cam: null, isCurrent: false }
};
canvas = {
    element: null,
    container: null
}
labels = {}
cameraControl = null;
scene = null;
renderer = null
spotLight = null;
players = {
    p1: null,
    p2: null,
    p3: null,
    p4: null
}



collidableDestructible = [];

collidableList = [];
platformsElev = [];
/**
 * Function to start program running a
 * WebGL Application trouhg ThreeJS
 */
let webGLStart = () => {
    initScene();
    window.onresize = onWindowResize;
    lastTime = Date.now();
    animateScene();
    let slider = document.querySelector(".slidecontainer");
    slider.style.display = (slider.style.display != "block") ? "block" : "none";
    let contenedor = document.querySelector(".contenedor");
    contenedor.style.display = (contenedor.style.display != "flex") ? "flex" : "none";
    // inicio();

    setTimeout(init, 12000);
    setTimeout(function () {
        let popup = document.querySelector(".overlay");
        popup.style.display = (popup.style.display != "none") ? "none" : "block";
        setTimeout(mayorPuntaje, 180000);
        setTimeout(pushSnitch, 120000);

    }, 12000);
};

let pushSnitch = () => {


    var blockSnitch = new THREE.Mesh(
        new THREE.BoxGeometry(50, 50, 50),
        new THREE.MeshBasicMaterial({ color: 0xfffce8, wireframe: false, transparent: true, opacity: 0 })
    );
    blockSnitch.position.set(0, 225, 0)
    blockSnitch.name = "Snitch";
    var snitch = new THREE.Object3D();
    loadOBJWithMTL("./assets/Models/", "S01.obj", "S01.mtl", (obj) => {

        obj.position.set(0, 0, 9);
        obj.rotateX(-1.5708)
        // obj.scale.set(25, 25, 25);
        obj.castShadow = true;
        obj.receiveShadow = true;
        // obj.material.color = 0x0000ff;
        // obj.rotateY(1.5708)
        // blockSnitch.add(obj);
        snitch.copy(obj);
    })
    snitch.position.copy(blockSnitch.position);
    collidableList.push(blockSnitch);
    blockSnitch.add(snitch);
    scene.add(blockSnitch);

    soundSnitch = new Sound(["./assets/songs/powerup.wav"]
    );
    soundSnitch.play();
}

/**
 * Here we can setup all our scene noobsters
 */
function initScene() {
    //Selecting DOM Elements, the canvas and the parent element.
    canvas.container = document.querySelector("#app");
    canvas.element = canvas.container.querySelector("#appCanvas");

    /**
     * SETTING UP CORE THREEJS APP ELEMENTS (Scene, Cameras, Renderer)
     * */
    scene = new THREE.Scene();
    backgroundSound2 = new Sound(["./assets/songs/backgroundSound2.mp3"]
    );

    renderer = new THREE.WebGLRenderer({ canvas: canvas.element });
    renderer.setSize(canvas.container.clientWidth, canvas.container.clientHeight);
    renderer.setClearColor(0x20273a, 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    canvas.container.appendChild(renderer.domElement);



    //Init player with controls

    // console.log(players.p1.position);
    // players.p2 = new Player("P2", null, new Control("t", "h", "g", "f", "b", "y"), 25, { label: true });
    // players.p2.control.player = players.p2;
    // players.p2.play(scene);
    // players.p2.savePosRespawn();
    // players.p3 = new Player("P3", null, new Control("i", "l", "k", "j", "m", "o"), 25, { label: true });
    // players.p3.control.player = players.p3;
    // players.p3.play(scene);
    // players.p3.savePosRespawn();
    // players.p4 = new Player("P4", null, new Control("8", "6", "5", "4", "2", "9"), 25, { label: true });
    // players.p4.control.player = players.p4;
    // players.p4.play(scene);
    // players.p4.savePosRespawn();

    for (const player of Object.keys(players)) {
        if (players[player] != null)
            players[player].play(scene);
    }
    //positioning cameras
    cameras.default.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 10000);
    cameras.default.cam.position.set(0, 3000, 2500);
    cameras.default.cam.lookAt(new THREE.Vector3(0, 0, 0));

    // //camera2
    // cameras.camera2.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    // cameras.camera2.cam.position.set(0, 20, 100);
    // cameras.camera2.cam.lookAt(players.p1.element.position);

    // //Camera3
    // cameras.camera3.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    // cameras.camera3.cam.position.set(new THREE.Vector3(0, 0, 0));
    // cameras.camera3.cam.lookAt(players.p1.element.position);

    // //Camera4
    // cameras.camera4.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    // cameras.camera4.cam.position.set(0, 100, 50);
    // cameras.camera4.cam.lookAt(new THREE.Vector3(0, 0, 0));

    // //Camera5
    // cameras.camera5.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    // cameras.camera5.cam.position.set(100, 00, 100);
    // cameras.camera5.cam.lookAt(new THREE.Vector3(0, 0, 0));

    //Setting up current default camera as current camera
    cameras.current.cam = cameras.default.cam;
    cameras.default.isCurrent = true;

    //Camera control Plugin
    cameraControl = new THREE.OrbitControls(cameras.current.cam, renderer.domElement);

    lAmbiente = new THREE.AmbientLight(0xffffff);

    scene.add(lAmbiente);


    // Light following player
    spotLight = new THREE.SpotLight(0xffffff, 3, 2000, 0.8, 1, 1);
    spotLight.position.set(0, 1500, 0);
    // spotLight.lookAt(players.p1.element.position);

    // var targetObject = players.p1.element;
    // scene.add(targetObject);

    // spotLight.target = targetObject;
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 3000;
    spotLight.shadow.mapSize.height = 3000;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);

    // scene.add(spotLight.target);
    // scene.add(new THREE.SpotLightHelper(spotLight, 1));
    initObjects();
    //Modelo Snitch


    //UV PERSONAJES


    //Piso
    //Materiales
    var material = new THREE.MeshPhongMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/Base.jpg') });
    // material.map.wrapS = THREE.MirroredRepeatWrapping;
    // material.map.wrapT = THREE.MirroredRepeatWrapping;
    // material.map.repeat.set(3, 3);

    var geometria = new THREE.BoxGeometry(3000, 400, 3000);
    var UV1 = {
        GrandV: [
            new THREE.Vector2(0.0, 1.0),
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.4, 0.0),
            new THREE.Vector2(0.4, 1.0)

        ],

        Azul: [
            new THREE.Vector2(0.5, 1.0),
            new THREE.Vector2(0.5, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras

    geometria.faceVertexUvs[0] = [];
    geometria.faceVertexUvs[0][0] = [
        UV1.GrandV[0],
        UV1.GrandV[1],
        UV1.GrandV[3]
    ];
    geometria.faceVertexUvs[0][1] = [
        UV1.GrandV[1],
        UV1.GrandV[2],
        UV1.GrandV[3]
    ];
    geometria.faceVertexUvs[0][2] = [
        UV1.GrandV[0],
        UV1.GrandV[1],
        UV1.GrandV[3]
    ];
    geometria.faceVertexUvs[0][3] = [
        UV1.GrandV[1],
        UV1.GrandV[2],
        UV1.GrandV[3]
    ];

    geometria.faceVertexUvs[0][4] = [
        UV1.Azul[0],
        UV1.Azul[1],
        UV1.Azul[3]
    ];
    geometria.faceVertexUvs[0][5] = [
        UV1.Azul[1],
        UV1.Azul[2],
        UV1.Azul[3]
    ];
    geometria.faceVertexUvs[0][6] = [
        UV1.GrandV[0],
        UV1.GrandV[1],
        UV1.GrandV[3]
    ];
    geometria.faceVertexUvs[0][7] = [
        UV1.GrandV[1],
        UV1.GrandV[2],
        UV1.GrandV[3]
    ];
    geometria.faceVertexUvs[0][8] = [
        UV1.GrandV[0],
        UV1.GrandV[1],
        UV1.GrandV[3]
    ];
    geometria.faceVertexUvs[0][9] = [
        UV1.GrandV[1],
        UV1.GrandV[2],
        UV1.GrandV[3]
    ];
    geometria.faceVertexUvs[0][10] = [
        UV1.GrandV[0],
        UV1.GrandV[1],
        UV1.GrandV[3]
    ];
    geometria.faceVertexUvs[0][11] = [
        UV1.GrandV[1],
        UV1.GrandV[2],
        UV1.GrandV[3]
    ];

    plane = new THREE.Mesh(geometria, material);
    plane.position.y = -200;
    plane.receiveShadow = true;
    scene.add(plane);
    collidableList.push(plane);

    // borde izquierdo
    var mtlBordes = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('assets/textures/Laterales.jpg') })
    var geoBordes = new THREE.BoxGeometry(50, 50, 3000);
    var UV2 = {
        BI: [
            new THREE.Vector2(0.0, 1.0),
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras
    geoBordes.faceVertexUvs[0] = [];
    geoBordes.faceVertexUvs[0][0] = [
        UV2.BI[0],
        UV2.BI[1],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][1] = [
        UV2.BI[1],
        UV2.BI[2],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][2] = [
        UV2.BI[0],
        UV2.BI[1],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][3] = [
        UV2.BI[1],
        UV2.BI[2],
        UV2.BI[3]
    ];

    geoBordes.faceVertexUvs[0][4] = [
        UV2.BI[0],
        UV2.BI[1],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][5] = [
        UV2.BI[1],
        UV2.BI[2],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][6] = [
        UV2.BI[0],
        UV2.BI[1],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][7] = [
        UV2.BI[1],
        UV2.BI[2],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][8] = [
        UV2.BI[0],
        UV2.BI[1],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][9] = [
        UV2.BI[1],
        UV2.BI[2],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][10] = [
        UV2.BI[0],
        UV2.BI[1],
        UV2.BI[3]
    ];
    geoBordes.faceVertexUvs[0][11] = [
        UV2.BI[1],
        UV2.BI[2],
        UV2.BI[3]
    ];
    var bordes = new THREE.Mesh(geoBordes, mtlBordes);
    bordes.position.x = -1475;
    bordes.position.y = 25;
    collidableList.push(bordes);
    scene.add(bordes);

    //borde derecho
    var bordeDer = bordes.clone();
    bordeDer.position.x = 1475;
    collidableList.push(bordeDer);
    scene.add(bordeDer);

    // borde front
    var mtlBordesFB = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('assets/textures/Laterales.jpg') })
    var geoBordesFB = new THREE.BoxGeometry(2900, 50, 50);
    var UV3 = {
        BF: [
            new THREE.Vector2(0.0, 1.0),
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras
    geoBordesFB.faceVertexUvs[0] = [];
    geoBordesFB.faceVertexUvs[0][0] = [
        UV3.BF[0],
        UV3.BF[1],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][1] = [
        UV3.BF[1],
        UV3.BF[2],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][2] = [
        UV3.BF[0],
        UV3.BF[1],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][3] = [
        UV3.BF[1],
        UV3.BF[2],
        UV3.BF[3]
    ];

    geoBordesFB.faceVertexUvs[0][4] = [
        UV3.BF[0],
        UV3.BF[1],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][5] = [
        UV3.BF[1],
        UV3.BF[2],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][6] = [
        UV3.BF[0],
        UV3.BF[1],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][7] = [
        UV3.BF[1],
        UV3.BF[2],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][8] = [
        UV3.BF[0],
        UV3.BF[1],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][9] = [
        UV3.BF[1],
        UV3.BF[2],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][10] = [
        UV3.BF[0],
        UV3.BF[1],
        UV3.BF[3]
    ];
    geoBordesFB.faceVertexUvs[0][11] = [
        UV3.BF[1],
        UV3.BF[2],
        UV3.BF[3]
    ];
    var bordesFB = new THREE.Mesh(geoBordesFB, mtlBordesFB);
    bordesFB.position.z = 1475;
    bordesFB.position.y = 25;
    collidableList.push(bordesFB);
    scene.add(bordesFB);

    //borde back
    var bordeBack = bordesFB.clone();
    bordeBack.position.z = -1475;
    collidableList.push(bordeBack);
    scene.add(bordeBack);

    //Plataforma central
    var matPlatform = new THREE.MeshPhongMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/Plata.jpg') });
    // Aldea.map.wrapS = THREE.MirroredRepeatWrapping;
    // Aldea.map.wrapT = THREE.MirroredRepeatWrapping;
    // Aldea.map.repeat.set(3, 3);

    var geometriaPlatform = new THREE.BoxGeometry(1500, 200, 1500);
    var UV4 = {
        Plat2: [
            new THREE.Vector2(0.0, 1.0),
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.4, 0.0),
            new THREE.Vector2(0.4, 1.0)

        ],

        Plat3: [
            new THREE.Vector2(0.5, 1.0),
            new THREE.Vector2(0.5, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras

    geometriaPlatform.faceVertexUvs[0] = [];
    geometriaPlatform.faceVertexUvs[0][4] = [
        UV4.Plat3[0],
        UV4.Plat3[1],
        UV4.Plat3[3]
    ];
    geometriaPlatform.faceVertexUvs[0][5] = [
        UV4.Plat3[1],
        UV4.Plat3[2],
        UV4.Plat3[3]
    ];
    geometriaPlatform.faceVertexUvs[0][0] = [
        UV4.Plat2[0],
        UV4.Plat2[1],
        UV4.Plat2[3]
    ];
    geometriaPlatform.faceVertexUvs[0][1] = [
        UV4.Plat2[1],
        UV4.Plat2[2],
        UV4.Plat2[3]
    ];

    geometriaPlatform.faceVertexUvs[0][2] = [
        UV4.Plat2[0],
        UV4.Plat2[1],
        UV4.Plat2[3]
    ];
    geometriaPlatform.faceVertexUvs[0][3] = [
        UV4.Plat2[1],
        UV4.Plat2[2],
        UV4.Plat2[3]
    ];

    geometriaPlatform.faceVertexUvs[0][6] = [
        UV4.Plat2[0],
        UV4.Plat2[1],
        UV4.Plat2[3]
    ];
    geometriaPlatform.faceVertexUvs[0][7] = [
        UV4.Plat2[1],
        UV4.Plat2[2],
        UV4.Plat2[3]
    ];

    geometriaPlatform.faceVertexUvs[0][8] = [
        UV4.Plat2[0],
        UV4.Plat2[1],
        UV4.Plat2[3]
    ];
    geometriaPlatform.faceVertexUvs[0][9] = [
        UV4.Plat2[1],
        UV4.Plat2[2],
        UV4.Plat2[3]
    ];

    geometriaPlatform.faceVertexUvs[0][10] = [
        UV4.Plat2[0],
        UV4.Plat2[1],
        UV4.Plat2[3]
    ];
    geometriaPlatform.faceVertexUvs[0][11] = [
        UV4.Plat2[1],
        UV4.Plat2[2],
        UV4.Plat2[3]
    ];


    platform = new THREE.Mesh(geometriaPlatform, matPlatform);
    platform.position.z = 0;
    platform.position.y = 100;
    platform.castShadow = true;
    platform.receiveShadow = true;
    scene.add(platform);
    collidableList.push(platform);

    //Plataforma central
    var matPlatformx = new THREE.MeshPhongMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/BlockesX.jpg') });
    // Aldea.map.wrapS = THREE.MirroredRepeatWrapping;
    // Aldea.map.wrapT = THREE.MirroredRepeatWrapping;
    // Aldea.map.repeat.set(3, 3);

    var geometriaPlatformx = new THREE.BoxGeometry(200, 150, 150);
    var UV5 = {
        Platx: [
            new THREE.Vector2(0.0, 1.0),
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.4, 0.0),
            new THREE.Vector2(0.4, 1.0)

        ],

        Platx2: [
            new THREE.Vector2(0.5, 1.0),
            new THREE.Vector2(0.5, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras

    geometriaPlatformx.faceVertexUvs[0] = [];
    geometriaPlatformx.faceVertexUvs[0][4] = [
        UV5.Platx[0],
        UV5.Platx[1],
        UV5.Platx[3]
    ];
    geometriaPlatformx.faceVertexUvs[0][5] = [
        UV5.Platx[1],
        UV5.Platx[2],
        UV5.Platx[3]
    ];
    geometriaPlatformx.faceVertexUvs[0][0] = [
        UV5.Platx2[0],
        UV5.Platx2[1],
        UV5.Platx2[3]
    ];
    geometriaPlatformx.faceVertexUvs[0][1] = [
        UV5.Platx2[1],
        UV5.Platx2[2],
        UV5.Platx2[3]
    ];

    geometriaPlatformx.faceVertexUvs[0][2] = [
        UV5.Platx2[0],
        UV5.Platx2[1],
        UV5.Platx2[3]
    ];
    geometriaPlatformx.faceVertexUvs[0][3] = [
        UV5.Platx2[1],
        UV5.Platx2[2],
        UV5.Platx2[3]
    ];

    geometriaPlatformx.faceVertexUvs[0][6] = [
        UV5.Platx2[0],
        UV5.Platx2[1],
        UV5.Platx2[3]
    ];
    geometriaPlatformx.faceVertexUvs[0][7] = [
        UV5.Platx2[1],
        UV5.Platx2[2],
        UV5.Platx2[3]
    ];

    geometriaPlatformx.faceVertexUvs[0][8] = [
        UV5.Platx2[0],
        UV5.Platx2[1],
        UV5.Platx2[3]
    ];
    geometriaPlatformx.faceVertexUvs[0][9] = [
        UV5.Platx2[1],
        UV5.Platx2[2],
        UV5.Platx2[3]
    ];

    geometriaPlatformx.faceVertexUvs[0][10] = [
        UV5.Platx2[0],
        UV5.Platx2[1],
        UV5.Platx2[3]
    ];
    geometriaPlatformx.faceVertexUvs[0][11] = [
        UV5.Platx2[1],
        UV5.Platx2[2],
        UV5.Platx2[3]
    ];


    platformx = new THREE.Mesh(geometriaPlatformx, matPlatformx);
    platformx.position.z = -1200;
    platformx.position.y = 40;
    platformx.position.x = -20;
    platformx.castShadow = true;
    platformx.receiveShadow = true;
    scene.add(platformx);
    collidableList.push(platformx);

    //Luz esfera 
    var light = new THREE.PointLight(0xD4F9FF, 10, 200, 2.0);
    light.position.set(-20, 180, -1200);
    scene.add(light);
    //Circulo Lumen
    var MatLumen = new THREE.MeshLambertMaterial({ color: 0xD4F9FF });
    // Aldea.map.wrapS = THREE.MirroredRepeatWrapping;
    // Aldea.map.wrapT = THREE.MirroredRepeatWrapping;
    // Aldea.map.repeat.set(3, 3);

    var CircleL = new THREE.SphereGeometry(25, 100, 100);
    Circle = new THREE.Mesh(CircleL, MatLumen);
    Circle.position.x = -20;
    Circle.position.z = -1200;
    Circle.position.y = 180;
    scene.add(Circle);


    //Clones

    var platformx2 = platformx.clone();
    platformx2.position.x = 978;
    collidableList.push(platformx2);
    scene.add(platformx2);

    //Clon Luz

    var LuzI = light.clone();
    LuzI.position.set(978, 180, -1200);
    scene.add(LuzI);

    //Clon Ball
    var CloneBall = Circle.clone();
    CloneBall.position.x = 978;
    scene.add(CloneBall);


    //Clones2

    var platformx3 = platformx.clone();
    platformx3.position.x = -970;
    collidableList.push(platformx3);
    scene.add(platformx3);

    //Clon Luz2

    var LuzI2 = light.clone();
    LuzI2.position.set(-970, 180, -1200);
    scene.add(LuzI2);

    //Clon Ball2 

    var CloneBall2 = Circle.clone();
    CloneBall2.position.x = -970;
    scene.add(CloneBall2);

    //Clones3

    var platformx4 = platformx.clone();
    platformx4.position.x = -970;
    platformx4.position.z = 1200
    collidableList.push(platformx4);
    scene.add(platformx4);

    //Clon Luz3

    var LuzI3 = light.clone();
    LuzI3.position.set(-970, 180, 1200);
    scene.add(LuzI3);

    //Clon Ball3

    var CloneBall3 = Circle.clone();
    CloneBall3.position.x = -970;
    CloneBall3.position.z = 1200;
    scene.add(CloneBall3);

    //Clones4

    var platformx5 = platformx.clone();
    platformx5.position.x = -30;
    platformx5.position.z = 1150
    collidableList.push(platformx5);
    scene.add(platformx5);

    //Clon Luz4

    var LuzI4 = light.clone();
    LuzI4.position.set(-30, 180, 1150);
    scene.add(LuzI4);

    //Clon Ball4

    var CloneBall4 = Circle.clone();
    CloneBall4.position.x = -30;
    CloneBall4.position.z = 1150;
    scene.add(CloneBall4);

    //Clones5

    var platformx6 = platformx.clone();
    platformx6.position.x = 975;
    platformx6.position.z = 1150
    collidableList.push(platformx6);
    scene.add(platformx6);

    //Clon Luz5

    var LuzI5 = light.clone();
    LuzI5.position.set(975, 180, 1150);
    scene.add(LuzI5);

    //Clon Ball5

    var CloneBall5 = Circle.clone();
    CloneBall5.position.x = 975;
    CloneBall5.position.z = 1150;
    scene.add(CloneBall5);

    //Torres

    var geometryCone = new THREE.ConeGeometry(30, 130, 80);
    var materialCone = new THREE.MeshBasicMaterial({ color: 0x778784 });
    var cone = new THREE.Mesh(geometryCone, materialCone);
    cone.position.x = 1475;
    cone.position.z = -1480;
    cone.position.y = 115;
    scene.add(cone);

    //Torre Clone Diagonal
    var cone2 = cone.clone();
    cone.position.x = -1475;
    cone.position.z = 1480;
    cone.position.y = 115;
    scene.add(cone2);

    //Torre Clone Paralelo 

    var geometryCone2 = new THREE.ConeGeometry(30, 130, 80);
    var materialCone2 = new THREE.MeshBasicMaterial({ color: 0x778784 });
    var cone3 = new THREE.Mesh(geometryCone2, materialCone2);
    cone3.position.x = 1475;
    cone3.position.z = 1480;
    cone3.position.y = 115;
    scene.add(cone3);

    //Torre Clone Paralelo 2

    var cone4 = cone3.clone();
    cone4.position.x = -1475;
    cone4.position.z = -1480;
    cone4.position.y = 115;
    scene.add(cone4);
    //Torre Clone Central 1 

    var cone5 = cone.clone();
    cone5.position.x = -350;
    cone5.position.z = -350;
    cone5.position.y = 360;
    scene.add(cone5);

    //Torre Clone Central 2

    var cone6 = cone.clone();
    cone6.position.x = -350;
    cone6.position.z = 350;
    cone6.position.y = 360;
    scene.add(cone6);

    //Torre Clone Central 3

    var cone7 = cone2.clone();
    cone7.position.x = 350;
    cone7.position.z = -350;
    cone7.position.y = 360;
    scene.add(cone7);

    //Torre Clone Central 4

    var cone8 = cone2.clone();
    cone8.position.x = 350;
    cone8.position.z = 350;
    cone8.position.y = 360;
    scene.add(cone8);


    //Plataformas de elevación

    //Plataforma Elevacion
    var matPlatformE = new THREE.MeshBasicMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/Plat.jpg') });
    // Aldea.map.wrapS = THREE.MirroredRepeatWrapping;
    // Aldea.map.wrapT = THREE.MirroredRepeatWrapping;
    // Aldea.map.repeat.set(3, 3);

    var geometriaPlatformE = new THREE.BoxGeometry(200, 10, 100);
    var UVE = {
        PlatE: [
            new THREE.Vector2(0.0, 1.0),
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras

    geometriaPlatformE.faceVertexUvs[0] = [];
    geometriaPlatformE.faceVertexUvs[0][4] = [
        UVE.PlatE[0],
        UVE.PlatE[1],
        UVE.PlatE[3]
    ];
    geometriaPlatformE.faceVertexUvs[0][5] = [
        UVE.PlatE[1],
        UVE.PlatE[2],
        UVE.PlatE[3]
    ];



    elevacion = new THREE.Mesh(geometriaPlatformE, matPlatformE);
    elevacion.position.set(800, 5, 0);
    elevacion.rotation.y += 90 * Math.PI / 180;
    elevacion.name = "plataforma1";
    elevacion.isInUse = false;
    scene.add(elevacion);
    collidableList.push(elevacion);

    //Clon Plat
    elevacion2 = elevacion.clone();
    elevacion2.rotation.y += 180 * Math.PI / 180;
    elevacion2.name = "plataforma2";
    elevacion2.isInUse = false;
    elevacion2.position.set(-800, 5, 0);
    collidableList.push(elevacion2);
    scene.add(elevacion2);

    //Plat 3

    var matPlatformE2 = new THREE.MeshBasicMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/Plat.jpg') });
    // Aldea.map.wrapS = THREE.MirroredRepeatWrapping;
    // Aldea.map.wrapT = THREE.MirroredRepeatWrapping;
    // Aldea.map.repeat.set(3, 3);

    var geometriaPlatformE2 = new THREE.BoxGeometry(200, 10, 100);
    var UVE2 = {
        PlatE2: [
            new THREE.Vector2(0.0, 1.0),
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras

    geometriaPlatformE2.faceVertexUvs[0] = [];
    geometriaPlatformE2.faceVertexUvs[0][4] = [
        UVE2.PlatE2[0],
        UVE2.PlatE2[1],
        UVE2.PlatE2[3]
    ];
    geometriaPlatformE2.faceVertexUvs[0][5] = [
        UVE2.PlatE2[1],
        UVE2.PlatE2[2],
        UVE2.PlatE2[3]
    ];



    elevacion3 = new THREE.Mesh(geometriaPlatformE2, matPlatformE2);
    elevacion3.position.set(0, 5, 800);
    elevacion3.name = "plataforma3";
    elevacion3.isInUse = false;
    scene.add(elevacion3);
    collidableList.push(elevacion3);

    //Clon Plat4
    elevacion4 = elevacion3.clone();
    elevacion4.name = "plataforma4";
    elevacion4.rotation.y += 180 * Math.PI / 180;
    elevacion4.isInUse = false;
    elevacion4.position.set(0, 5, -800);
    collidableList.push(elevacion4);
    scene.add(elevacion4);

    platformsElev.push(elevacion)
    platformsElev.push(elevacion2)
    platformsElev.push(elevacion3)
    platformsElev.push(elevacion4)

    //Plataforma Decarotiva
    var matPlatformD = new THREE.MeshPhongMaterial({ color: 0x616161, wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/Plata.jpg') });
    // Aldea.map.wrapS = THREE.MirroredRepeatWrapping;
    // Aldea.map.wrapT = THREE.MirroredRepeatWrapping;
    // Aldea.map.repeat.set(3, 3);

    var geometriaPlatformD = new THREE.BoxGeometry(200, 100, 200);
    var UVD = {
        PlatD: [
            new THREE.Vector2(0.5, 1.0),
            new THREE.Vector2(0.5, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras

    geometriaPlatformD.faceVertexUvs[0] = [];
    geometriaPlatformD.faceVertexUvs[0][4] = [
        UVD.PlatD[0],
        UVD.PlatD[1],
        UVD.PlatD[3]
    ];
    geometriaPlatformD.faceVertexUvs[0][5] = [
        UVD.PlatD[1],
        UVD.PlatD[2],
        UVD.PlatD[3]
    ];



    platformD = new THREE.Mesh(geometriaPlatformD, matPlatformD);
    platformD.position.z = -350;
    platformD.position.y = 250;
    platformD.position.x = -350;
    platformD.castShadow = true;
    platformD.receiveShadow = true;
    scene.add(platformD);
    collidableList.push(platformD);

    //Clone decorative
    // Aldea.map.wrapS = THREE.MirroredRepeatWrapping;
    // Aldea.map.wrapT = THREE.MirroredRepeatWrapping;
    // Aldea.map.repeat.set(3, 3);

    var geometriaPlatformD2 = new THREE.BoxGeometry(200, 80, 200);
    var UVD2 = {
        PlatD2: [
            new THREE.Vector2(0.5, 1.0),
            new THREE.Vector2(0.5, 0.0),
            new THREE.Vector2(1.0, 0.0),
            new THREE.Vector2(1.0, 1.0)

        ],

    }

    //Mapeo de las texturas sobre las caras

    geometriaPlatformD2.faceVertexUvs[0] = [];
    geometriaPlatformD2.faceVertexUvs[0][4] = [
        UVD2.PlatD2[0],
        UVD2.PlatD2[1],
        UVD2.PlatD2[3]
    ];
    geometriaPlatformD2.faceVertexUvs[0][5] = [
        UVD2.PlatD2[1],
        UVD2.PlatD2[2],
        UVD2.PlatD2[3]
    ];



    platformD2 = new THREE.Mesh(geometriaPlatformD2, matPlatformD);
    platformD2.position.z = -350;
    platformD2.position.y = 250;
    platformD2.position.x = 350;
    platformD2.castShadow = true;
    platformD2.receiveShadow = true;
    scene.add(platformD2);
    collidableList.push(platformD2);

    //Clone MD3
    var platformD3 = platformD2.clone();
    platformD3.position.x = 350;
    platformD3.position.z = 350;
    platformD3.position.y = 250;
    collidableList.push(platformD3);
    scene.add(platformD3);

    //Clone MD3
    var platformD4 = platformD.clone();
    platformD4.position.x = -350;
    platformD4.position.z = 350;
    platformD4.position.y = 250;
    collidableList.push(platformD4);
    scene.add(platformD4);


    // var powerup = new THREE.Mesh(
    //     new THREE.BoxGeometry(50, 50, 50),
    //     new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false })
    // );
    // powerup.position.set(50, 25, 1000);
    // powerup.name = "Velocity2X";
    // scene.add(powerup);
    // collidableList.push(powerup);

    // var powerup2 = new THREE.Mesh(
    //     new THREE.BoxGeometry(50, 50, 50),
    //     new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false })
    // );
    // powerup2.position.set(150, 25, 1000);
    // powerup2.name = "Bomb+";
    // scene.add(powerup2);
    // collidableList.push(powerup2);
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = stats.domElement.style.left = '10px';
    stats.domElement.style.zIndex = '100';
    document.body.appendChild(stats.domElement);


}



/**
 * Function to add all objects, lights (except for the ambienlight) and stuff to scene
 */
function initObjects() {
    var bloques = [
        [0, 0, 5, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
        [0, 3, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 5, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 4, 0],
        [1, 4, 1, 1, 5, 1, 1, 2, 1, 1, 3, 1, 1, 1, 1, 2, 1, 5, 1, 3, 1, 4, 2, 1, 1, 1, 1, 1, 2, 1, 1, 3, 1, 1, 1, 3, 1, 1, 5, 1, 1, 4, 1, 3, 1, 1, 1, 5, 1, 2, 1, 4, 1, 3, 2, 5, 1, 1],
        [0, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [5, 1, 1, 3, 1, 1, 1, 1, 3, 1, 5, 1, 3, 1, 2, 1, 1, 4, 1, 1, 3, 1, 5, 1, 2, 4, 1, 1, 3, 1, 5, 1, 3, 1, 1, 1, 4, 1, 1, 1, 3, 2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
        [1, 1, 4, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 3, 2, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5, 1, 4, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 2, 1, 5, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 5, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 3, 1, 1, 1],
        [1, 3, 1, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 2, 4, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 1, 3, 1, 2, 1],
        [1, 1, 5, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 5, 1, 1],
        [1, 3, 4, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 3, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 5, 1, 3, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0],
        [1, 1, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 1, 1, 4, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 2, 1, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 2, 5, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 2, 3, 1, 1, 1],
        [1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 5, 1, 2, 3, 1, 4, 1, 1, 3, 4, 2, 1, 4, 3, 1, 1, 5, 1, 2, 4, 3, 1, 1, 3, 1, 1, 1, 4, 1, 1, 3, 2, 1, 1, 1, 5, 1, 1, 3, 1, 1, 2, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 2, 5, 1],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 3, 1, 4, 1, 5, 1, 1, 3, 1, 4, 1, 2, 3, 4, 1, 1, 1, 1, 4, 2, 1, 5, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 2, 1, 1, 3, 1, 1, 1, 3, 1, 1, 2, 1, 1, 1, 3, 1, 1, 2, 1, 0],
        [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2],
        [0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 1, 0],
        [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 2, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 0, 1, 1, 1, 4, 1, 1, 1, 1, 5, 1, 2, 1, 1, 4, 1, 1, 1, 1, 2, 1, 1, 1, 1, 4, 1, 1, 1, 0, 0]
    ];

    var inicioX = -1425;
    var inicioZ = -1425;
    for (var i = 0; i < bloques.length; i++) {
        for (var j = 0; j < bloques[i].length; j++) {
            switch (bloques[i][j]) {
                case 1:
                    var block = new THREE.Mesh(
                        new THREE.BoxGeometry(50, 50, 50),
                        new THREE.MeshBasicMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/block.png') })
                    );
                    block.castShadow = true;
                    block.receiveShadow = true;
                    block.position.set(inicioX, 25, inicioZ);
                    scene.add(block);
                    collidableList.push(block);
                    collidableDestructible.push(block);
                    inicioX += 50;
                    break;
                case 2:
                    var block = new THREE.Mesh(
                        new THREE.BoxGeometry(50, 50, 50),
                        new THREE.MeshBasicMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/block.png') })
                    );

                    block.castShadow = true;
                    block.receiveShadow = true;
                    block.position.set(inicioX, 25, inicioZ);
                    scene.add(block);
                    collidableList.push(block);
                    collidableDestructible.push(block);

                    //Modelo potencia
                    let blockpotencia = new THREE.Mesh(
                        new THREE.BoxGeometry(47, 47, 47),
                        new THREE.MeshBasicMaterial({ color: 0xfffce8, wireframe: false, transparent: true, opacity: 0 })
                    );
                    blockpotencia.position.set(inicioX, 25, inicioZ)
                    blockpotencia.name = "Potencia";
                    let potencia = new THREE.Object3D();
                    loadOBJWithMTL("./assets/Models/", "BomX2.obj", "BomX2.mtl", (obj) => {

                        obj.position.set(0, -45, -30);
                        obj.rotateY(1.5708)
                        obj.scale.set(5, 5, 5);
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                        // obj.material.color = 0x0000ff;
                        // obj.rotateY(1.5708)
                        // blockpotencia.add(obj);
                        potencia.copy(obj);
                    })
                    potencia.position.copy(blockpotencia.position);
                    collidableList.push(blockpotencia);
                    blockpotencia.add(potencia);
                    scene.add(blockpotencia);
                    inicioX += 50;
                    break;
                case 3:
                    var block = new THREE.Mesh(
                        new THREE.BoxGeometry(50, 50, 50),
                        new THREE.MeshBasicMaterial({ color: 0xfffce8, wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/block.png') })
                    );

                    block.castShadow = true;
                    block.receiveShadow = true;
                    block.position.set(inicioX, 25, inicioZ);
                    scene.add(block);
                    collidableList.push(block);
                    collidableDestructible.push(block);

                    //Modelo Velocity2X
                    let blockVelocity2X = new THREE.Mesh(
                        new THREE.BoxGeometry(47, 47, 47),
                        new THREE.MeshBasicMaterial({ color: 0xfffce8, wireframe: false, transparent: true, opacity: 0 })
                    );
                    blockVelocity2X.position.set(inicioX, 25, inicioZ)
                    blockVelocity2X.name = "Velocity2X";
                    let velocity2X = new THREE.Object3D();
                    loadOBJWithMTL("./assets/Models/", "2X.obj", "2X.mtl", (obj) => {

                        obj.position.set(0, 0, 9);
                        obj.rotateY(1.5708)
                        // obj.scale.set(25, 25, 25);
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                        // obj.material.color = 0x0000ff;
                        // obj.rotateY(1.5708)
                        // blockVelocity2X.add(obj);
                        velocity2X.copy(obj);
                    })
                    velocity2X.position.copy(blockVelocity2X.position);
                    collidableList.push(blockVelocity2X);
                    blockVelocity2X.add(velocity2X);
                    scene.add(blockVelocity2X);
                    inicioX += 50;
                    break;
                case 4:
                    var block = new THREE.Mesh(
                        new THREE.BoxGeometry(50, 50, 50),
                        new THREE.MeshBasicMaterial({ color: 0xfffce8, wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/block.png') })
                    );

                    block.castShadow = true;
                    block.receiveShadow = true;
                    block.position.set(inicioX, 25, inicioZ);
                    scene.add(block);
                    collidableList.push(block);
                    collidableDestructible.push(block);

                    //Modelo addBomb
                    let blockaddBomb = new THREE.Mesh(
                        new THREE.BoxGeometry(50, 50, 50),
                        new THREE.MeshBasicMaterial({ color: 0xfffce8, wireframe: false, transparent: true, opacity: 0 })
                    );
                    blockaddBomb.position.set(inicioX, 25, inicioZ)
                    blockaddBomb.name = "Bomb+";
                    let addBomb = new THREE.Object3D();
                    loadOBJWithMTL("./assets/Models/", "Bom01.obj", "Bom01.mtl", (obj) => {

                        obj.position.set(0, -45, -30);
                        obj.rotateY(1.5708)
                        obj.scale.set(4, 4, 4);
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                        // obj.material.color = 0x0000ff;
                        // obj.rotateY(1.5708)
                        // blockaddBomb.add(obj);
                        addBomb.copy(obj);
                    })
                    addBomb.position.copy(blockaddBomb.position);
                    collidableList.push(blockaddBomb);
                    blockaddBomb.add(addBomb);
                    scene.add(blockaddBomb);
                    inicioX += 50;
                    break;
                case 5:
                    var block = new THREE.Mesh(
                        new THREE.BoxGeometry(50, 50, 50),
                        new THREE.MeshBasicMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture('assets/textures/block.png') })
                    );

                    block.castShadow = true;
                    block.receiveShadow = true;
                    block.position.set(inicioX, 25, inicioZ);
                    scene.add(block);
                    collidableList.push(block);
                    collidableDestructible.push(block);

                    //Modelo capa
                    let blockcapa = new THREE.Mesh(
                        new THREE.BoxGeometry(50, 50, 50),
                        new THREE.MeshBasicMaterial({ wireframe: false, transparent: true, opacity: 0.0 })
                    );
                    blockcapa.position.set(inicioX, 25, inicioZ)
                    blockcapa.name = "Capa";
                    let capa = new THREE.Object3D();
                    loadOBJWithMTL("./assets/Models/", "Capa01.obj", "Capa01.mtl", (obj) => {

                        obj.position.set(0, 0, 0);
                        // obj.rotateY(1.5708)
                        obj.scale.set(4, 4, 4);
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                        // obj.material.color = 0x0000ff;
                        // obj.rotateY(1.5708)
                        // blockcapa.add(obj);
                        capa.copy(obj);
                        // scene.add(capa);
                    })
                    capa.position.copy(blockcapa.position);
                    collidableList.push(blockcapa);
                    blockcapa.add(capa);
                    scene.add(blockcapa);
                    inicioX += 50;
                    break;
                case 0:

                    inicioX += 50;
                    break;
                default:
                    break;
            }
        }
        inicioX = -1425;
        inicioZ += 50;
    }


    backgroundSound2.play();


}

function validateWin() {
    for (const player of Object.keys(players)) {
        if (players[player] != null) {
            if (players[player].score >= 1000) {
                console.log(`${players[player].name} ha ganado la partida`);
                soundWin = new Sound(["./assets/songs/win.wav"]
                );
                soundWin.play();
                for (const playerDelete of Object.keys(players)) {
                    scene.remove(players[playerDelete].element);
                }
            }

        }
    }
}

function mayorPuntaje() {
    var name = null;
    var max = 0;
    for (const player of Object.keys(players)) {

        if (players[player] != null) {
            if (players[player].score > max) {
                max = players[player].score;
                name = players[player].name;
            }
        }
    }
    var strGanador = `¡${name} ha ganado la partida con ${max} puntos!`
    console.log(strGanador);
    let overlayWin = document.querySelector(".overlayWin");
    overlayWin.style.display = (overlayWin.style.display != "block") ? "block" : "none";
    let popupWin = document.querySelector(".popupWin > h2");
    popupWin.innerHTML = strGanador;

    soundWin = new Sound(["./assets/songs/win.wav"]);
    soundWin.play();

}

/**
 * Function to render application over
 * and over.
 */
function animateScene() {
    requestAnimationFrame(animateScene);
    renderer.render(scene, cameras.current.cam);
    updateScene();
}


/**
 * Function to evaluate logic over and
 * over again.
 */
function updateScene() {

    // if (minutos != 3) {
    //     cronometro();
    // }
    changeVolume();
    backgroundSound2.update(volume)
    lastTime = Date.now();
    validateWin();
    //Updating camera view by control inputs
    cameraControl.update();
    //Updating FPS monitor
    stats.update();
    //Sound Update
    // mySound3D.update(players.p1.element);
    // mySound3D2.update(players.p1.element);
    // mySound3D3.update(players.p1.element);
    // mySound3D4.update(players.p1.element);
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
    //Player controls
    for (const player of Object.keys(players)) {
        if (players[player] != null) {
            players[player].updateControls();
            players[player].collidableBox.update(players[player]);
        }
    }
    if (elevacion.position.y >= 6.5 && !elevacion.isInUse) {
        elevacion.position.y -= 1 / 2;
    }
    if (elevacion2.position.y > 6.5 && !elevacion2.isInUse) {
        elevacion2.position.y -= 1 / 2;
    }
    if (elevacion3.position.y > 6.5 && !elevacion3.isInUse) {
        elevacion3.position.y -= 1 / 2;
    }
    if (elevacion4.position.y > 6.5 && !elevacion4.isInUse) {
        elevacion4.position.y -= 1 / 2;
    }



    for (const label of Object.keys(labels)) {
        labels[label].lookAt(cameras.current.cam.position);
        if (label == "p1") {
            labels[label].position.copy(players.p1.element.position);
        }
        if (label == "p2") {
            labels[label].position.copy(players.p2.element.position);
        }
    }

    // spotLight.lookAt(players.p1.element.position);

    //Acá irán las cosas que se deben ir actualizando como el lookAt de la cam o el position.

    //Si camera2.isCurrent == true, entonces el lookAt debe seguir la posición del elemento.
    if (cameras.camera2.isCurrent) {
        cameras.current.cam.lookAt(players.p1.element.position);
    }
    if (cameras.camera4.isCurrent) {
        cameras.current.cam.lookAt(players.p1.element.position);
    }


}

function onWindowResize() {
    cameras.current.cam.aspect = window.innerWidth / window.innerHeight;
    cameras.current.cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

