/**
 * Created by Mr.袁 on 2017/9/12.
 */
//全局变量
var Divhome = document.getElementById("home");
var adio=document.getElementById("audio");
var gjadio=document.getElementById("gj");
var djbz=document.getElementById("djbz");
var fs=document.getElementById("fs");
var overfs=document.getElementById("overfs");
var gameover=document.getElementById("gameover");
var queren=document.getElementById("queren");
var over=document.getElementById("over");
var kaishi=document.getElementById("kaishi");
var time1=document.getElementById("time1");
var time2=document.getElementById("time2");
var time3=document.getElementById("time3");
var time4=document.getElementById("time4");
var time5=document.getElementById("time5");
var myxue=document.getElementById("myxue");
var zjjy=document.getElementById("zjspan");
var Nltiao=document.getElementById("NLtiao");
var dazhaos=document.getElementById("dazhao");
var btn = document.getElementById("btn");//开始游戏按钮
var start = document.getElementById("game");//获取开始游戏界面
var arrPlane = [];//敌方飞机数组
var arrzidan = [];
var arrdizidan = [];
var fjyddj=["images/mymove.gif","images/midmove.gif","images/lagmove.gif","images/lagsmove.gif"];//移动的飞机
var fjjzdj=["images/mystand.gif","images/midstand.gif","images/lagstand.gif","images/lagsstand.gif"];//静止的飞机
var fjgjdj=["images/mygj.gif","images/midmagicmissile.gif","images/lagmagicmissile.gif","images/lagsmagicmissile.gif"];//攻击的飞机
var fjzidan=["images/att.gif","images/midatt.gif","images/lagatt.gif","images/lagsatt.gif"];
var djbaozas=["images/hit.gif","images/midhit.gif","images/laghit.gif","images/lagshit.gif"];
var bossjs=["images/bossmove.gif","images/boss2.gif","images/boss3.gif","images/boss4.gif"];
var Myplane;
var Dji, Myzidan;
var Diplane1,Diplane2,baoxiang;
var Ditop;
var arrboss=[];
var baoxiangs=[];
var s=9,f=3,tjs=90;//时间计时
var shijian=["images/0.gif","images/1.gif","images/2.gif","images/3.gif","images/4.gif","images/5.gif","images/6.gif",
    "images/7.gif","images/8.gif","images/9.gif"];
//解决我方战机卡顿
var left = false;
var right = false;
var up = false;
var dw = false;
var wq = false;
var create1, create2, create3, moveDiplanes, moveMyplane, movezd,
    movedzd, randomDzidantimer, Zddipengtimer,xhdijitimer,Zdwjpengtimer,djwjpengtimer,
    bosszidan,zdbosspengtimer,xhbosstimer,bossmove,timetimer,wjbxpengtimer;
btn.onclick = function (){
    start.style.display = "none";
    kaishi.play();
    setTimeout(function () {
        adio.play();
    },700);
    create1 = setInterval(createDiPlane1, 3000);
    create2 = setInterval(createDiPlane2, 5000);
    // create3=setInterval(createDiPlane3,8000);
    moveDiplanes = setInterval(moveDiplane, 10);
    moveMyplane = setInterval(moveMyPlane, 40);
    timetimer=setInterval(time,1000);
    movezd = setInterval(moveZidan, 10);
    movedzd = setInterval(moveDzidan, 60);
    randomDzidantimer = setInterval(randomDzidan, 1000);
    Zddipengtimer = setInterval(ZdDjpeng, 100);
    djwjpengtimer=setInterval(Djwjpeng,100);
    wjbxpengtimer=setInterval(Wjbxpeng,100);
    xhdijitimer=setInterval(XHdiji,1000);
    Zdwjpengtimer=setInterval(Zdwjpeng,100);
    bosszidan=setInterval(bossDzidan,500);
    zdbosspengtimer=setInterval(Zdbosspeng,100);
    xhbosstimer=setInterval(XHbossji,1000);
    bossmove=setInterval(Bossmove,1500);
};
createMyPlane();
var img = document.getElementById("img");
//游戏结束确认
queren.onclick=function () {
   start.style.display="block";
   gameover.style.display="none";
   window.location.reload();
};
//获取我方飞机id

