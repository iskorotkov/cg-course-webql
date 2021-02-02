import { init } from './init'
import { Program2D } from './programs/program2d'
import { planeShader } from './shaders/vertex/planeShader'
import { keepColorShader } from './shaders/fragment/keepColorShader'
import { clear, draw } from './graphics'
import { triangleModel } from './models/triangleModel'

export function run () {
  console.log('Initializing WebGL rendering context')
  const gl = init()

  console.log('Compile shaders')
  const vertexShader = planeShader.compile(gl)
  const fragmentShader = keepColorShader.compile(gl)

  console.log('Compile shader program')
  const program = new Program2D(vertexShader, fragmentShader)
  const compiled = program.compile(gl)

  console.log('Creating model')
  const prepared = triangleModel.prepare(gl)

  console.log('Drawing')
  clear(gl)
  draw(gl, compiled, prepared)
}
