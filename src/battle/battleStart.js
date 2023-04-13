import { stopAllPlay } from '../js/index'
import { battle } from './battleClient'
import { myID, users, player } from '../js/global'
import { showCard } from '../web/battleCard'

/**
 * check whether click another player to battle.
 */
export function clickEvent() {
  const canvas = document.getElementById('game_canvas')
  canvas.addEventListener('click', (e) => {
    // need to be ready and not currently battling and in BATTLE map
    if (battle.playing) return
    if (stopAllPlay) return
    // I should be ready
    // if (!player.readyForBattle) return
    for (const key in users) {
      if (key === myID) continue
      var x = e.offsetX - users[key].sprite.width / 2
      var y = e.offsetY - users[key].sprite.height / 2
      // 상대방을 클릭한지에 대한 체크
      if (
        Math.abs(users[key].sprite.position.x - x) <
        users[key].sprite.width / 2 &&
        Math.abs(users[key].sprite.position.y - y) <
        users[key].sprite.height / 2
      ) {
        // opponent should be ready
        // if (!users[key].readyForBattle) break
        if (player.map === 'MAIN') {
          window.alert('MAIN MAP is not for BATTLE.')
          return
        }
        setUpBattleCard('request', key, null)
        break
      }
    }
  })
}

export function setUpBattleCard(type, key, battle_id) {
  var title
  var text
  var opponent = users[key]
  if (type === 'request') {
    title = 'Request Battle...'
    text = `Request To: ${opponent.name}`
  } else if (type === 'accept') {
    title = 'Incoming Battle...'
    text = `Request From: ${opponent.name}`
  }
  var content = `
    <div style="margin:5px">
    <img src=${opponent.nftUrl}/>
    </div>
    <p>${text}</p>
    <button id="parasConnectBtn" class="nes-btn is-primary">see on paras</button>
  `

  var yes = (e) => {
    if (type === 'request') {
      battle.request(key)
      showCard('Waiting...', 'Waiting for opponent to accept...')
    } else if (type === 'accept') {
      battle.accept(battle_id, key)
      showCard('Waiting...', 'Waiting for battle to start...')
    }
  }

  var no = (e) => {
    if (type === 'request') {
    } else if (type === 'accept') {
      battle.refuse(battle_id)
    }
    document.getElementById('battleCard').style.display = 'none'
    document.getElementById('battleCard').innerHTML = ''
  }
  showCard(title, content, yes, no)

  var parasURL = `https://paras.id/token/${opponent.nftCollection}::${opponent.tokenId}/${opponent.tokenId}`

  document.getElementById('parasConnectBtn').addEventListener('click', () => {
    window.open(parasURL, '_blank').focus()
  })

  // close card after 30 seconds
  setTimeout(() => {
    if (document.getElementById('battleCard').style.display === 'block') {
      no()
    }
  }, 30000)
}
