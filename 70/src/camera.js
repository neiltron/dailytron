// written by gregtatum
// https://github.com/gregtatum/sessions/blob/gh-pages/010/scene.js

import dimensions from './dimensions';

const vec3 = require('gl-vec3')
const mat3 = require('gl-mat3')
const mat4 = require('gl-mat4')
const createControls = require('orbit-controls')
const createCamera = require('perspective-camera')

const TAU = 6.283185307179586
const FOV = TAU * 0.25
const ORIGIN = [0, 0, 0]

module.exports = function (regl) {
  const camera = createCamera({
    fov: FOV,
    near: 0.01,
    far: 100,
    viewport: [0, 0, dimensions.width, dimensions.height]
  })

  const controls = createControls({
    // thetaBounds: [Math.PI * -.25, Math.PI * .25],
    // phiBounds: [1, Math.PI / 1.5],
    theta: -Math.PI,
    phi: Math.PI / 1.98,
    distanceBounds: [-10, 10],
    distance: 0,
    zoomSpeed: 0.0001,
    pinchSpeed: 0.0001,
    rotateSpeed: 0.01,
    damping: 0.01,
    parent: regl._gl.canvas,
    element: regl._gl.canvas,
    zoom: true,
    rotate: true,
  })

  camera.update()

  let prevTick
  function update (callback) {
    return ({time, tick, viewportWidth, viewportHeight}) => {
      if (tick !== prevTick) {
        // vec3.rotateY(controls.position, controls.position, ORIGIN, 0.001)
        controls.update()
        controls.copyInto(camera.position, camera.direction, camera.up)
        camera.viewport[2] = viewportWidth
        camera.viewport[3] = viewportHeight
        camera.update()
        prevTick = tick
      }
      return callback.apply(null, arguments)
    }
  }

  return regl({
    uniforms: {
      projection: update(() => camera.projection),
      view: () => camera.view,
      viewRotation: withArrays(1, ([out]) => {
        mat4.copy(out, camera.view)
        return out
      }),
      projView: () => camera.projView,
      invProjView: () => camera.invProjView,
      viewNormal: withArrays(1, ([out]) => mat3.normalFromMat4(out, camera.view)),
      projectionViewNormal: withArrays(1, ([out]) => mat3.normalFromMat4(out, camera.projView)),
      time: ({time}) => time,
      cameraPosition: () => camera.position
    },
    context: {
      fov: FOV
    }
  })
}

function withArrays (length, callback) {
  const arrays = []
  for (let i = 0; i < length; i++) {
    arrays.push([])
  }
  const args = [arrays]
  return (context, props) => {
    for (let i = 0; i < arguments.length; i++) {
      args[i + 1] = arguments[i]
    }
    return callback.apply(null, args)
  }
}
