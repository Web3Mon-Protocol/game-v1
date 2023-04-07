import { JoyStick } from './joystick'
import { ws } from '../network/websocket'
import { adjustMapPosition, transferMapTo } from './map'
import { users, myID, player, background } from '../js/global'
import { allowedBlocks } from '../data/collisions'
import { portals } from '../data/portals'

let lastKey = ''

let keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break

    case 'ArrowUp':
      keys.up.pressed = true
      lastKey = 'up'
      break
    
    case 'ArrowLeft':
      keys.left.pressed = true
      lastKey = 'left'
      break

    case 'ArrowDown':
      keys.down.pressed = true
      lastKey = 'down'
      break

    case 'ArrowRight':
      keys.right.pressed = true
      lastKey = 'right'
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break

    case 'a':
      keys.a.pressed = false
      break

    case 's':
      keys.s.pressed = false
      break

    case 'd':
      keys.d.pressed = false
      break

    case 'ArrowUp':
      keys.up.pressed = false
      break

    case 'ArrowLeft':
      keys.left.pressed = false
      break

    case 'ArrowDown':
      keys.down.pressed = false
      break

    case 'ArrowRight':
      keys.right.pressed = false
      break
  }
})

var joy = new JoyStick('joyDiv')
var joyStickMoving = false
export function joyToKey() {
  var x = joy.GetX()
  var y = joy.GetY()
  var moving = false
  if (y > 45) {
    keys.w.pressed = true
    lastKey = 'w'
    moving = true
  } else if (y < -45) {
    keys.s.pressed = true
    lastKey = 's'
    moving = true
  } else if (x > 45) {
    keys.d.pressed = true
    lastKey = 'd'
    moving = true
  } else if (x < -45) {
    keys.a.pressed = true
    lastKey = 'a'
    moving = true
  } else if (joyStickMoving) {
    keys.w.pressed = false
    keys.a.pressed = false
    keys.s.pressed = false
    keys.d.pressed = false
    joyStickMoving = false
  }
  joyStickMoving = moving
}

const lastSentPosition = {
  x: -100,
  y: -100,
}

function distancePowerofTwo(a, b) {
  return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
}

export function sendPosition(position) {
  var delta = distancePowerofTwo(lastSentPosition, position)
  // 50 이상 차이나면 무조건 전송
  // 버튼 안 눌렀으면 0 이상 차이나면 전송
  // 버튼 안 눌렀는데 0 인데 움직이고 있었으면 멈춤
  if (delta > 50) {
    sendPositionToServer(position)
  }
}

function sendPositionToServer(position) {
  const body = {
    Move: {
      coordinate: [position.x, position.y],
    },
  }

  lastSentPosition.x = position.x
  lastSentPosition.y = position.y

  const msg = JSON.stringify(body)
  ws.send(msg)
}

function checkDirection() {
  if (keys.w.pressed && lastKey === 'w') return 'up'
  if (keys.a.pressed && lastKey === 'a') return 'left'
  if (keys.s.pressed && lastKey === 's') return 'down'
  if (keys.d.pressed && lastKey === 'd') return 'right'
  if (keys.up.pressed && lastKey === 'up') return 'up'
  if (keys.left.pressed && lastKey === 'left') return 'left'
  if (keys.down.pressed && lastKey === 'down') return 'down'
  if (keys.right.pressed && lastKey === 'right') return 'right'
  return ''
}

const speed = 0.2
export function movePlayer(num = 1, passedTime) {

  const direction = checkDirection()
  if (direction === '') return
  
  var moving = true

  const plusOrNot = (direction === 'up') | (direction === 'left') ? 1 : -1
  const isX = (direction === 'left') | (direction === 'right') ? 1 : 0
  const isY = (direction === 'up') | (direction === 'down') ? 1 : 0

  const movedDistance = num * speed * passedTime
  const deltaX = movedDistance * plusOrNot * isX
  const deltaY = movedDistance * plusOrNot * isY

  player.setMoving(true)
  player.setDirection(direction)

  var myBlock = player.getNextBlock({
    x: deltaX,
    y: deltaY,
  })

  // collision check
  if (allowedBlocks[player.map][myBlock[0]][myBlock[1]] === 'X') moving = false
  var portal = portals[player.map][myBlock[0]][myBlock[1]]
  if (portal !== 'X') {
    transferMapTo(portal)
    return
  }

  if (moving) {
    player.setPosition(
      {
        x: player.position.x - deltaX,
        y: player.position.y - deltaY,
      },
      true
    )
    adjustMapPosition()
  }
}

export function movePlayerToPosition(x, y, relative) {
  var deltaX, deltaY
  if (relative) {
    deltaX = x
    deltaY = y
  } else {
    deltaX = player.position.x - x
    deltaY = player.position.y - y
  }
  background.position.x += deltaX
  background.position.y += deltaY
}
