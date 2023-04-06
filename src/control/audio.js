// music control
export function playMusic(id) {
    pauseMusic()
    var music = document.getElementById(id)
    // repeat
    music.loop = true
    music.play()
}

// pause all music
function pauseMusic() {
    var music = document.getElementById('villageAudio')
    music.pause()
    var music = document.getElementById('battleAudio')
    music.pause()
    var music = document.getElementById('battleMapAudio')
    music.pause()
}

function muteMusic() {
    document.getElementById('musicBtn').innerText = '🔇'
    var music = document.getElementById('villageAudio')
    music.muted = true
    var music = document.getElementById('battleAudio')
    music.muted = true
    var music = document.getElementById('battleMapAudio')
    music.muted = true
}

function unmuteMusic() {
    document.getElementById('musicBtn').innerText = '🔊'
    var music = document.getElementById('villageAudio')
    music.muted = false
    var music = document.getElementById('battleAudio')
    music.muted = false
    var music = document.getElementById('battleMapAudio')
    music.muted = false
}

document.getElementById('musicBtn').onclick = () => {
    if (document.getElementById('musicBtn').innerText === '🔊') {
        muteMusic()
    } else {
        unmuteMusic()
    }
}