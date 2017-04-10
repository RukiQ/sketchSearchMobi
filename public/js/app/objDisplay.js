/*
 * @Author: Ruth
 * @Date:   2017-01-13 16:16:16
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-01-17 13:07:17
 */

'use strict';

define(function(require, exports, module) {
    var THREE = require('../lib/three'),
        OBJLoader = require('../lib/OBJLoader');

    var container;
    var camera, scene, renderer;

    var mouseX = 0,
        mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    function init(obj) {

        container = document.createElement('div');
        $('#show-obj').append(container);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 10;

        // scene

        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight(0x101030);
        scene.add(ambient);

        var directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        if (obj) {
            loadObj(obj);
        }

        // 渲染

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        renderer.domElement.style.width = '28.6rem';
        renderer.domElement.style.height = '22.3rem';

        document.addEventListener('touchmove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);

        animate();
    }

    function loadObj(obj) {
        // texture

        var manager = new THREE.LoadingManager();
        manager.onProgress = function(item, loaded, total) {

            // console.log(item, loaded, total);

        };

        var texture = new THREE.Texture();

        var loader = new THREE.ImageLoader(manager);
        loader.load(obj.imgPath, function(image) {

            texture.image = image;
            texture.needsUpdate = true;

        });

        // model

        var loader = new OBJLoader(manager);
        loader.load(obj.objPath, function(object) {

            object.traverse(function(child) {

                if (child instanceof THREE.Mesh) {

                    child.material.map = texture;

                }

            });
            object.scale.x = object.scale.y = object.scale.z = 10;
            object.updateMatrix();
            object.position.y = -3;

            for (var i = 0; i < scene.children.length; i++) {
                if (i > 1) {
                    scene.remove(scene.children[i])
                }
            }

            scene.add(object);

        }, onProgress, onError);
    }

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            // console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    function onError(xhr) {};

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function onDocumentMouseMove(event) {
        event.preventDefault(); // 阻止浏览器滚动

        /*mouseX = (event.clientX - windowHalfX) / 2;
        mouseY = (event.clientY - windowHalfY) / 2;*/

        var point = event.changedTouches[0];
        mouseX = (point.clientX - windowHalfX) / 2;
        mouseY = (point.clientY - windowHalfY) / 2;
    }

    //

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {

        camera.position.x += (mouseX - camera.position.x) * .5;
        camera.position.y += (-mouseY - camera.position.y) * .5;

        camera.lookAt(scene.position);

        renderer.render(scene, camera);

    }

    module.exports.init = init;
    module.exports.loadObj = loadObj;
});