import React, { Component } from 'react'

import Board from './components/Board'
import Options from './components/Options'
import green from './sounds/green.wav'
import red from './sounds/red.wav'
import yellow from './sounds/yellow.wav'
import blue from './sounds/blue.wav'
import click from './sounds/click.wav'
import mistake from './sounds/mistake.wav'
import restart from './sounds/restart.wav'
import win from './sounds/win.wav'

class App extends Component {
  constructor() {
    super()
    this.state = {
      memorySequence: [],
      userSequence: [],
      level: null,
      gameStarted: false,
      strictMode: false
    }
  }

  // Keyboard Events
  componentDidMount() {
    document.addEventListener("keypress", this.keyPress)
  }

  componentWillUnmount() {
    document.addEventListener('keypress', this.keyPress);
  }

  keyPress = (e) => {
    e.preventDefault()
    switch(e.which) {
      case 49: this.lightUp(1); this.userMoveCheck(1); break
      case 50: this.lightUp(2); this.userMoveCheck(2); break
      case 51: this.lightUp(3); this.userMoveCheck(3); break
      case 52: this.lightUp(4); this.userMoveCheck(4); break
      case 32: this.playSound("click"); this.startGame(); break
      case 13: this.playSound("click"); this.restartGame(); break
      case 48: this.playSound("click"); this.setStrictMode(); break
      default: break
    }
  }

  // Game Effects
  playSound = (item) => {
    switch (item) {
      case 1: new Audio(green).play(); break
      case 2: new Audio(red).play(); break
      case 3: new Audio(yellow).play(); break
      case 4: new Audio(blue).play(); break
      case "click": new Audio(click).play(); break
      case "mistake": new Audio(mistake).play(); break
      case "restart": new Audio(restart).play(); break
      case "win": new Audio(win).play(); break
      default: break
    }
  }

  lightUp = (item) => {
    const tile = document.querySelector(`.button${item}`)
    tile.classList.add("lit")
    this.playSound(item)
    setTimeout(function() { 
      tile.classList.remove("lit")
    }, 300)
  }

  animate = (memorySequence) => {
    var i = 0
    var interval = setInterval(() => {
        this.lightUp(memorySequence[i])
        i++
        if (i >= memorySequence.length) {
            clearInterval(interval)
        }
   }, 600)
  }

  // Game Mechanics
  userMoveCheck = (index) => {
    const {level, strictMode} = this.state
    if (level <= 20) {
      const memorySequence = [...this.state.memorySequence]
      const userSequence = [...this.state.userSequence]
      userSequence.push(index)
      this.setState({ userSequence })
      const result = this.checkSequences(memorySequence, userSequence)

      if (result !== null) {
        if (level === 20 && result === true) {
          this.playSound("win")
        }
        else if (result === true && level <= 19) {
          this.makeSequence()
        } 
        else if (!strictMode && result === false) {
          this.playSound("mistake")
          setTimeout(() => {
            this.animate(memorySequence)
          }, 1500)
        }
        else if (strictMode && result === false) {
          this.restartGame()
        }
      }
    }
  }

  checkSequences = (memorySequence, userSequence) => {
    let tracker = null
    if (userSequence.length !== 0 && memorySequence.length !== 0) {
      for (let index in userSequence) {
        if (userSequence[index] !== memorySequence[index]) {
          userSequence = []
          this.setState({ userSequence })
          tracker = false
        }
        else if (userSequence.length === memorySequence.length && userSequence[index] === memorySequence[index]) {
          tracker = true
        } 
      }
    } 
    return tracker
  }

  makeSequence = () => {
    let {level} = this.state
    if (level <= 19) {
      let userSequence = [...this.state.userSequence]
      let memorySequence = [...this.state.memorySequence]
      const randomNumber = Math.floor(Math.random()*4) + 1
      userSequence = []
      memorySequence.push(randomNumber)
      level = memorySequence.length
      this.animate(memorySequence)
      this.setState({ memorySequence, userSequence, level})
    }
  }
  
  startGame = () => {
    if (!this.state.gameStarted) {
      this.setState({ gameStarted: true })
      this.makeSequence()
    }
  }
  
  setStrictMode = () => {
    this.setState({ strictMode: !this.state.strictMode })
  }
  
  restartGame = () => {
    let userSequence = [...this.state.userSequence]
    let memorySequence = [...this.state.memorySequence]
    let {level} = this.state
    memorySequence = []
    userSequence = []
    level = null
    this.setState({ memorySequence, userSequence, level })
    this.playSound("restart")
    setTimeout(() => {
      this.makeSequence()
    }, 4000)
  }

  render() {
    return (
      <div className="App">
        <h1>Sensational Simon Game</h1>
        <h2><span className="amatic">Level:</span> {this.state.level}</h2>
        
        <Board 
          lightUp={this.lightUp}
          userMoveCheck={this.userMoveCheck}
        />

        <Options 
          {...this.state}
          startGame={this.startGame}
          setStrictMode={this.setStrictMode}
          restartGame={this.restartGame}
        />

        <div className="Footer">
          <a href="http://timothyhoang.net/">Copyright © 2018 Timothy Hoang</a> 
        </div>
      </div>
    )
  }
}

export default App
