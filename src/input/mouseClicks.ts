import { Vector2 } from '../math/vector'

interface Map {
    [key: string]: ((position: Vector2) => void) | undefined
}

export class MouseClicks {
    private listeners: Map = {}

    constructor (elementID: string) {
      const canvas = document.getElementById(elementID) as HTMLCanvasElement
      if (!canvas) {
        throw new Error('No element was found with provided ID')
      }

      canvas.addEventListener('click', e => {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const clipX = x / rect.width * 2 - 1
        const clipY = y / rect.height * -2 + 1

        const position = new Vector2(clipX, clipY)

        for (const key of Object.keys(this.listeners)) {
          const callback = this.listeners[key]
          if (callback) {
            callback(position)
          }
        }
      })
    }

    addEventListener (key: string, callback: (position: Vector2) => void) {
      this.listeners[key] = callback
    }

    removeEventListener (key: string) {
      this.listeners[key] = undefined
    }
}
