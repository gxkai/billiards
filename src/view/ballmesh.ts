import {
  IcosahedronGeometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  CircleGeometry,
  MeshBasicMaterial,
  ArrowHelper, MeshStandardMaterial, SphereGeometry,
} from "three"
import { State } from "../model/ball"
import { norm, up, zero } from "./../utils/utils"
import {importTexture} from "../utils/gltf";

export class BallMesh {
  mesh: Mesh
  shadow: Mesh
  spinAxisArrow: ArrowHelper
  constructor(textureUrl) {
    this.initialiseMesh(textureUrl)
  }

  updatePosition(pos) {
    this.mesh.position.copy(pos)
    this.shadow.position.copy(pos)
  }

  m = new Matrix4()

  updateRotation(rvel, t) {
    const angle = rvel.length() * t
    const m = this.m.identity().makeRotationAxis(norm(rvel), angle)
    this.mesh.geometry.applyMatrix4(m)
  }

  updateArrows(pos, rvel, state) {
    this.spinAxisArrow.setLength(0.4 + rvel.length() / 2, 0.1, 0.1)
    this.spinAxisArrow.position.copy(pos)
    this.spinAxisArrow.setDirection(norm(rvel))
    if (state == State.Rolling) {
      this.spinAxisArrow.setColor(0xff0000)
    } else {
      this.spinAxisArrow.setColor(0x00ff00)
    }
  }

  initialiseMesh(textureUrl) {
    // const geometry = new IcosahedronGeometry(0.5, 1)
    const geometry = new SphereGeometry(0.5, 128, 128)
    const texture = importTexture(textureUrl)
    // const material = new MeshPhongMaterial({
    //   color: 0xffffff,
    //   emissive: 0,
    //   flatShading: true,
    //   map: texture
    // })
    const material = new MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0,
      flatShading: true,
      roughness: 0.25,
      metalness: 0,
      map: texture
    })
    this.mesh = new Mesh(geometry, material)
    this.mesh.name = "ball"

    const shadowGeometry = new CircleGeometry(0.45, 100)
    shadowGeometry.applyMatrix4(
        new Matrix4().identity().makeTranslation(0, 0, -0.49)
    )
    const shadowMaterial = new MeshBasicMaterial({color: 0x111122})
    this.shadow = new Mesh(shadowGeometry, shadowMaterial)
    this.spinAxisArrow = new ArrowHelper(up, zero, 2, 0x000000)
  }
}
