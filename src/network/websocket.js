import { endBattle } from '../battle/battleScene'
import { local_position } from '../js/index'
import { ACTION, CHAT, NETWORK } from './callType'
import { npc_list } from '../data/npc'
import {
  displayBattleAcceptPopup,
  setUpBattleCard,
} from '../battle/battleStart'
import { battle } from '../battle/battleClient'
import { User, player } from '../user/user'
import { myID, setMyID } from '../js/global'
import { turnToGameScreen } from '../user/logIn'
import { moveUser } from '../control/move'
import { transferMapTo } from '../control/map'
import { users } from '../js/global'
import { websocketUrl } from '../data/accountsAndUrls'

export let ws = null
const wsQueue = []

function onmessage(type, data) {
  if (type !== ACTION.MOVE) console.log('내려왔습니다', type, data)

  let id = data.id

  switch (type) {
    case 'your_player_id':
      setMyID(data)
      turnToGameScreen()
      console.log('My ID: ' + myID)

    case NETWORK.JOIN:
      // 유저가 들어왔다.
      break

    case NETWORK.LEAVE:
      delete users[data.leaved_player_id]
      break

    case NETWORK.MAP_STATUS:
      var currentUsers = new Set()
      data['player_infos_for_view'].forEach((avatar) => {
        currentUsers.add(avatar.player_id)
        // temporary
        if (avatar.player_id === myID) {
          if (avatar.token_id === 'polygon')
            safe_send({
              BoardCastChat: {
                content: JSON.stringify({
                  nftCollection: 'Polygon Apes',
                  tokenId: '10',
                  chain: 'POLYGON',
                  nftUrl:
                    'https://ipfs.io/ipfs/Qmd6B6zQodChv6mMaWjMLidvRKvASXyjXEhF5McsiEr2tV/10.png',
                  clothes_nft_url: avatar.clothes_nft_url,
                  coordinate: [0, 0],
                }),
              },
            })
          if (avatar.token_id === 'polygon')
            safe_send({
              BoardCastChat: {
                content: JSON.stringify({
                  nftCollection: 'Galactic Punks',
                  tokenId: '100',
                  chain: 'TERRA',
                  nftUrl:
                    'https://ipfs.talis.art/ipfs/QmdUGyDFFBZMf92nf1fXxjoy2sNNL8oJbk1YBDCQzYfLuz/0.png',
                  clothes_nft_url: avatar.clothes_nft_url,
                  coordinate: [0, 0],
                }),
              },
            })
        }

        if (!(avatar.player_id in users)) {
          if (avatar.token_id !== 'terra' && avatar.token_id !== 'polygon') {
            var newUser = new User(
              avatar.player_id,
              avatar.collection,
              avatar.token_id,
              avatar.chain,
              avatar.nft_image_url,
              avatar.clothes_nft_url.substring(83).replace('.png', ''),
              'MAIN',
              avatar.coordinate
            )
            users[avatar.player_id] = newUser
          }
          //   newUser.setPosition(avatar.coordinate)
        }
      })
      for (var key in users) if (!currentUsers.has(key)) delete users[key]
      break

    case ACTION.MOVE:
      const id = data.player_key

      if (id === myID) {
        return
      }

      if (!(id in users)) {
        return
      }

      // 디렉션 계산해서 이미지 부여하기
      const newPosition = {
        x: data.coordinate[0],
        y: data.coordinate[1],
      }

      const isRight = users[id].targetPosition.x - newPosition.x < -1
      const isBottom = users[id].targetPosition.y - newPosition.y < -1
      const isLeft = users[id].targetPosition.x - newPosition.x > 1
      const isUp = users[id].targetPosition.y - newPosition.y > 1

      if (isUp) users[id].setDirection('up')
      else if (isBottom) users[id].setDirection('down')
      else if (isLeft) users[id].setDirection('left')
      else if (isRight) users[id].setDirection('right')

      // smooth move
      users[id].setPosition(newPosition, false)
      break

    // use as a tmp broadcaster
    case CHAT.BOARD_CAST_CHAT:
      if (data['content'][0] === '{') {
        var user_info = JSON.parse(data['content'])
        if (!(data.send_player_id in users))
          users[data.send_player_id] = new User(
            data.send_player_id,
            user_info.nftCollection,
            user_info.tokenId,
            user_info.chain,
            user_info.nftUrl,
            user_info.clothes_nft_url.substring(83).replace('.png', ''),
            'MAIN',
            user_info.coordinate
          )
      } else if (data.send_player_id !== myID) {
        users[data.send_player_id].showChat(data['content'])
      }
      break
    
    case CHAT.WHISPER_CHAT:
      battle.receiveChat(data)

    case 'ReadyBattle':
      break

    case ACTION.MAP_TRANSFER:
      break

    case NETWORK.BATTLE_INIT:
      battle.init(data.battle_id, data.next_turn_expired_at)
      break

    case NETWORK.BATTLE_OFFER:
      setUpBattleCard('accept', data.proposer_player_id, data.battle_id)
      break

    case NETWORK.BATTLE_REJECT:
      if (!battle.playing) {
        if (data.reason === 0) window.alert('Opponent is already on Battle')
        else if (data.reason === 1) window.alert('Opponent Refused to Battle')
      }

      break

    case NETWORK.BATTLE:
      if (data.message_type === 'Ok') {
        battle.channelHandler.status.is_ok = true
      } else if (data.message_type === 'Next') {
        battle.channelHandler.receive_queue.push('next')
      } else if (data.message_type === 'ByPass') {
        battle.channelHandler.receive_queue.push(data.content)
      } else if (data.message_type === 'ConsensusState') {
        battle.channelHandler.receive_queue.push(data.content)
      }
      break

    case 'BattleCloseChannel':
      break

    default:
      log_error('Unknown message received:')
      log_error(type)
  }
}
var wsInterval

