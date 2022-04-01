let _main={LV:1,MAXLV:3,scene:null,blockList:null,ball:null,ballshadow:null,paddle:null,score:null,ball_x:491,ball_y:418,paddle_x:449,paddle_y:450,score_x:10,score_y:30,fps:60,game:null,start:function(){let self=this
self.scene=new Scene(self.LV)
self.blockList=self.scene.initBlockList()
self.ball=new Ball(self)
self.ballshadow=new BallShadow(self)
self.paddle=new Paddle(self)
self.score=new Score(self)
self.game=new Game(self)
self.game.init(self)}}