new Vue({
  el: '#app',

  data: {
    gameStarted: false,
    playerPoints: 100,
    monsterPoints: 100,
    gameLog: [],
  },

  created,

  methods: {
    startGame,
    resetGame,
    saveLog,
    attack,
    specialAttack,
    heal,
    finishGame,
  },
});

// Created
function created() {
  const vm = this
  const keyMap = {
    78: 'startGame',
    65: 'attack',
    83: 'specialAttack',
    68: 'heal',
    70: 'resetGame',
  }

  window.addEventListener('keyup', event => {
    this[keyMap[event.keyCode]]()
  })
}

// Methods
function startGame() {
  this.gameStarted = true
  this.playerPoints = 100
  this.monsterPoints = 100
}

function resetGame() {
  this.gameStarted = false
  this.gameLog = []
}

// attack(boolean) :: void
function attack(special) {
  if (!this.gameStarted) return;

  const vm = this
  const playerStrike = randomStrike(special)
  const monsterStrike = randomStrike(special)

  this.monsterPoints -= playerStrike

  this.saveLog({
    player: 'Player',
    hit: playerStrike,
    css: 'msg-player',
    action: 'hits',
  })

  if (this.monsterPoints <= 0) {
    this.finishGame({ player: 'WINNER', monster: 'LOSER' })

    return;
  }

  setTimeout(() => {
    vm.playerPoints -= monsterStrike

    vm.saveLog({
      player: 'Monster',
      hit: monsterStrike,
      css: 'msg-monster',
      action: 'hits',
    })

    if (this.playerPoints <= 0) {
      this.finishGame({ player: 'LOSER', monster: 'WINNER' })

      return;
    }
  }, 300)
}

function randomStrike(special) {
  const strike = Math.round(Math.random() * 10)

  return special ? strike + 10 : strike
}

function saveLog({ player, hit, css, action }) {
  const id = this.gameLog.length

  this.gameLog.unshift({ player, hit, css, action, id })
}

function specialAttack() {
  this.attack(true)
}

function heal() {
  if (!this.gameStarted || this.playerPoints >= 100) return;

  const vm = this
  const playerHeal = randomStrike()
  const monsterHeal = randomStrike()

  this.playerPoints += playerHeal
  this.playerPoints > 100 ? this.playerPoints = 100 : ''

  vm.saveLog({
    player: 'Player',
    hit: playerHeal,
    css: 'msg-heal',
    action: 'heals',
  })

  setTimeout(() => {
    vm.monsterPoints += monsterHeal
    vm.monsterPoints > 100 ? this.monsterPoints = 100 : ''

    vm.saveLog({
      player: 'Monster',
      hit: monsterHeal,
      css: 'msg-heal',
      action: 'heals',
    })
  }, 300)
}

function finishGame({ player, monster }) {
  this.playerPoints = player
  this.monsterPoints = monster
  this.resetGame()
}