//初始化敌机
function createDiPlane1() {
    //0-(500-45)
    var x = 1290;
    var y = parseInt(Math.random() * 600);
    Diplane1 = new DiplanePrototype(x, y, "images/move.gif", 1);
    arrPlane.push(Diplane1);

}
function createDiPlane2() {
    //0-(500-45)
    var x = 1299;
    var y = parseInt(Math.random() * 600);
    Diplane1 = new DiplanePrototype(x, y, "images/movedi.gif", 1);
    arrPlane.push(Diplane1);

}
//初始化宝箱
function createBaoxaing() {
    for(var i=0;i<arrPlane.length;i++){
        var x=parseInt(arrPlane[i].imgNode.offsetLeft)-50;
        var y= parseInt(arrPlane[i].imgNode.offsetTop)-60;
            baoxiang=new baoxiangPrototype(x,y,"images/thing.gif");
            baoxiangs.push(baoxiang);
        break;
    }

}
//boss机
function createDiPlane3() {
    //0-(500-45)
    var x = 1100;
    var y = parseInt(Math.random() * 480);
    var src=bossj();
    Diplane2 = new DiBossplanePrototype(x, y, src, 6);
    arrboss.push(Diplane2);
}
function bossj() {
    if(Myplane.fs>=12&&Myplane.fs<24){
        return bossjs[0];
    }
    if(Myplane.fs>=24&&Myplane.fs<36){
        return bossjs[1];
    }
    if(Myplane.fs>=36&&Myplane.fs<48){
        return bossjs[2];
    }
    if(Myplane.fs>=48){
        return bossjs[3];
    }
}
/*function createDiPlane3() {
 //0-(500-45)
 var x=parseInt(Math.random()*440);
 var y=0;
 Diplane1=new  DiplanePrototype(x,y,"images/5.png",1);
 arrPlane.push(Diplane1);
 }*/
