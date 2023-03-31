import { gsap } from 'gsap'
import {
  initBattle,
  battleBackground,
} from './battleScene'
import { animate } from '../animate'
import { addBattleSkillBox } from './initialSetting'
import { SKILL_INFOS } from '../data/skill'
import { users, player, battleRenderedSprites } from '../js/global'

export let battleAnimationId
let previousTime

/**
 * battle animation start logic
 * @param {any} animationId idk
 */
export function enterBattle(battleState, my_index, opponent_id) {
  console.log('enter battle')
  document.getElementById('skill_box_temp').style.display = 'none'
  addBattleSkillBox(battleState, my_index)
  const animationId = window.requestAnimationFrame(animate)
  // deactivate current animation loop
  window.cancelAnimationFrame(animationId)

  gsap.to('#overlappingDiv', {
    opacity: 1,
    repeat: 3,
    yoyo: true,
    duration: 0.1,
    onComplete() {
      gsap.to('#overlappingDiv', {
        opacity: 1,
        duration: 0.1,
        onComplete() {
          // activate a new animation loop
          enterImageAnimation(opponent_id, my_index, battleState)
          initBattle(opponent_id, battleState, my_index)
          animateBattle()
          gsap.to('#overlappingDiv', {
            opacity: 0,
            duration: 0.1,
          })
        },
      })
    },
  })
}

export function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)

  battleBackground.setScale(
    Math.max(
      window.innerWidth / battleBackground.image.width,
      window.innerHeight / battleBackground.image.height
    )
  )

  battleBackground.position = {
    x: window.innerWidth / 2 - battleBackground.width / 2,
    y: window.innerHeight / 2 - battleBackground.height / 2,
  }

  var newTime = performance.now()
  var passedTime = newTime - previousTime
  previousTime = newTime

  battleBackground.draw(passedTime)

  for (const key in battleRenderedSprites) {
    battleRenderedSprites[key].draw(passedTime)
  }
}

const enterImageAnimation = (opponent_id, my_index, battleState) => {
  document.getElementById('enter_img').src = player.nftUrl
  document.getElementById('opp_enter_img').src = users[opponent_id].nftUrl
  document.getElementById('enter_collection').innerText = player.nftCollection
  document.getElementById('enter_name').innerText = player.name
  for (var i = 0; i < 3; i++) {
    var skillType = battleState.player_skills[my_index][i].type
    var desc_item = document.createElement('div')
    desc_item.setAttribute('class', 'desc_item')
    var skill_label = document.createElement('div')
    skill_label.setAttribute('class', 'skill_label')
    skill_label.innerText = `Attack ${i + 1}`
    desc_item.append(skill_label)
    var skill_img_container = document.createElement('div')
    skill_img_container.setAttribute('class', 'skill_img_container')
    var skill_img = document.createElement('img')
    skill_img.setAttribute('class', 'skill_img')
    skill_img.src = `../../img/skillThumbnails/${SKILL_INFOS[skillType].img}`
    skill_img_container.append(skill_img)
    desc_item.append(skill_img_container)
    document.getElementById('selected_attack_skills').append(desc_item)

    var skillType = battleState.player_skills[my_index][i + 3].type
    var desc_item = document.createElement('div')
    desc_item.setAttribute('class', 'desc_item')
    var skill_label = document.createElement('div')
    skill_label.setAttribute('class', 'skill_label')
    skill_label.innerText = `Attack ${i + 1}`
    desc_item.append(skill_label)
    var skill_img_container = document.createElement('div')
    skill_img_container.setAttribute('class', 'skill_img_container')
    var skill_img = document.createElement('img')
    skill_img.setAttribute('class', 'skill_img')
    skill_img.src = `../../img/skillThumbnails/${SKILL_INFOS[skillType].img}`
    skill_img_container.append(skill_img)
    desc_item.append(skill_img_container)
    document.getElementById('selected_defence_skills').append(desc_item)
  }

  for (var i = 0; i < 3; i++) {
    var skillType = battleState.player_skills[1 - my_index][i].type
    var desc_item = document.createElement('div')
    desc_item.setAttribute('class', 'desc_item')
    var skill_label = document.createElement('div')
    skill_label.setAttribute('class', 'skill_label')
    skill_label.innerText = `Attack ${i + 1}`
    desc_item.append(skill_label)
    var skill_img_container = document.createElement('div')
    skill_img_container.setAttribute('class', 'skill_img_container')
    var skill_img = document.createElement('img')
    skill_img.setAttribute('class', 'skill_img')
    skill_img.src = `../../img/skillThumbnails/${SKILL_INFOS[skillType].img}`
    skill_img_container.append(skill_img)
    desc_item.append(skill_img_container)
    document.getElementById('op_selected_attack_skills').append(desc_item)

    var skillType = battleState.player_skills[1 - my_index][i + 3].type
    var desc_item = document.createElement('div')
    desc_item.setAttribute('class', 'desc_item')
    var skill_label = document.createElement('div')
    skill_label.setAttribute('class', 'skill_label')
    skill_label.innerText = `Attack ${i + 1}`
    desc_item.append(skill_label)
    var skill_img_container = document.createElement('div')
    skill_img_container.setAttribute('class', 'skill_img_container')
    var skill_img = document.createElement('img')
    skill_img.setAttribute('class', 'skill_img')
    skill_img.src = `../../img/skillThumbnails/${SKILL_INFOS[skillType].img}`
    skill_img_container.append(skill_img)
    desc_item.append(skill_img_container)
    document.getElementById('op_selected_defence_skills').append(desc_item)
  }

  document.querySelector('#battle_enter').style.transition = 'all 0s ease-out'
  document.querySelector('#battle_enter').style.opacity = 1
  document.querySelector('#battle_enter').style.zIndex = 1000
  setTimeout(() => {
    document.querySelector('#battle_enter').style.transition =
      'all 1.2s ease-out'
    document.querySelector('#battle_enter').style.opacity = 0
    document.querySelector('#battle_enter').style.zIndex = -5
  }, 5000)
}
