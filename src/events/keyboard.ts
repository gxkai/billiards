import { Input } from "./input"

/**
 * Maintains a map of pressed keys.
 *
 * Produces events while key is pressed with elapsed time
 */
export class Keyboard {
  pressed = {}
  released = {}

  getEvents() {
    let keys = Object.keys(this.pressed)
      .filter((key) => !/.*Shift.*/.test(key))
      .filter((key) => !/.*Control.*/.test(key))
    let shift = Object.keys(this.pressed).some((key) => /.*Shift.*/.test(key))
    let control = Object.keys(this.pressed).some((key) =>
      /.*Control.*/.test(key)
    )
    let result: Input[] = []

    keys.forEach((k) => {
      let t = performance.now() - this.pressed[k]
      result.push(new Input(control ? t / 3 : t, shift ? "Shift" + k : k))
      if (k != "Space") {
        this.pressed[k] = performance.now()
      }
    })

    Object.keys(this.released).forEach((key) =>
      result.push(new Input(this.released[key], key + "Up"))
    )

    this.released = {}
    return result
  }

  constructor(element) {
    this.addHandlers(element)
  }

  keydown = (e) => {
    e = e || window.event
    if (this.pressed[e.code] == null) {
      this.pressed[e.code] = performance.now()
    }
    e.stopImmediatePropagation()
    if (e.key !== "F12") {
      e.preventDefault()
    }
  }

  keyup = (e) => {
    e = e || window.event
    this.released[e.code] = performance.now() - this.pressed[e.code]
    delete this.pressed[e.code]
    e.stopImmediatePropagation()
    if (e.key !== "F12") {
      e.preventDefault()
    }
  }

  mousemove = (e) => {
    if (e.buttons === 1) {
      if (this.released["movementY"]) {
        this.released["movementX"] += e.movementX
      } else {
        this.released["movementX"] = e.movementX
      }

      if (this.released["movementY"]) {
        this.released["movementY"] += e.movementY
      } else {
        this.released["movementY"] = e.movementY
      }
    }
  }

  private addHandlers(element) {
    document.addEventListener("keydown", this.keydown)
    document.addEventListener("keyup", this.keyup)
    element.addEventListener("pointermove", this.mousemove)
  }
}
