import Expo from 'expo';
import React from 'react';
import { StyleSheet, PixelRatio } from 'react-native';

import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import ExpoGame from 'expo-game';

export default class App extends React.Component {
  render() {
    // Create an `ExpoGame.View` covering the whole screen, tell it to call our
    // `_onGLContextCreate` function once it's initialized.
    return (
      <ExpoGame.View
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
      />
    );
  }

  // This is called by the `Expo.GLView` once it's initialized
  onContextCreate = async gl => {
    // Based on https://threejs.org/docs/#manual/introduction/Creating-a-scene
    // In this case we instead use a texture for the material (because textures
    // are cool!). All differences from the normal THREE.js example are
    // indicated with a `NOTE:` comment.

    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scale = PixelRatio.get();

    // NOTE: How to create an `Expo.GLView`-compatible THREE renderer
    this.renderer = ExpoTHREE.createRenderer({ gl });
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width / scale, height / scale);
    this.renderer.setClearColor(0x000000, 1.0);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      // NOTE: How to create an Expo-compatible THREE texture
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require('../assets/icons/app-icon.png')),
      }),
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  };

  onResize = ({ x, y, width, height }) => {
    const scale = PixelRatio.get();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = delta => {
    this.cube.rotation.x += 3.5 * delta;
    this.cube.rotation.y += 2 * delta;
    this.renderer.render(this.scene, this.camera);
  };
}