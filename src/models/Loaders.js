function loadJSON(model, onloadCallback) {

    var loader = new THREE.ObjectLoader();

    loader.load(model, onloadCallback,
        // onProgress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
            console.error('An error happened');
        }
    );
}
function loadOBJ(model, onloadCallback) {

    var loader = new THREE.OBJLoader();

    loader.load(model, onloadCallback,
        // onProgress callback
        function (xhr) {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
            console.error('An error happened');
        }
    );
}

function loadOBJWithMTL(folder, modelo, material, onloadCallback) {
    new THREE.MTLLoader()
        .setPath(folder)
        .load(material, function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath(folder)
                .load(modelo, onloadCallback);
        });
}
