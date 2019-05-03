/**
 * GLOBAL VARS
 */
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
};

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


    renderer = new THREE.WebGLRenderer({ canvas: canvas.element });
    renderer.setSize(canvas.container.clientWidth, canvas.container.clientHeight);
    renderer.setClearColor(0x20273a, 1);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    canvas.container.appendChild(renderer.domElement);

    //Init player with controls
    players.p1 = new Player("P1", null, new Control(), 25, { label: true });
    players.p1.control.player = players.p1;
    players.p1.play(scene);
    players.p1.savePosRespawn();
    console.log(players.p1.position);
    players.p2 = new Player("P2", null, new Control("t", "h", "g", "f", "b", "y"), 25, { label: true });
    players.p2.control.player = players.p2;
    players.p2.play(scene);
    players.p2.savePosRespawn();
    players.p3 = new Player("P3", null, new Control("i", "l", "k", "j", "m", "o"), 25, { label: true });
    players.p3.control.player = players.p3;
    players.p3.play(scene);
    players.p3.savePosRespawn();
    players.p4 = new Player("P4", null, new Control("8", "6", "5", "4", "2", "9"), 25, { label: true });
    players.p4.control.player = players.p4;
    players.p4.play(scene);
    players.p4.savePosRespawn();

    //positioning cameras
    cameras.default.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 10000);
    cameras.default.cam.position.set(0, 1550, 3500);
    cameras.default.cam.lookAt(new THREE.Vector3(0, 0, 0));

    //camera2
    cameras.camera2.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    cameras.camera2.cam.position.set(0, 20, 100);
    cameras.camera2.cam.lookAt(players.p1.element.position);

    //Camera3
    cameras.camera3.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    cameras.camera3.cam.position.set(new THREE.Vector3(0, 0, 0));
    cameras.camera3.cam.lookAt(players.p1.element.position);

    //Camera4
    cameras.camera4.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    cameras.camera4.cam.position.set(0, 100, 50);
    cameras.camera4.cam.lookAt(new THREE.Vector3(0, 0, 0));

    //Camera5
    cameras.camera5.cam = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    cameras.camera5.cam.position.set(100, 00, 100);
    cameras.camera5.cam.lookAt(new THREE.Vector3(0, 0, 0));

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
    elevacion.position.set(800, 2, 0);
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
    elevacion2.position.set(-800, 2, 0);
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
    elevacion3.position.set(0, 2, 800);
    elevacion3.name = "plataforma3";
    elevacion3.isInUse = false;
    scene.add(elevacion3);
    collidableList.push(elevacion3);

    //Clon Plat4
    elevacion4 = elevacion3.clone();
    elevacion4.name = "plataforma4";
    elevacion4.rotation.y += 180 * Math.PI / 180;
    elevacion4.isInUse = false;
    elevacion4.position.set(0, 2, -800);
    collidableList.push(elevacion4);
    scene.add(elevacion4);

    platformsElev.push(elevacion)
    platformsElev.push(elevacion2)
    platformsElev.push(elevacion3)
    platformsElev.push(elevacion4)
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

    backgroundSound = new Sound(["./assets/songs/backgroundSound.mp3"], 15, scene, {
        debug: true,
        position: { x: 50, y: 0, z: 0 }
    });


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
    lastTime = Date.now();

    //Updating camera view by control inputs
    cameraControl.update();
    //Updating FPS monitor
    stats.update();
    //Sound Update
    // mySound3D.update(players.p1.element);
    // mySound3D2.update(players.p1.element);
    // mySound3D3.update(players.p1.element);
    // mySound3D4.update(players.p1.element);

    //Player controls
    for (const player of Object.keys(players)) {
        if (players[player] != null) {
            players[player].updateControls();
            players[player].collidableBox.update(players[player]);
        }
    }
    if (elevacion.position.y > 2 && !elevacion.isInUse) {
        elevacion.position.y -= 1 / 2;
    }
    if (elevacion2.position.y > 2 && !elevacion2.isInUse) {
        elevacion2.position.y -= 1 / 2;
    }
    if (elevacion3.position.y > 2 && !elevacion3.isInUse) {
        elevacion3.position.y -= 1 / 2;
    }
    if (elevacion4.position.y > 2 && !elevacion4.isInUse) {
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

