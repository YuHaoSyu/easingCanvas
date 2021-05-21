let ease
with (Math) {
  ease = {
    Linear(x) {
      return x
    },

    InSine(x) {
      return 1 - cos((x * PI) / 2)
    },
    OutSine(x) {
      return sin((x * PI) / 2)
    },
    InOutSine(x) {
      return -(cos(PI * x) - 1) / 2
    },

    InQuad(x) {
      return x * x
    },
    OutQuad(x) {
      return 1 - (1 - x) * (1 - x)
    },
    InOutQuad(x) {
      return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2
    },

    InCubic(x) {
      return x ** 3
    },
    OutCubic(x) {
      return 1 - pow(1 - x, 3)
    },
    InOutCubic(x) {
      return x < 0.5 ? 4 * x ** 3 : 1 - pow(-2 * x + 2, 3) / 2
    },

    InQuart(x) {
      return x ** 4
    },
    OutQuart(x) {
      return 1 - pow(1 - x, 4)
    },
    InOutQuart(x) {
      return x < 0.5 ? 8 * x ** 4 : 1 - pow(-2 * x + 2, 4) / 2
    },

    InQuint(x) {
      return x ** 5
    },
    OutQuint(x) {
      return 1 - pow(1 - x, 5)
    },
    InOutQuint(x) {
      return x < 0.5 ? 16 * x ** 5 : 1 - pow(-2 * x + 2, 5) / 2
    },

    InExpo(x) {
      return x === 0 ? 0 : pow(2, 10 * x - 10)
    },
    OutExpo(x) {
      return x === 1 ? 1 : 1 - pow(2, -10 * x)
    },
    InOutExpo(x) {
      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? pow(2, 20 * x - 10) / 2
        : (2 - pow(2, -20 * x + 10)) / 2
    },

    InCirc(x) {
      return 1 - sqrt(1 - pow(x, 2))
    },
    OutCirc(x) {
      return sqrt(1 - pow(x - 1, 2))
    },
    InOutCirc(x) {
      return x < 0.5
        ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
        : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2
    },

    InBack(x) {
      const c1 = 1.70158
      const c3 = c1 + 1
      return c3 * x ** 3 - c1 * x * x
    },
    OutBack(x) {
      const c1 = 1.70158
      const c3 = c1 + 1

      return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2)
    },
    InOutBack(x) {
      const c1 = 1.70158
      const c2 = c1 * 1.525
      return x < 0.5
        ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
    },

    InElastic(x) {
      const c4 = (2 * PI) / 3
      return x === 0
        ? 0
        : x === 1
        ? 1
        : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4)
    },
    OutElastic(x) {
      const c4 = (2 * PI) / 3

      return x === 0
        ? 0
        : x === 1
        ? 1
        : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1
    },
    InOutElastic(x) {
      const c5 = (2 * PI) / 4.5
      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
        : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1
    },

    InBounce(x) {
      return 1 - this.OutBounce(1 - x)
    },
    OutBounce(x) {
      const n1 = 7.5625
      const d1 = 2.75
      if (x < 1 / d1) {
        return n1 * x * x
      } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75
      } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375
      } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375
      }
    },
    InOutBounce(x) {
      return x < 0.5
        ? (1 - this.OutBounce(1 - 2 * x)) / 2
        : (1 + this.OutBounce(2 * x - 1)) / 2
    },
  }
  function mapping(value, start1, end1, start2, end2, overRange = false) {
    const init = end1 - start1
    const final = end2 - start2
    const rate = final / init
    const result = (value - start1) * rate + start2

    if (!overRange) {
      const closeStart = abs(value - start1)
      const closeEnd = abs(value - end2)
      if (!value.isBetween(start1, end1))
        return closeStart > closeEnd ? end2 : start2
    }
    // if (!result.isBetween(start2, end2)) return end2
    return result
  }
}

class Transition {
  constructor(args) {
    let def = {
      duration: 300,
      delay: 0,
      easeFunc: 'Linear',
    }
    Object.assign(def, args)
    Object.assign(this, def)
    this.timer = 0
  }

  get change() {
    const { delay, duration, timer, easeFunc, from, to } = this

    let value = from
    if (timer < duration) {
      const percentage = (timer - delay) / duration
      value = mapping(ease[easeFunc](percentage), 0, 1, from, to, true)
      if (delay === 0) {
        this.timer += delta
      } else if (delay > 0) {
        this.delay = delay < 0 ? 0 : delay - delta
      } else if (delay < 0) {
        this.timer -= delay
        this.delay = 0
      }
    }
    return value
  }
}

function grid() {
  c.fillStyle = 'rgba(0, 0, 0, 0.4)'
  c.strokeStyle = 'rgba(0, 0, 0, 0.1)'
  c.beginPath()
  for (let i = 0; i < 1000; i += 25) {
    c.moveTo(0, i)
    c.lineTo(ww, i)
    c.fillText(500 - i, 1000, i)
    c.moveTo(i, 0)
    c.lineTo(i, wh)
    c.fillText(i, i, 500)
  }
  for (let i = 1000; i < 2000; i += 25) {
    c.moveTo(i, 0)
    c.lineTo(i, wh)
    c.fillText(i, i, 500)
  }

  c.stroke()
}

function cubicBezier(p1x, p1y, p2x, p2y) {
  const cX = 3 * p1x
  const bX = 3 * (p2x - p1x) - cX
  const aX = 1 - cX - bX
  const cY = 3 * p1y
  const bY = 3 * (p2y - p1y) - cY
  const aY = 1 - cY - bY
  const bezierX = (t) => t * (cX + t * (bX + t * aX))
  const bezierXDerivative = (t) => cX + t * (2 * bX + 3 * aX * t)
  const newtonRaphson = (x) => {
    let prev
    let t = x
    do {
      prev = t
      t = t - (bezierX(t) - x) / bezierXDerivative(t)
    } while (Math.abs(t - prev) > 1e-4)
    return t
  }

  return function (x) {
    const t = newtonRaphson(x)

    return t * (cY + t * (bY + t * aY))
  }
}

class Bar {
  constructor(args) {
    let def = { r: 15, translate: { x: 0, y: 0 } }
    Object.assign(def, args)
    Object.assign(this, def)
  }

  update() {
    const {
      drag,
      translate: { x: tx, y: ty },
    } = this
    drag.x += tx
    drag.y += ty
    this.translate = { x: 0, y: 0 }
  }
  draw() {
    const {
      fix: { x: fx, y: fy },
      drag: { x: dx, y: dy },
      translate: { x: tx, y: ty },
      r,
    } = this

    c.strokeStyle = 'rgba(0, 0, 0, 0.2)'
    c.lineWidth = 2
    c.beginPath()
    c.moveTo(fx, fy)
    c.lineTo(dx + tx, dy + ty)
    c.stroke()

    c.beginPath()
    c.fillStyle = '#FFFFFF'
    c.arc(fx, fy, r, 0, 2 * Math.PI)
    c.fill()
    c.stroke()
    c.fillStyle = this.color
    c.beginPath()
    c.arc(dx + tx, dy + ty, r, 0, 2 * Math.PI)
    c.fill()
    c.stroke()
  }
}
