import { Engine } from './engine/engine'
import { Vector2, Vector3, Vector4 } from './math/vector'
import { VolumetricRenderer } from './engine/renderer/volumetricRenderer'
import { ParallelProjectionCamera } from './engine/camera/parallelProjectionCamera'
import { Transform } from './engine/world/transform'
import { BoundingBox } from './math/matrix'
import { Actor } from './engine/world/actor'
import { Texture } from './assets/texture'
import { volumetricTextureGammaCorrectedShader as fragmentShader } from './engine/shaders/fragment/volumetricTextureGammaCorrectedShader'
import { volumetricTextureShader as vertexShader } from './engine/shaders/vertex/volumetricTextureShader'
import { MouseClicks } from './input/mouseClicks'
import { PointsModel } from './engine/models/pointsModel'
import { Program2D } from './engine/programs/program2d'

const box: BoundingBox = { near: 0.001, far: 100, left: -6.4, right: 6.4, bottom: -4.8, top: 4.8 }
const cameraTransform = new Transform(new Vector3(0, 0, 1), new Vector3(0, 0, 0), new Vector3(1, 1, 1))
const camera = new ParallelProjectionCamera(cameraTransform, box)

const renderer = new VolumetricRenderer(camera, new Vector3(0.5, 0.5, 0.5))
const engine = new Engine('canvas', renderer).init()

const pointsModel = new PointsModel()
const bezierCurveModel = new PointsModel()

const mouseClicks = new MouseClicks('canvas')
mouseClicks.addEventListener('line', pos => {
  // Scale positions.
  pos.x *= (box.right - box.left) / 2
  pos.y *= (box.top - box.bottom) / 2

  // Mirror positions along X axis.
  pos.x = Math.abs(pos.x)

  pointsModel.addPoint(pos)
  pointsModel.addPoint(new Vector2(-pos.x, pos.y))

  bezierCurveModel.addPoint(pos)

  compose()
})

/**
 * Create and compose the scene.
 */
function compose () {
  const points = new Actor(
    pointsModel.squares(0.1),
    new Transform(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
    new Program2D(new Texture('', new Vector4(255, 0, 0, 255)), new Texture('')),
    vertexShader,
    fragmentShader(new Vector3(0, 0, 0), camera.view(), 1_000_000)
  )

  console.log(bezierCurveModel.points())

  const curve = new Actor(
    bezierCurveModel.bezierCurve(0.01, 0.01, 0.1),
    new Transform(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
    new Program2D(new Texture('', new Vector4(0, 0, 255, 255)), new Texture('')),
    vertexShader,
    fragmentShader(new Vector3(0, 0, 0), camera.view(), 1_000_000)
  )

  engine.compose([points, curve])
}

/**
 * Render composed scene.
 */
function render () {
  engine.render()
  requestAnimationFrame(render)
}

const clicks = new MouseClicks('canvas')
clicks.addEventListener('console', pos => {
  console.log(pos)
})

compose()
render()