export function onopen() {
  log('Server Connected')
  clearInterval(wsInterval)
  wsInterval = setInterval(() => {
    if (!checkOrReconnect()) return
    var msg = wsQueue.shift()
    if (msg != null)
      try {
        ws.send(msg)
      } catch (e) {
        wsQueue.push(msg)
      }
  }, 1000)
}

export function onerror(data) {
  console.dir(data)
}

export function log(text) {
  var time = new Date()
}

export function log_error(text) {
  var time = new Date()
  console.trace('[' + time.toLocaleTimeString() + '] ' + text)
}

export function reportError(errMessage) {
  log_error(`Error ${errMessage.name}: ${errMessage.message}`)
}

function checkOrReconnect() {
  if (!ws) {
    connect()
    return false
  }
  if (ws.readyState === WebSocket.CONNECTING) return false

  if (ws.readyState === WebSocket.OPEN) {
    return true
  }
  // reconnect if closed or errored
  connect()
  return false
}

// used to prevent websocket send failure
export function safe_send(msg) {
  wsQueue.push(JSON.stringify(msg))
}

/**
 * 서버와 연결하도록 하는 함수
 * ws = new WebSocket(serverUrl)
 */
export function connect() {
  let serverUrl

  if (ws != undefined) {
    ws.onerror = ws.onopen = ws.onclose = null
    ws.close()
  }

  serverUrl = websocketUrl + sessionStorage.getItem('jwt')

  ws = new WebSocket(serverUrl)

  ws.binaryType = 'arraybuffer'

  ws.onopen = (e) => {
    console.log('Websocket server is Open', e)
    onopen()
  }

  ws.onerror = ({ data }) => onerror(data)
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    const type = Object.keys(msg)[0]
    onmessage(type, msg[type])
  }
  ws.onclose = function (e) {
    console.log('Websocket Server is Closed! with : ', e)
    clearInterval(wsInterval)
    ws = null
  }
}
