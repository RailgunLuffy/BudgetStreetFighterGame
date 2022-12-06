/* 
🌟 APP: Fighting Game

Create an updateGame() function that will update the DOM with the state of the game 👇
========================================

- updateGame()

These are the 2 classes you must create and their methods 👇
========================================

class Player {
  - strike()
  - heal()
}

class Game {
  - play()
  - checkIsOver()
  - declareWinner()
  - reset()
}

These functions are hard coded in the HTML. So, you can't change their names.

These are all the DIV ID's you're gonna need access to 👇
========================================================
#1 ID 👉 'play' = Button to run simulation
#2 ID 👉 'result' = Div that holds the winner of the match
#3 ID 👉 'p1Health' = Div that holds player 1's health
#4 ID 👉 'p2Health' = Div that holds player 2's health
*/

// ** Grabs elements from the DOM and stores them into variables **
let playButton = document.getElementById('play')
let resultDiv = document.getElementById('result')
let p1HealthDiv = document.getElementById('p1Health')
let p2HealthDiv = document.getElementById('p2Health')

// ** Check if either players health is  0 and if it is, then update isOver to true **
const updateGame = async (p1, p2) => {
  // Update the DOM with the latest health of players
  // p1HealthDiv.innerText = `${p1.health < 0 ? 0 : p1.health}`
  // p2HealthDiv.innerText = `${p2.health < 0 ? 0 : p2.health}`
  // console.log('hi1')
  // await postPlayerApiAsync({ 'player1Hp': p1.health, 'player2Hp': p2.health })
  let players = await getPlayerApiAsync()
  // console.log(players)
  // console.log('hi')
  p1HealthDiv.innerText = `${players[0].player1Hp < 0 ? 0 : players[0].player1Hp}`
  p2HealthDiv.innerText = `${players[0].player2Hp < 0 ? 0 : players[0].player2Hp}`
  game.checkIsOver(p1, p2)
  if (game.isOver) {
    resultDiv.innerText = `The Winner is ${game.declareWinner(p1, p2).name}!`
  }
  else
    resultDiv.innerText = ''
}

// ** Create the Player class which can create a player with all it's attributes and methods **
// qazi = Player('Qazi', 100, 7)
// qazi.name 👉 'Qazi'
// qazi.health 👉 100
// qazi.attackDmg 👉 7
class Player {
  constructor(name, health, attackDamage) {
    this.name = name
    this.health = health
    this.attackDamage = attackDamage
  }
  // ** Attack an enemy with a random number from 0 to YOUR attackDmg bonus **
  strike(enemy) {
    enemy.health = enemy.health <= 0 ? 0 : enemy.health - Math.floor(Math.random() * (this.attackDamage + 1))
  }
  // ** Heal the player for random number from  1 to 5 **
  heal() {
    let healPoint = Math.ceil(Math.random() * 5)
    this.health = this.health + healPoint > 100 ? 100 : this.health + healPoint
  }
}

// let a = new Player('a', 30, 5)
// let b = new Player('b', 100, 2)
// a.strike(b)
// a.heal()
// console.log(b.health, a.health)

// ** Create the Game class with all it's attributes and methods to run a match **
class Game {
  constructor() {
    this.isOver = false;
  }

  checkIsOver(p1, p2) {
    this.isOver = p1.health <= 0 || p2.health <= 0 ? true : false
    // return this.isOver
  }

  // ** If the game is over and a player has 0 health declare the winner! **
  declareWinner(p1, p2) {
    if (this.isOver)
      return p1.health <= 0 ? p2 : p1
  }

  // ** Reset the players health back to it's original state and isOver to FALSE **
  reset(p1, p2) {
    p1.health = p2.health = 100
    this.isOver = false
  }

  // ** Simulates the whole match untill one player runs out of health **
  play(p1, p2) {
    let player
    let n = 0
    while (!this.isOver) {
      player = Math.floor(Math.random() * 2) ? p2 : p1
      Math.floor(Math.random() * 2) ? player.strike(player) : player.heal()
      console.log(p1, p2)
      this.checkIsOver(p1, p2)
      console.log(this.isOver)
      n++
    }
    console.log({ 'Number Of Times Run': n })
  }

}

// ** Create 2 players using the player class **
let player1 = new Player('Luffy', 100, 5)
let player2 = new Player('Yasha', 100, 5)

// ** Save original Player Data **
let p1 = player1
let p2 = player2

// ** Create the game object from the Game class **
let game = new Game()

// ** Save original Game Data **
let gameState = game

document.getElementById('title').innerHTML = `<h1>${p1.name} vs ${p2.name}</h1>`

// const p1ChoiceDiv = document.getElementById('1')
// const p2ChoiceDiv = document.getElementById('2')
// document.getElementById('1').innerHTML = `<h2>${p1.name}</h2>` + p1ChoiceDiv.innerHTML
// document.getElementById('2').innerHTML = `<h2>${p2.name}</h2>` + p2ChoiceDiv.innerHTML

// ** Add a click listener to the simulate button that runs the play() method on click and pass in the players **



// ** BONUS **
// Add functionality where players can press a button to attack OR heal

// ** Player 1 Controls **


// ** Player 2 Controls **



const bindAttackBtns = { player1: [p1, document.getElementById('p1-attack'), p2], player2: [p2, document.getElementById('p2-attack'), p1] }
const bindHealBtns = { player1: [p1, document.getElementById('p1-heal')], player2: [p2, document.getElementById('p2-heal')] }

