import { Ball } from "../model/ball"
import { TableGeometry } from "../view/tablegeometry"
import { Vector3 } from "three"
import { roundVec } from "./utils"

export class Rack {
  static readonly noise = 0.05
  static readonly gap = 1.0 + 2 * Rack.noise
  static readonly up = new Vector3(0, 0, -1)

  private static jitter(pos) {
    return roundVec(
      pos
        .clone()
        .add(
          new Vector3(
            Rack.noise * (Math.random() - 0.5),
            Rack.noise * (Math.random() - 0.5),
            0
          )
        )
    )
  }

  static cueBall() {
    return new Ball(new Vector3(-11, 0.0, 0), 'textures/0.png')
  }

  static diamond() {
    const across = new Vector3(0, Rack.gap, 0)
    const diagonal = across.clone().applyAxisAngle(Rack.up, (Math.PI * 1) / 3)
    const pos = new Vector3(TableGeometry.tableX / 2, 0, 0)
    const diamond: Ball[] = []
    diamond.push(Rack.cueBall())
    diamond.push(new Ball(Rack.jitter(pos), 'textures/1.png'))
    pos.add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/15.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/3.png'))
    pos.add(across).add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/4.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/8.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/14.png'))
    pos.add(across).add(across).add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/13.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/5.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/12.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/6.png'))
    pos.add(across).add(across).add(across).add(diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/7.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/11.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/9.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/10.png'))
    pos.sub(across)
    diamond.push(new Ball(Rack.jitter(pos), 'textures/2.png'))
    Rack.initialiseIndicies(diamond)
    return diamond
  }

  static initialiseIndicies(balls: Ball[]) {
    balls.forEach((x, i) => (x.index = i))
  }
}
