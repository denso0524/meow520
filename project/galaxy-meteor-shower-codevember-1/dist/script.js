var stage = new createjs.Stage("c");
stage.x = 60
var object = new createjs.Shape();
object.graphics.beginLinearGradientFill(["#e51769", "#341344", "#3e39e8"],[0,0.5,1], 0,0, 500, 180, 800, -45).drawRect(-50,0,550,500);
stage.addChild(object);

var mask = new createjs.Shape();

let s = [];
function generateStars() {
	for (var x = 0; x < 30; x++) {
		let w = Math.floor((Math.random() * 3) + 1);
		let posX = Math.floor((Math.random() *500) + 50);
		let posY = Math.floor((Math.random() *500) + 50);
		let time = Math.floor((Math.random() *2) + 0.2);
		s[x] = new createjs.Shape();
		s[x].graphics.beginFill("#fff").drawRect(posX,posY,w,w);
		createjs.Tween.get(s[x], {loop:true})
		.to({
			alpha:1
		},1000)
		.to({
			alpha:0
		},(time*1000))
		.to({
			alpha:1
		},(1000))
		stage.addChild(s[x]);
	}	
}
function generateGal() {
	for (var x = 0; x < 45; x++) {
		let posX = x* Math.floor((Math.random() * 30) + 10);
		let posY = x*  Math.floor((Math.random() * 10) + 1);	
		let w = Math.floor((Math.random() * 6) + 4);
		let h =  Math.floor((Math.random() * 150) + 8);
		let speed = (Math.random() * (1.5) + 0.2).toFixed(4)
		let direction = Math.floor((Math.random() * 500) + 200)
		
		let obj = mask.graphics;
		let pt1 =	obj.moveTo(posX+0, posY+10).command
		let pt2 = obj.lineTo(posX+0, posY+h).command
		let pt3 =	obj.bezierCurveTo(posX+0, posY+h+w, posX+w,posY+h+w, posX+w,posY+h).command
		let pt4 =	obj.lineTo(posX+w,posY+w).command
		let pt5 =	obj.bezierCurveTo(posX+w,posY+0, posX+0,posY+0 ,posX+0,posY+w).command;
		
		createjs.Tween.get(pt4, {loop:true})
		.to({
			y: pt4.y +direction
		},(speed*1000))
		.call(function () {
			pt4.y -= (direction+100)
		})
		
		createjs.Tween.get(pt5, {loop:true})
		.to({
			y : pt5.y +direction,
			cp1y: pt5.cp1y +direction,
			cp2y: pt5.cp2y +direction
		},(speed*1000))
		.call(function () {
			pt5.y = pt5.cp1y = pt5.cp2y -= (direction+100)
		})
		
		createjs.Tween.get(pt2, {loop:true})
		.to({
			y : pt2.y +direction
		},(speed*1000))
		.call(function () {
			pt2.y -= (direction+100)
		})
		
		createjs.Tween.get(pt3, {loop:true})
		.to({
			y : pt3.y +direction,
			cp1y: pt3.cp1y +direction,
			cp2y: pt3.cp2y +direction,
		},(speed*1000))
		.call(function () {
			pt3.y = pt3.cp1y = pt3.cp2y -= (direction+100)
		})
	}
}

object.mask = mask

createjs.Tween.get(object, {loop:true})
	.to({
	alpha : 0.5
},(2000))
	.to({
	alpha : 1
},(2000))


// ticker
function tick () {
	createjs.Ticker.framerate = 60;
	createjs.Ticker.on("tick", function() {
		stage.update();	
	});	
}

function resize () {
	let w = window.innerWidth;
	let h = window.innerHeight;
	let ratio = h/w;
	
	$(".wrapper").css({'transform':'scale('+(ratio +0.3)+') rotate(40deg)'})
}

tick();
resize();
generateStars();
generateGal();
window.addEventListener("resize", resize);