//时间
function time(){
    time5.src=shijian[s];
    time4.src=shijian[f-1];
    s--;
    tjs--;
    if(s==-1){
        f--;
        s=9;
    }
    if(f==0){

        setTimeout(function () {
            time2.src=shijian[0];
        },1000);
        time4.src=shijian[0];
        time5.src=shijian[0];
        f=6;
        s=9;
    }
    if(tjs==0){
        qcyx();
    }
};
//敌机移动
function moveDiplane() {
    for (var i = 0; i < arrPlane.length; i++) {
        Ditop = parseInt(arrPlane[i].imgNode.style.left);
        if (Ditop >= -301) {
            arrPlane[i].move();
        } else {
            Divhome.removeChild(arrPlane[i].imgNode);
            arrPlane.splice(i, 1);
            i--;
        }
    }
}
//boss机移动
function Bossmove() {
    arrboss[0].move();
}
//我方飞机
function createMyPlane() {
    //0-(500-45)
    var x = 0;
    var y = 319;
    var src = "images/mystand.gif";
    Myplane = new MyplanePrototype(x, y, src, 10);
}
//大招
function dazhao() {
    dazhaos.style.display="block";
    for (var i = 0; i < arrPlane.length; i++) {
            Divhome.removeChild(arrPlane[i].imgNode);
            arrPlane.splice(i,1);
            i--;
            Myplane.fs++;
        fs.innerHTML="<span>"+Myplane.fs+"分</span>";
    }
    for (var j = 0; j < arrboss.length; j++) {
            Divhome.removeChild(arrboss[j].imgNode);
            arrboss.splice(j,1);
            Myplane.fs++;
        fs.innerHTML="<span>"+Myplane.fs+"分</span>";
    }
    jinyant()
}
//我方飞机移动
document.onkeydown = function (event) {
    var key = event.keyCode;
    switch (key) {
        case 37:
            left = true;
            break;
        case 38:
            up = true;
            break;
        case 39:
            right = true;
            break;
        case 40:
            dw = true;
            break;
        case 83:
            Wjgjdj();
            setTimeout(function(){Myplane.shot()},300);
          /*  wq=true;*/
            break;
        case 13:
            dazhao();
            break;

    }
};
//解决飞机卡顿
function moveMyPlane() {
    if (left) {
        //判断是否飞机出界
        Myplane.moveLeft();
    }
    if (up) {
        Myplane.moveUp();
    }
    if (right) {
        Myplane.moveRight();
    }
    if (dw) {
        Myplane.moveDown();
    }
    /*if(wq){
        Myplane.shot();
    }*/

};
document.onkeyup = function (e) {
    var key = e.keyCode;
    switch (key) {
        case 37:
            left = false;
            break;
        case 38:
            up = false;
            break;
        case 39:
            right = false;
            break;
        case 40:
            dw = false;
            break;
        case 83:
           setTimeout(function () {
              Wjjzdj();
           },300);
          /* wq=false;*/
            break;
        case 13:
            setTimeout(function () {
                dazhaos.style.display="none";
            },5000);
    }
};
//我方飞机等级提升
function Wjjzdj() {
    if(Myplane.fs>=0&&Myplane.fs<10){
        img.src= fjjzdj[0];
    }
    if(Myplane.fs>=10&&Myplane.fs<20){
        img.src=fjjzdj[1];
    }
    if(Myplane.fs>=20&&Myplane.fs<30){
        img.src=fjjzdj[2];
    }
    if(Myplane.fs>=30){
        img.src=fjjzdj[3];
    }
}
function Wjyddj() {
    if(Myplane.fs>=0&&Myplane.fs<10){
       img.src=fjyddj[0];
    }
    if(Myplane.fs>=10&&Myplane.fs<20){
        img.src=fjyddj[1];
    }
    if(Myplane.fs>=20&&Myplane.fs<30){
        img.src=fjyddj[2];
    }
    if(Myplane.fs>=30){
        img.src=fjyddj[3]
    }
}
function Wjgjdj() {
    if(Myplane.fs>=0&&Myplane.fs<10){
        img.src=fjgjdj[0];
    }
    if(Myplane.fs>=10&&Myplane.fs<20){
        img.src=fjgjdj[1];
    }
    if(Myplane.fs>=20&&Myplane.fs<30){
        img.src=fjgjdj[2];
    }
    if(Myplane.fs>=30){
        img.src=fjgjdj[3];
    }
}
//我方子弹提升
function Wjzddj() {
    if(Myplane.fs>=0&&Myplane.fs<10){
        return fjzidan[0];
    }
    if(Myplane.fs>=10&&Myplane.fs<20){
        return fjzidan[1];
    }
    if(Myplane.fs>=20&&Myplane.fs<30){
       return fjzidan[2];
    }
    if(Myplane.fs>=30){
        return fjzidan[3];
    }
}
//敌机血量等级
function djxdj() {
    if(Myplane.fs>=0&&Myplane.fs<10){
        return 1;
    }
    if(Myplane.fs>=10&&Myplane.fs<20){
        return 2;
    }
    if(Myplane.fs>=20&&Myplane.fs<30){
        return 3;
    }
    if(Myplane.fs>=30){
        return 4;
    }
}
//敌机爆炸等级
function djbaoza() {
    if(Myplane.fs>=0&&Myplane.fs<10){
        return djbaozas[0];
    }
    if(Myplane.fs>=10&&Myplane.fs<20){
        return djbaozas[1];
    }
    if(Myplane.fs>=20&&Myplane.fs<30){
        return djbaozas[2];
    }
    if(Myplane.fs>=30){
        return djbaozas[3];
    }
}
//boss等级提升
function bossdjts() {
    if(Myplane.fs>=0&&Myplane.fs<11){
        return 10;
    }
    if(Myplane.fs>=11&&Myplane.fs<21){
        return 20;
    }
    if(Myplane.fs>=21&&Myplane.fs<31){
        return 30;
    }
    if(Myplane.fs>=31){
        return 40;
    }
}
//我方子弹移动
function moveZidan() {
    for (var i = 0; i < arrzidan.length; i++) {
        var left = parseInt(arrzidan[i].imgNode.style.left);
        if (left == 1299) {
            Divhome.removeChild(arrzidan[i].imgNode);
            arrzidan.splice(i, 1);
        } else {
            arrzidan[i].move();
        }
    }
}
//敌方子弹移动
function moveDzidan() {
    for (var i = 0; i < arrdizidan.length; i++) {
        var left = parseInt(arrdizidan[i].imgNode.style.left);
        if (left == 0) {
            Divhome.removeChild(arrdizidan[i].imgNode);
            arrdizidan.splice(i, 1);
            i--;
        } else {
            arrdizidan[i].move();
        }
    }
}
//敌方子弹产生
function randomDzidan() {
    for (var i = 0; i < arrPlane.length; i++) {
        var myrandom = parseInt(Math.random() * 10);
        if (myrandom == 0) {
            arrPlane[i].shot();
        }
    }
}
//boss子弹产生
function bossDzidan() {
    for (var i = 0; i < 2; i++) {
        var bossrandom = parseInt(Math.random() * 10);
        if (bossrandom == 0) {
            if(Myplane.fs>=12&&Myplane.fs<24){
            Diplane2.imgNode.src="images/bossattack.gif";
            }
            setTimeout(function () {
                arrboss[i].shot();
            },300);

        }else{
            setTimeout(function () {
                arrboss[i].imgNode.src=bossj();
            },400);

        }
        break;
    }
}
//子弹与敌机碰撞
function ZdDjpeng() {
    for (var i = 0; i < arrzidan.length; i++) {
        var zdleft = parseInt(arrzidan[i].imgNode.offsetLeft);
        var zdtop = parseInt(arrzidan[i].imgNode.offsetTop);
        var zdwidth = arrzidan[i].imgNode.offsetWidth;
        var zdheight = arrzidan[i].imgNode.offsetHeight;
        for (var j = 0; j < arrPlane.length; j++) {
            var fjleft = parseInt(arrPlane[j].imgNode.offsetLeft);
            var fjtop = parseInt(arrPlane[j].imgNode.offsetTop);
            var fjwidth = arrPlane[j].imgNode.offsetWidth;
            var fjheight = arrPlane[j].imgNode.offsetHeight;
            if ((zdleft > (fjleft - zdwidth) && zdleft < (fjleft + fjwidth)) && (zdtop > (fjtop - zdheight)
                && zdtop < (fjtop + fjheight))) {
                arrPlane[j].beed--;
                if (arrPlane[j].beed == 0) {
                    arrPlane[j].isbeell = true;
                    arrPlane[j].imgNode.src = djbaoza();
                    arrPlane[j].imgNode.style.width = "60px";
                    arrPlane[j].imgNode.style.height = "60px";
                    djbz.play();
                    Myplane.fs++;
                    boss();
                    //控制分数
                    fs.innerHTML="<span>"+Myplane.fs+"分</span>";
                   jinyant();
                    var randombx=parseInt(Math.random()*2);
                    if(randombx==0){
                        createBaoxaing();
                    }
                }
                //子弹消失
                Divhome.removeChild(arrzidan[i].imgNode);
                arrzidan.splice(i, 1);
                i--;


            }
        }
    }
}
//经验条增加
function jinyant() {
    zjjy.style.height=zjjy.offsetHeight+10+"px";
    if(zjjy.offsetHeight==100){
        Nltiao.src="images/expMax.gif";
        setTimeout(function () {
            zjjy.style.height=10+"px";
        },900);
    }
    if(zjjy.offsetHeight==10){
        Nltiao.src="images/exp0.png";
    }
}
//子弹与boss碰撞
function Zdbosspeng() {
    for (var i = 0; i < arrzidan.length; i++) {
        var zdleft = parseInt(arrzidan[i].imgNode.offsetLeft);
        var zdtop = parseInt(arrzidan[i].imgNode.offsetTop);
        var zdwidth = arrzidan[i].imgNode.offsetWidth;
        var zdheight = arrzidan[i].imgNode.offsetHeight;
        for (var j=0;j<arrboss.length;j++){
            var bossleft = parseInt(arrboss[j].imgNode.offsetLeft);
            var bosstop = parseInt(arrboss[j].imgNode.offsetTop);
            var bosswidth = arrboss[j].imgNode.offsetWidth;
            var bossheight = arrboss[j].imgNode.offsetHeight;
            if ((zdleft > (bossleft - zdwidth) && zdleft < (bossleft + bosswidth)) && (zdtop > (bosstop - zdheight)
                && zdtop < (bosstop + bossheight))) {
                arrboss[j].beed--;
                if (arrboss[j].beed == 0) {
                    arrboss[j].isbeell = true;
                    arrboss[j].imgNode.src ="images/die.gif";
                    djbz.play();
                    Myplane.fs++;
                    //控制分数
                    fs.innerHTML="<span>"+Myplane.fs+"分</span>"
                }
                //子弹消失
                Divhome.removeChild(arrzidan[i].imgNode);
                arrzidan.splice(i, 1);
                i--;

                break;
            }
        }
    }
    }
