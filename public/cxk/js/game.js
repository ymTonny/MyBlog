class Game {
  constructor(main) {
    let g = {
      main: main,
      actions: {},
      keydowns: {},
      state: 1,
      state_START: 1,
      state_RUNNING: 2,
      state_STOP: 3,
      state_GAMEOVER: 4,
      state_UPDATE: 5,
      canvas: document.getElementById("canvas"),
      context: document.getElementById("canvas").getContext("2d"),
      timer: null,
      fps: main.fps,
    }
    Object.assign(this, g)
  }
  draw(paddle, ball, ballshadow, blockList, score) {
    let g = this
    g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)
    g.drawImage(paddle)
    g.drawImage(ball)
    g.drawImage(ballshadow)
    g.drawBlocks(blockList)
    g.drawText(score)
    window.canvas_g = this
  }
  drawImage(obj) {
    this.context.drawImage(obj.image, obj.x, obj.y)
  }
  drawBg() {
    let bg = imageFromPath(allImg.background)
    this.context.drawImage(bg, 0, 0, cdiv.clientWidth, cdiv.clientHeight)
  }
  drawBlocks(list) {
    for (let item of list) {
      this.drawImage(item)
    }
  }
  drawText(obj) {
    this.context.font = '24px Microsoft YaHei'
    this.context.fillStyle = '#000'
    this.context.fillText(obj.text + obj.allScore, obj.x, obj.y)
    this.context.fillText(obj.textLv + obj.lv, this.canvas.width - 100, obj.y)
  }
  gameOver() {
    clearInterval(this.timer)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.font = '32px Microsoft YaHei'
    this.context.fillStyle = '#000'
    this.context.fillText('CXK，你球掉了！', 404, 226)
    $("#ballspeedset").removeAttr("disabled");
  }
  goodGame() {
    clearInterval(this.timer)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.font = '32px Microsoft YaHei'
    this.context.fillStyle = '#000'
    this.context.fillText('CXK，下一关！', 308, 226)
  }
  finalGame() {
    clearInterval(this.timer)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.font = '32px Microsoft YaHei'
    this.context.fillStyle = '#000'
    this.context.fillText('你打球像CXK！', 308, 226)
    $("#ballspeedset").removeAttr("disabled");
  }
  registerAction(key, callback) {
    this.actions[key] = callback
  }
  checkBallBlock(g, paddle, ball, blockList, score) {
    let p = paddle,
      b = ball
    if (p.collide(b)) {
      if (Math.abs(b.y + b.h / 2 - p.y + p.h / 2) > Math.abs(b.y + b.h / 2 + b.speedY - p.y + p.h / 2)) {
        b.speedY *= -1
      } else {
        b.speedY *= 1
      }
      b.speedX = p.collideRange(b)
    }
    blockList.forEach(function (item, i, arr) {
      if (item.collide(b)) {
        if (!item.alive) {
          arr.splice(i, 1)
        }
        if ((b.y < item.y && b.speedY < 0) || (b.y > item.y && b.speedY > 0)) {
          if (!item.collideBlockHorn(b)) {
            b.speedY *= -1
          } else {
            b.speedY *= 1
          }
        } else {
          b.speedY *= 1
        }
        if (item.collideBlockHorn(b)) {
          b.speedX *= -1
        }
        score.computeScore()
      }
    })
    if (p.x <= 0) {
      p.isLeftMove = false
    } else {
      p.isLeftMove = true
    }
    if (p.x >= canvas.clientWidth - p.w) {
      p.isRightMove = false
    } else {
      p.isRightMove = true
    }
    b.move(g)
  }
  setTimer(paddle, ball, ballshadow, blockList, score) {
    let g = this
    let main = g.main
    g.timer = setInterval(function () {
      let actions = Object.keys(g.actions)
      for (let i = 0; i < actions.length; i++) {
        let key = actions[i]
        if (g.keydowns[key]) {
          g.actions[key]()
        }
      }
      if (blockList.length == 0) {
        if (main.LV === main.MAXLV) {
          g.state = g.state_UPDATE
          g.finalGame()
        } else {
          g.state = g.state_UPDATE
          g.goodGame()
        }
      }
      if (g.state === g.state_GAMEOVER) {
        g.gameOver()
      }
      if (g.state === g.state_RUNNING) {
        g.checkBallBlock(g, paddle, ball, blockList, score)
        g.draw(paddle, ball, ballshadow, blockList, score)
      } else if (g.state === g.state_START) {
        g.draw(paddle, ball, ballshadow, blockList, score)
      }
    }, 1000 / g.fps)
  }
  init() {
    let g = this,
      paddle = g.main.paddle,
      ball = g.main.ball,
      ballshadow = g.main.ballshadow,
      blockList = g.main.blockList,
      score = g.main.score
    window.addEventListener('keydown', function (event) {
      if (event.keyCode == 65) {
        g.keydowns[37] = true;
      } else if (event.keyCode == 68) {
        g.keydowns[39] = true;
      } else {
        g.keydowns[event.keyCode] = true
      }
    })
    window.addEventListener('keyup', function (event) {
      if (event.keyCode == 65) {
        g.keydowns[37] = false;
      } else if (event.keyCode == 68) {
        g.keydowns[39] = false;
      } else {
        g.keydowns[event.keyCode] = false
      }
    })
    window.addEventListener('mousedown', function (event) {
      var clientWidth = document.body.clientWidth;
      if (event.clientX < clientWidth / 2) {
        g.keydowns[37] = true;
      } else {
        g.keydowns[39] = true;
      }
    })
    window.addEventListener('mouseup', function (event) {
      var clientWidth = document.body.clientWidth;
      if (event.clientX < clientWidth / 2) {
        g.keydowns[37] = false;
      } else {
        g.keydowns[39] = false;
      }
    })
    window.addEventListener('touchstart', function (event) {
      var clientWidth = document.body.clientWidth;
      if (event.touches[0].pageX < clientWidth / 2) {
        g.keydowns[37] = true;
      } else {
        g.keydowns[39] = true;
      }
      event.preventDefault();
    })
    window.addEventListener('touchend', function (event) {
      var clientWidth = document.body.clientWidth;
      if (event.changedTouches[0].pageX < clientWidth / 2) {
        g.keydowns[37] = false;
      } else {
        g.keydowns[39] = false;
      }
    })
    g.registerAction = function (key, callback) {
      g.actions[key] = callback
    }
    g.registerAction('37', function () {
      if (g.state === g.state_RUNNING && paddle.isLeftMove) {
        move_way = 2;
        paddle.moveLeft()
      }
    })
    g.registerAction('39', function () {
      if (g.state === g.state_RUNNING && paddle.isRightMove) {
        move_way = 1;
        paddle.moveRight()
      }
    })
    window.startGame = function () {
      window.cacheBallSpeed = parseInt($("#ballspeedset").val());
      if (g.state !== g.state_UPDATE) {
        $("#ballspeedset").attr("disabled", "disabled");
        if (g.state === g.state_GAMEOVER) {
          g.state = g.state_START
          g.main.start()
        } else {
          ball.fired = true
          g.state = g.state_RUNNING
        }
      }
    }
    window.nextGame = function () {
      if (g.state === g.state_UPDATE && g.main.LV !== g.main.MAXLV) {
        g.state = g.state_START
        g.main.start(++g.main.LV)
        $("#ballspeedset").attr("disabled", "disabled");
      }
    }
    window.pauseGame = function () {
      if (g.state !== g.state_UPDATE && g.state !== g.state_GAMEOVER) {
        g.state = g.state_STOP
      }
    }
    window.addEventListener('keydown', function (event) {
      switch (event.keyCode) {
        case 13:
          window.cacheBallSpeed = parseInt($("#ballspeedset").val());
          if (g.state !== g.state_UPDATE) {
            $("#ballspeedset").attr("disabled", "disabled");
            if (g.state === g.state_GAMEOVER) {
              g.state = g.state_START
              g.main.start()
            } else {
              ball.fired = true
              g.state = g.state_RUNNING
            }
          }
          break
        case 78:
          if (g.state === g.state_UPDATE && g.main.LV !== g.main.MAXLV) {
            g.state = g.state_START
            g.main.start(++g.main.LV)
            $("#ballspeedset").attr("disabled", "disabled");
          }
          break
        case 80:
          if (g.state !== g.state_UPDATE && g.state !== g.state_GAMEOVER) {
            g.state = g.state_STOP
          }
          break
      }
    })
    g.setTimer(paddle, ball, ballshadow, blockList, score)
  }
}