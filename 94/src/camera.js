// written by gregtatum
// https://github.com/gregtatum/sessions/blob/gh-pages/010/scene.js

const vec3 = require('gl-vec3')
const mat3 = require('gl-mat3')
const mat4 = require('gl-mat4')
const createControls = require('orbit-controls')
const createCamera = require('perspective-camera')

const TAU = 6.283185307179586
const FOV = TAU * 0.1
const ORIGIN = [0, 0, 0]

module.exports = function (regl) {
  const camera = createCamera({
    fov: FOV,
    near: 0.01,
    far: 100,
    position: [0, 0, 10]
  })

    // center: [0, 4, 0],
//   distance: 4,
//   theta: Math.PI / 2,
//   phi: -Math.PI * .45,
//   mouse: false

  const controls = createControls({
    // thetaBounds: [Math.PI * -.25, Math.PI * .25],
    // phiBounds: [1, Math.PI / 1.5],
    theta: Math.PI / 2,
    phi: Math.PI / 2,
    distanceBounds: [0, 10],
    distance: 3,
    zoomSpeed: 0.0001,
    pinchSpeed: 0.0001,
    rotateSpeed: 0.01,
    damping: 0.01,
    parent: regl._gl.canvas,
    element: regl._gl.canvas,
    zoom: true,
    rotate: false
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
      light0: vec3.normalize([], [0, 1, 0.1]),
      light1: vec3.normalize([], [0.5, -1, 0.1]),
      lightColor0: vec3.scale([], [1.0, 0.9, 0.9], 1.4),
      lightColor1: vec3.scale([], [0.2, 1.0, 1.0], 0.8),
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
