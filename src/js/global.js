import { Sprite } from "../object/Sprite"

export const users = {}
export const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
})

export const battleRenderedSprites = {}
export let myID
export let player

export function setPlayer(p) {
    player = p
}

export function setMyID(id) {
    myID = id
}

export let selectedSkill = []
export let selectedDefenceSkills = []
export const fixedObjects = {}