Object.values(bindAttackBtns).forEach(player => {
  player[1].onclick = async () => {
    game.checkIsOver(p1, p2)
    if (!game.isOver) {
      player[0].strike(player[2])
      await postPlayerApiAsync()
      await updateGame(p1, p2)
    }
  }
})

Object.values(bindHealBtns).forEach(player => {
  player[1].onclick = async () => {
    game.checkIsOver(p1, p2)
    if (!game.isOver) {
      player[0].heal()
      await postPlayerApiAsync()
      await updateGame(p1, p2)
    }
  }
})

document.addEventListener('keydown', (e) => {
  game.checkIsOver(p1, p2)
  if (!game.isOver) {
    if (e.key == 'q') {
      p1.strike(p2)
      document.getElementById('p1attack').play()
      postPlayerApiAsync({ 'player1Hp': p1.health, 'player2Hp': p2.health })
      updateGame(p1, p2)
    }
    if (e.key == 'a') {
      p1.heal()
      document.getElementById('p1heal').play()
      postPlayerApiAsync({ 'player1Hp': p1.health, 'player2Hp': p2.health })
      updateGame(p1, p2)
    }
    if (e.key == 'p') {
      p2.strike(p1)
      document.getElementById('p2attack').play()
      postPlayerApiAsync({ 'player1Hp': p1.health, 'player2Hp': p2.health })
      updateGame(p1, p2)
    }
    if (e.key == 'l') {
      p2.heal()
      document.getElementById('p2heal').play()
      postPlayerApiAsync({ 'player1Hp': p1.health, 'player2Hp': p2.health })
      updateGame(p1, p2)
    }
  }
})

document.getElementById('reset').addEventListener('click', (e) => {
  game.reset(p1, p2)
  postPlayerApiAsync({ 'player1Hp': p1.health, 'player2Hp': p2.health })
  updateGame(p1, p2)
})

playButton.addEventListener('click', (e) => {
  game.checkIsOver(p1, p2)
  if (!game.isOver) {
    game.play(p1, p2)
    updateGame(p1, p2)
  }
})

// const getPlayerApi = () => {
//   url = 'http://127.0.0.1:8000/mysite/'
//   // fetch(url, {
//   //   method: 'post',
//   //   headers: new Headers({
//   //     'Authorization': 'Basic ' + btoa('luffy:Tom123@#$'),
//   //     'Content-Type': 'application/x-www-form-urlencoded'
//   //   }),
//   // })
//   fetch(url, {
//     method: 'post', headers: new Headers({
//       'Authorization': 'Basic ' + btoa('luffy:Tom123@#$')
//     })
//   })
//     .then(request => request.json())
//     .then(json => {
//       console.log(json)
//     })
// }

// getPlayerApi()

// url = 'http://127.0.0.1:8000/mysite/'

// const getPlayerApi = () => fetch(url)
//   .then(request => request.json())
//   .then(json => {
//     console.log(json)
//     // resultDiv.innerText = JSON.stringify(json)
//     return json
//   })

// const postPlayerApi = () => fetch(url, {
//   method: 'post',

//   body: {
//   'player1Hp': 50,
//   'player2Hp': 40
// }
// })
//   .then(request => request.json())
//   .then(json => console.log(json))

// const data = { 'player1Hp': 0, 'player2Hp': 50 };

// const postPlayerApi = () => fetch(url, {
//   method: 'POST', // or 'PUT'
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(data),
// })
//   .then((response) => {
//     if (res.ok) {
//       return res;
//     } else {
//       throw res;
//     }
//   })
//   .catch((error) => {
//     console.error('Error: ', err.status);
//   });

// getPlayerApi()

const getPlayerApiAsync = async () => {
  const response = await fetch('https://web-production-d8d3.up.railway.app/mysite/last-player/')
  const data = await response.json()

  return data
}

const postPlayerApiAsync = async () => {
  const response = await fetch('https://web-production-d8d3.up.railway.app/mysite/', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "player1Hp": p1.health,
      "player2Hp": p2.health
    }),
  })
  const postData = await response.json()

  return postData
}

// window.onload = () => {
//   setInterval(() => updateGame(p1, p2), 1000)
// }
// let _data = { 'player1Hp': 120, 'player2Hp': 110 }
// postPlayerApiAsync(data)
// let controller = new AbortController();
// const signal = controller.signal;
// setTimeout(() => controller.abort(), 1000);

// fetch('http://127.0.0.1:8000/mysite/', {
// method: "POST",
// body: JSON.stringify(_data),
// headers: { "Content-type": "application/json; charset=UTF-8" },
//   signal
// })
//   .then(response => response.json())
//   .then(json => console.log(json))
//   .catch(err => console.log(err))



// try {
//   let response = await fetch('http://127.0.0.1:8000/mysite', {
//     method: "POST",
//     body: JSON.stringify(_data),
//     headers: { "Content-type": "application/json; charset=UTF-8" },
//     signal: controller.signal
//   });
// } catch (err) {
//   if (err.name == 'AbortError') { // handle abort()
//     alert("Aborted!");
//   } else {
//     throw err;
//   }
// }

// fetch('http://127.0.0.1:8000/mysite/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     'player1Hp': 30,
//     'player2Hp': 20
//   })
// })
//   .then(res => {
//     return res.json()
//   })
//   .then(data => console.log(data))
//   .catch(error => console.log('ERROR'))


window.onload = () => {
  setInterval(() => {
    updateGame(p1, p2)
    getPlayerApiAsync().then(data => {
      p1.health = data[0].player1Hp
      p2.health = data[0].player2Hp
    })
  }, 10)
}