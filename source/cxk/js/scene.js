class Paddle{constructor(_main){let p={x:_main.paddle_x,y:_main.paddle_y,w:80,h:112,speed:10,ballSpeedMax:8,image:imageFromPath(allImg.paddle),isLeftMove:true,isRightMove:true,}
Object.assign(this,p)}
moveLeft(){this.x-=this.speed}
moveRight(){this.x+=this.speed}
collide(ball){let b=ball
let p=this
if(Math.abs((b.x+b.w/2)-(p.x+p.w/2))<(b.w+p.w)/2&&Math.abs((b.y+b.h/2)-(p.y+p.h/2))<(b.h+p.h)/2){return true}
return false}
collideRange(ball){let b=ball
let p=this
let rangeX=0
rangeX=(p.x+p.w/2)-(b.x+b.w/2)
if(rangeX<0){return rangeX/(b.w/2+p.w/2)*p.ballSpeedMax}else if(rangeX>0){return rangeX/(b.w/2+p.w/2)*p.ballSpeedMax}}}
class Ball{constructor(_main){let b={x:_main.ball_x,y:_main.ball_y,w:32,h:32,speedX:1,speedY:window.cacheBallSpeed,image:imageFromPath(allImg.ball),fired:false,}
Object.assign(this,b)}
move(game){if(this.fired){if(this.x<0||this.x>canvas.clientWidth-this.w){this.speedX*=-1}
if(this.y<0){this.speedY*=-1}
if(this.y>canvas.clientHeight-this.h){game.state=game.state_GAMEOVER}
this.x-=this.speedX
this.y-=this.speedY}}}
class BallShadow{constructor(_main){let b={x:_main.ball_x,y:_main.paddle_y,w:32,h:32,speedX:1,speedY:window.cacheBallSpeed,image:imageFromPath(allImg.ballshadow),fired:false,}
Object.assign(this,b)}
move(game){this.x=_main.ball.x}}
class Block{constructor(x,y,life=1){let bk={x:x,y:y,w:50,h:20,image:life==1?imageFromPath(allImg.block1):imageFromPath(allImg.block2),life:life,alive:true,}
Object.assign(this,bk)}
kill(){this.life--
if(this.life==0){this.alive=false}else if(this.life==1){this.image=imageFromPath(allImg.block1)}}
collide(ball){let b=ball
if(Math.abs((b.x+b.w/2)-(this.x+this.w/2))<(b.w+this.w)/2&&Math.abs((b.y+b.h/2)-(this.y+this.h/2))<(b.h+this.h)/2){this.kill()
return true}else{return false}}
collideBlockHorn(ball){let b=ball
let bk=this
let rangeX=0
let rangeY=0
rangeX=Math.abs((b.x+b.w/2)-(bk.x+bk.w/2))
rangeY=Math.abs((b.y+b.h/2)-(bk.y+bk.h/2))
if(rangeX>bk.w/2&&rangeX<(bk.w/2+b.w/2)&&rangeY<(bk.h/2+b.h/2)){if(b.x<bk.x&&b.speedX>0||b.x>bk.x&&b.speedX<0){return false}else{return true}}
return false}}
class Score{constructor(_main){let s={x:_main.score_x,y:_main.score_y,text:'分数：',textLv:'关卡：',score:200,allScore:0,blockList:_main.blockList,blockListLen:_main.blockList.length,lv:_main.LV,}
Object.assign(this,s)}
computeScore(){let num=0
let allNum=this.blockListLen
num=this.blockListLen-this.blockList.length
this.allScore=this.score*num}}
class Scene{constructor(lv){let s={lv:lv,canvas:document.getElementById("canvas"),blockList:[],}
Object.assign(this,s)}
initBlockList(){this.creatBlockList()
let arr=[]
for(let item of this.blockList){for(let list of item){if(list.type===1){let obj=new Block(list.x,list.y)
arr.push(obj)}else if(list.type===2){let obj=new Block(list.x,list.y,2)
arr.push(obj)}}}
return arr}
creatBlockList(){let lv=this.lv,c_w=this.canvas.clientWidth,c_h=this.canvas.clientHeight,xNum_max=c_w/50,yNum_max=12,x_start=0,y_start=60
switch(lv){case 1:var xNum=16,yNum=9
for(let i=0;i<yNum;i++){let arr=[]
if(i===0){xNum=1}else if(i===1){xNum=2}else{xNum+=2}
x_start=(xNum_max-xNum)/2*50
for(let k=0;k<xNum;k++){if(i<3){arr.push({x:x_start+k*50,y:y_start+i*20,type:2,})}else{arr.push({x:x_start+k*50,y:y_start+i*20,type:1,})}}
this.blockList.push(arr)}
break
case 2:var xNum=16,yNum=9
for(let i=0;i<yNum;i++){let arr=[]
if(i===yNum-1){xNum=1}else if(i===0){xNum=xNum}else{xNum-=2}
x_start=(xNum_max-xNum)/2*50
for(let k=0;k<xNum;k++){if(i<3){arr.push({x:x_start+k*50,y:y_start+i*20,type:2,})}else{arr.push({x:x_start+k*50,y:y_start+i*20,type:1,})}}
this.blockList.push(arr)}
break
case 3:var xNum=16,yNum=9
for(let i=0;i<yNum;i++){let arr=[]
if(i===0){xNum=xNum}else if(i>4){xNum+=2}else{xNum-=2}
x_start=(xNum_max-xNum)/2*50
for(let k=0;k<xNum;k++){if(i<3){arr.push({x:x_start+k*50,y:y_start+i*20,type:2,})}else{arr.push({x:x_start+k*50,y:y_start+i*20,type:1,})}}
this.blockList.push(arr)}
break}}}