//boss出现时间
function boss() {
    for(var i=1;i<=4;i++){
      if(Myplane.fs==(12*i)){
        createDiPlane3();
      }
    }

}
//销毁敌机
function XHdiji() {
    for (var i = 0; i < arrPlane.length; i++) {
        if (arrPlane[i].isbeell){
              Divhome.removeChild(arrPlane[i].imgNode);
              arrPlane.splice(i,1);
              i--;
        }
    }
}
//销毁boss机
function XHbossji() {
    for (var i = 0; i < arrboss.length; i++) {
        if (arrboss[i].isbeell){
            Divhome.removeChild(arrboss[i].imgNode);
            arrboss.splice(i,1);
            i--;
        }
    }
}
//敌机子弹与我机碰撞
function Zdwjpeng() {
    for(var i=0;i<arrdizidan.length;i++){
        var dzdleft = parseInt(arrdizidan[i].imgNode.offsetLeft);
        var dzdtop = parseInt(arrdizidan[i].imgNode.offsetTop);
        var dzdwidth = arrdizidan[i].imgNode.offsetWidth;
        var dzdheight = arrdizidan[i].imgNode.offsetHeight;

        //我方飞机位置
        var wfleft=parseInt(img.offsetLeft);
        var wftop=parseInt(img.offsetTop);
        var wfwidth=img.offsetWidth;
        var wfheight=img.offsetHeight;
        if((dzdleft > (wfleft - dzdwidth) && dzdleft < (wfleft + wfwidth)) && (dzdtop > (wftop - dzdheight)
            && dzdtop < (wftop + wfheight))){
            //我方飞机血量
              Myplane.beed--;
              myxue.innerHTML="x"+Myplane.beed;
              if(Myplane.beed==0){
                  img.src="images/hit.gif";
                  djbz.play();
                  over.play();
                  adio.pause();
                  gjadio.pause();
                  qcyx();
              }
            //清除敌方子弹
            Divhome.removeChild(arrdizidan[i].imgNode);
            arrdizidan.splice(i,1);
            i--;
            break;
        }

    }
}
//敌机与我机碰撞
function Djwjpeng() {
    for(var i=0;i<arrPlane.length;i++){
        var djleft = parseInt(arrPlane[i].imgNode.offsetLeft);
        var djtop = parseInt(arrPlane[i].imgNode.offsetTop);
        var djwidth = arrPlane[i].imgNode.offsetWidth;
        var djheight = arrPlane[i].imgNode.offsetHeight;

        //我方飞机位置
        var wfleft=parseInt(img.offsetLeft);
        var wftop=parseInt(img.offsetTop);
        var wfwidth=img.offsetWidth;
        var wfheight=img.offsetHeight;
        if((djleft > (wfleft - djwidth) && djleft < (wfleft + wfwidth)) && (djtop > (wftop - djheight)
            && djtop < (wftop + wfheight))){
            //我方飞机血量
            Myplane.beed--;
            myxue.innerHTML="x"+Myplane.beed;
            if(Myplane.beed==0){
                img.src="images/hit.gif";
                djbz.play();
                over.play();
                adio.pause();
                gjadio.pause();
                qcyx();
            }
            Divhome.removeChild(arrPlane[i].imgNode);
            arrPlane.splice(i,1);
            i--;

            break;
        }
    }
}
//我机与宝箱碰撞
function Wjbxpeng() {
    for(var i=0;i<baoxiangs.length;i++){
        var djleft = parseInt(baoxiangs[i].imgNode.offsetLeft);
        var djtop = parseInt(baoxiangs[i].imgNode.offsetTop);
        var djwidth = baoxiangs[i].imgNode.offsetWidth;
        var djheight = baoxiangs[i].imgNode.offsetHeight;

        //我方飞机位置
        var wfleft=parseInt(img.offsetLeft);
        var wftop=parseInt(img.offsetTop);
        var wfwidth=img.offsetWidth;
        var wfheight=img.offsetHeight;
        if((djleft > (wfleft - djwidth) && djleft < (wfleft + wfwidth)) && (djtop > (wftop - djheight)
            && djtop < (wftop + wfheight))){
            //获取宝箱

            Divhome.removeChild(baoxiangs[i].imgNode);
            baoxiangs.splice(i,1);
            i--;
            Myplane.fs=Myplane.fs+2;
            fs.innerHTML="<span>"+Myplane.fs+"分</span>";
            break;
        }
    }
}
//游戏结束清除
function qcyx() {
     gameover.style.display="block";
     overfs.innerHTML=Myplane.fs+"分！！";
    moveMyplane=clearInterval(moveMyplane);
    create1 = clearInterval(create1);
    create2 = clearInterval(create2);
    // create3=setInterval(createDiPlane3,8000);
    moveDiplanes = clearInterval(moveDiplanes);
    movezd = clearInterval(movezd);
    movedzd = clearInterval(movedzd);
    randomDzidantimer = clearInterval(randomDzidantimer);
    Zddipengtimer = clearInterval(Zddipengtimer);
    xhdijitimer=clearInterval(xhdijitimer);
    Zdwjpengtimer=clearInterval(Zdwjpengtimer);
    bossmove=clearInterval(bossmove);
    timetimer=clearInterval(timetimer);
}
//boss飞机原型
function  DiBossplanePrototype(x,y,src,speed) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.speed = speed;
    this.imgNode = document.createElement("img");
    this.isbeell = false;
    this.beed = bossdjts();//boss机血量

    //方法
    this.shot = function () {
        var x = parseInt(this.imgNode.offsetLeft) + parseInt(this.imgNode.offsetWidth / 2) - 100;
        var y = parseInt(this.imgNode.offsetTop) + 8;
        var src = "images/attackBall.gif";
        var dzidan = new DizidanPrototype(x, y, src, 10);
        arrdizidan.push(dzidan);
    };
    this.move = function () {
        this.imgNode.style.top=(parseInt(Math.random()*401)+10)+"px";
    };
    this.init = function () {
        this.imgNode.src = this.src;
        this.imgNode.style.left = x + "px";
        this.imgNode.style.top = y + "px";
        Divhome.appendChild(this.imgNode);
    };
    this.init();
}
//敌方飞机原型
function DiplanePrototype(x, y, src, speed) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.speed = speed;
    this.imgNode = document.createElement("img");
    this.isbeell = false;
    this.beed = djxdj();//敌机血量
    //方法

    this.shot = function () {
        var x = parseInt(this.imgNode.offsetLeft) + parseInt(this.imgNode.offsetWidth / 2) - 38;
        var y = parseInt(this.imgNode.offsetTop) + 8;
        var src = "images/xiaozd.png";
        var dzidan = new DizidanPrototype(x, y, src, 10);
        arrdizidan.push(dzidan);
    };
    this.move = function () {
        var left = parseInt(this.imgNode.style.left) - this.speed;
        this.imgNode.style.left = left + "px";
    };
    this.init = function () {
        this.imgNode.src = this.src;
        this.imgNode.style.left = x + "px";
        this.imgNode.style.top = y + "px";
        Divhome.appendChild(this.imgNode);
    };
    this.init();
}
//敌机子弹原型
function DizidanPrototype(x, y, src, speed) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.speed = speed;
    this.imgNode = document.createElement("img");

    //方法
    this.move = function () {
        var left = parseInt(this.imgNode.style.left) - this.speed;
        if (left >= 0) {
            this.imgNode.style.left = left + "px";
        } else {
            this.imgNode.style.left = 0 + "px";
        }
    };
    this.init = function () {
        this.imgNode.src = this.src;
        this.imgNode.style.left = x + "px";
        this.imgNode.style.top = y + "px";
        Divhome.appendChild(this.imgNode);
    };
    this.init();

}
//我方飞机原型
function MyplanePrototype(x, y, src, speed) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.speed = speed;
    this.imgNode = document.createElement("img");
    this.imgNode.id = "img";
    this.fs=0;
    this.beed=5;
    //方法
    this.shot = function () {

        var left = parseInt(this.imgNode.style.left);
        var top = parseInt(this.imgNode.style.top);
        var x = left + this.imgNode.offsetWidth / 2 + 25;
        var y = top +25;
        var src=Wjzddj();
        var zidan = new MyzidanPrototype(x, y, src, 10);
        arrzidan.push(zidan);
        gjadio.play();

    };
    this.moveLeft = function () {
        this.imgNode.style.left = this.imgNode.offsetLeft - this.speed + "px";
        Wjyddj();
        if (parseInt(this.imgNode.style.left) <= 1) {
            this.imgNode.style.left = 8 + "px";
        }
    };
    this.moveUp = function () {
        this.imgNode.style.top = this.imgNode.offsetTop - this.speed + "px";
         Wjyddj();

        if (parseInt(this.imgNode.style.top) <= -2) {
            this.imgNode.style.top = -2 + "px";
        }
    };
    this.moveRight = function () {
        this.imgNode.style.left = this.imgNode.offsetLeft + this.speed + "px";
        Wjyddj();
        if (parseInt(this.imgNode.style.left) >= 1294) {
            this.imgNode.style.left = 1294 + "px"
        }
    };
    this.moveDown = function () {
        this.imgNode.style.top = this.imgNode.offsetTop + this.speed + "px";
        Wjyddj();
        if (parseInt(this.imgNode.style.top) >= 576) {
            this.imgNode.style.top = 575 + "px";
        }
    };
    this.init = function () {
        this.imgNode.src = this.src;
        this.imgNode.style.left = x + "px";
        this.imgNode.style.top = y + "px";
        Divhome.appendChild(this.imgNode);
    };
    this.init();
}
//我方子弹原型
function MyzidanPrototype(x, y, src, speed) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.speed = speed;
    this.imgNode = document.createElement("img");
    //方法
    this.move = function () {
        var left = parseInt(this.imgNode.style.left) + this.speed;
        if (left <= 1300) {
            this.imgNode.style.left = left + "px";
        } else {
            this.imgNode.style.left = 1299 + "px";
        }
    };
    this.init = function () {
        this.imgNode.src = this.src;
        this.imgNode.style.left = x + "px";
        this.imgNode.style.top = y + "px";
        Divhome.appendChild(this.imgNode);
    };
    this.init();

}
//宝箱原型
function baoxiangPrototype(x, y, src) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.imgNode = document.createElement("img");
    //方法

    this.init = function () {
        this.imgNode.src = this.src;
        this.imgNode.style.position="relative";
        this.imgNode.style.left = x + "px";
        this.imgNode.style.top = y + "px";
        Divhome.appendChild(this.imgNode);
    };
    this.init();
}