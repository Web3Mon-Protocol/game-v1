import { canvas, stopAllPlay } from '../js/index'
import { battle } from './battleClient'
import { myID, users, player } from '../user/user'
import {
  clickOutSideProfileEvent,
  clickOutSideBattleCardEvent,
} from '../web/clickButtons'

/**
 * check whether click another player to battle.
 */
export function clickEvent() {
  canvas.addEventListener('click', (e) => {
    // need to be ready and not currently battling and in BATTLE map
    if (battle.started) return
    if (stopAllPlay) return
    // I should be ready
    if (!player.readyForBattle) return
    for (const key in users) {
      if (key === myID) continue
      var x = e.offsetX - users[key].sprite.width / 2
      var y = e.offsetY - users[key].sprite.height / 2
      // 상대방을 클릭한지에 대한 체크
      if (
        Math.abs(users[key].position.x - x) < users[key].sprite.width / 2 &&
        Math.abs(users[key].position.y - y) < users[key].sprite.height / 2
      ) {
        // opponent should be ready
        // if (!users[key].readyForBattle) break
        clickToStartBattle(key)
        break
      }
    }
  })
}

/**
 * when clicked another player to battle.
 * @param {string} key
 */
const clickToStartBattle = (key) => {
  // show battle request popup
  displayBattleAcceptPopup(key)

  // 배틀 제안
  battle.request(key)

  // 배틀 제안 취소
  document.getElementById('refuseBattleBtn').addEventListener('click', (e) => {
    document.getElementById('acceptBattleCard').style.display = 'none'
  })

  document.getElementById('seeOpponentInfo').addEventListener('click', (e) => {
    document.getElementById('acceptBattleCard').style.display = 'none'
    document.getElementById('profileCard').style.display = 'block'
    document.body.addEventListener(
      'click',
      (e) => {
        clickOutSideProfileEvent(e)
      },
      true
    )
  })
}

/**
 * 지금 클릭한 애랑 배틀 할거야? or 얘가 너랑 싸우고 싶다는데 배틀할거야? 보여주기
 * @param {string} key 상대방의 아이디
 */
export const displayBattleAcceptPopup = (key) => {
  document.body.addEventListener('click', clickOutSideBattleCardEvent, true)

  document.getElementById('acceptBattleBtn').style.display = 'inline-block'
  document.getElementById('refuseBattleBtn').style.display = 'inline-block'
  document
    .getElementById('acceptBattleBtn')
    .replaceWith(document.getElementById('acceptBattleBtn').cloneNode(true))
  document
    .getElementById('refuseBattleBtn')
    .replaceWith(document.getElementById('refuseBattleBtn').cloneNode(true))

  document.getElementById('acceptBattleCard').style.display = 'block'
  document.getElementById('battleOpponentName2').innerText =
    'Opponent: ' + users[key].sprite.name
}
