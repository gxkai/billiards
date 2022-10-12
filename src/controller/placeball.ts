import { ControllerBase } from "./controllerbase"
import { Controller, Input } from "./controller"
import { Aim } from "./aim"
import { MathUtils } from "three"
import { TableGeometry } from "../view/tablegeometry"
import { BreakEvent } from "../events/breakevent"
import { round } from "../utils/utils"
import { Vector3 } from "three"

/**
 * Place cue ball using input events.
 *
 * Needs to be configurable to break place ball and post foul place ball anywhere legal.
 */
export class PlaceBall extends ControllerBase {
  readonly placescale = 0.01

  constructor(container) {
    super(container)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.table.cue.aim.power = 0
    this.container.view.camera.forceMode(this.container.view.camera.aimView)
    this.container.table.cue.mesh.visible = false
  }

  onFirst() {
    const cueBall = this.container.table.balls[0]
    cueBall.pos = new Vector3(-11, 0, 0)
    cueBall.setStationary()
    cueBall.updateMesh(0)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
  }

  handleInput(input: Input): Controller {
    switch (input.key) {
      case "ArrowLeft":
        this.container.table.balls[0].pos.y = MathUtils.clamp(
          round(
            this.container.table.balls[0].pos.y + input.t * this.placescale
          ),
          -TableGeometry.tableY,
          TableGeometry.tableY
        )
        break
      case "ArrowRight":
        this.container.table.balls[0].pos.y = MathUtils.clamp(
          round(
            this.container.table.balls[0].pos.y - input.t * this.placescale
          ),
          -TableGeometry.tableY,
          TableGeometry.tableY
        )
        break
      case "ArrowUp":
        this.container.table.balls[0].pos.x = MathUtils.clamp(
            round(
                this.container.table.balls[0].pos.x + input.t * this.placescale
            ),
            -TableGeometry.tableX,
            TableGeometry.tableX,
        )
        break
      case "ArrowDown":
        this.container.table.balls[0].pos.x = MathUtils.clamp(
            round(
                this.container.table.balls[0].pos.x - input.t * this.placescale
            ),
            -TableGeometry.tableX,
            TableGeometry.tableX,
        )
        break
      case "movementXUp":
        this.container.table.balls[0].pos.y = MathUtils.clamp(
          round(
            this.container.table.balls[0].pos.y - input.t * this.placescale * 2
          ),
          -TableGeometry.tableY,
          TableGeometry.tableY
        )
        break

      case "SpaceUp":
        return this.placed()
      default:
        this.commonKeyHandler(input)
    }

    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.view.camera.forceMove(this.container.table.cue.aim)
    this.container.sendEvent(this.container.table.cue.aim)

    return this
  }

  placed() {
    this.container.table.cue.mesh.visible = true
    this.container.table.cue.aim.round()
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.sendEvent(
      new BreakEvent(this.container.table.shortSerialise())
    )
    return new Aim(this.container)
  }
}
