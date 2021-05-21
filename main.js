let ww = document.documentElement.clientWidth
let wh = document.documentElement.clientHeight - 4
canvas.width = ww
canvas.height = wh
let c = canvas.getContext('2d')

let fps = 100
let now
let then = Date.now()
let interval = 1000 / fps
let delta

Number.prototype.isBetween = function (a, b) {
  let min = Math.min(a, b)
  let max = Math.max(a, b)
  return min < this && this < max
}

// let step = 0

ease.cubicBezier = cubicBezier(p1x.value, p1y.value, p2x.value, p2y.value)

let leftBottom, rightBottom, rightTop
let p1Bar, p2Bar
function updateCoor() {
  leftBottom = { x: +easeLeft.value, y: +easeTop.value + 500 }
  rightBottom = {
    x: +easeLeft.value + +easeWidth.value,
    y: +easeTop.value + 500,
  }
  rightTop = {
    x: +easeLeft.value + +easeWidth.value,
    y: +easeTop.value - easeHeight.value + 500,
  }

  //todo :改為更新座標，不重新new
  p1Bar = new Bar({
    fix: { x: leftBottom.x, y: leftBottom.y },
    drag: {
      x: leftBottom.x + p1x.value * +easeWidth.value,
      y: leftBottom.y - p1y.value * +easeHeight.value,
    },
    color: '#FF0088',
  })

  p2Bar = new Bar({
    fix: { x: rightTop.x, y: rightTop.y },
    drag: {
      x: rightTop.x - (1 - p2x.value) * +easeWidth.value,
      y: rightTop.y + (1 - p2y.value) * +easeHeight.value,
    },
    color: '#00AABB',
  })
}
updateCoor()

let trY, trX
grid()
changeHandler()
p1Bar.draw()
p2Bar.draw()
function draw(t) {
  c.fillStyle = 'black'
  c.beginPath()
  c.arc(trX.change, trY.change, 3, 0, 2 * Math.PI)
  c.fill()
}
let canvasEvt = {
  dragStart: { x: 0, y: 0 },
  mousemove(e) {
    const {
      dragStart: { x: dx, y: dy },
      activeBar,
    } = canvasEvt
    let movement = { x: e.x - dx, y: e.y - dy }
    activeBar.translate = movement
    drawItem()
  },

  isDragging(e, bar) {
    if (Math.sqrt((e.x - bar.drag.x) ** 2 + (e.y - bar.drag.y) ** 2) <= 15) {
      this.activeBar = bar
      this.dragStart = { x: e.x, y: e.y }
    } else {
      return
    }
  },
  activeBar: null,
  evt: {
    mousedown(e) {
      canvasEvt.isDragging(e, p1Bar)
      canvasEvt.isDragging(e, p2Bar)
      if (canvasEvt.activeBar) {
        this.addEventListener('mousemove', canvasEvt.mousemove)
      }
    },
    mouseup(e) {
      if (canvasEvt.activeBar) {
        this.removeEventListener('mousemove', canvasEvt.mousemove)

        canvasEvt.activeBar.update()
        this.activeBar = null
        this.dragStart = { x: 0, y: 0 }
        changeHandler()
      }
    },
  },
}
for (const [evt, handler] of Object.entries(canvasEvt.evt)) {
  canvas.addEventListener(evt, handler)
}
select.addEventListener('change', changeHandler)

Array.prototype.forEach.call(document.getElementsByTagName('input'), (el) =>
  el.addEventListener('change', changeHandler)
)

function drawItem() {
  c.clearRect(0, 0, ww, wh)
  grid()
  p1Bar.draw()
  p2Bar.draw()
  c.strokeStyle = 'red'

  c.beginPath()
  c.moveTo(leftBottom.x, leftBottom.y)
  c.lineTo(rightBottom.x, rightBottom.y)
  c.lineTo(rightTop.x, rightTop.y)
  c.stroke()
}

function changeHandler() {
  // updateCoor()
  ease.cubicBezier = cubicBezier(p1x.value, p1y.value, p2x.value, p2y.value)
  drawItem()

  trX = new Transition({
    from: leftBottom.x,
    to: +easeLeft.value + +easeWidth.value,
    duration: +duration.value,
    easeFunc: 'Linear',
    delay: +delay.value,
  })
  trY = new Transition({
    from: leftBottom.y,
    to: +easeTop.value - easeHeight.value + 500,
    duration: +duration.value,
    easeFunc: select.value,
    delay: +delay.value,
  })
}

function update(t) {
  now = Date.now()
  delta = now - then
  if (delta > interval) {
    then = now - (delta % interval)
    draw()
  }
  requestAnimationFrame(update)
}
requestAnimationFrame(update)
