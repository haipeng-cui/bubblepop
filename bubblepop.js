/*
	Name:Haipeng Cui
	  ID:100321948
*/

const FPS = 60;
const BUB_PS = 12;
const RAD_MIN = 4;
const RAD_MAX = 40;
const VEL_MAX = 2;
const TEXT_COLOR = "deeppink"

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

const RADIANS = 2 * Math.PI;

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	translate(dx, dy) {
		this.x += dx;
		this.y += dy;
	}
	distance(other) {
		console.assert(other instanceof Point);
		return Math.hypot(this.x - other.x, this.y - other.y);
	}
}

const POINT_ZERO = new Point(0, 0);
const CANVAS_MAX = new Point(canvas.width, canvas.height);
const POINT_CENTRE = new Point(canvas.width / 2, canvas.height / 2);

const BUBBLE_IMG = new Image();
BUBBLE_IMG.src = "bubble.png";

class Bubble {
	/** Creates a Bubble at the given position with the given radius and velocity */
	constructor(x, y, radius, dx, dy) {
		console.assert(radius >= 0);
		// TODO create 3 attributes: pos, radius, vel
		// pos is the position of the centre of the Bubble. type: Point
		// radius : number
		// vel is the velocity of the Bubble (represented as a vector). type: Point
		// they must have these names and types for my provided code to work
		this.pos = new Point(x,y);
		this.radius = radius;
		this.vel = new Point(dx,dy);
	}
	/** TODO move the Bubble according to its velocity */
	update() {
		this.pos.x +=this.vel.x;
		this.pos.y +=this.vel.y;

	}
	/** TODO Determines if the entirety of the Bubble is within bounds.
		@return false if any part of the Bubble is out of bounds, true otherwise.
	*/
	isInBounds(topLeft, bottomRight) {
		console.assert(topLeft instanceof Point);
		console.assert(bottomRight instanceof Point);
		if(this.pos.x>=topLeft.x+this.radius     &&
		   this.pos.x<=bottomRight.x-this.radius &&
	   	   this.pos.y>=topLeft.y+this.radius     &&
	       this.pos.y<=bottomRight.y-this.radius){
			   return true;
		   }else {
			   return false;
		   }
	}
	/** TODO Determines if this Bubble has collided with any of the other given Bubbles.
		@param others an array of Bubbles. May contain this Bubble.
		@return true if this Bubble has colided with any of the other given Bubbles.
	*/
	hasCollision(others) {
		console.assert(Array.isArray(others));
		console.assert(others.every(o => o instanceof Bubble));
		for(let i=0;i<others.length;i++){
			if(this.isCollision(others[i]) && this != others[i]){
				return true;
			}
		}
		return false;
	}
	/** TODO Determines is this Bubble has colided with the given Bubble
		@return true if this Bubble has colided with the other Bubble
	*/
	isCollision(other) {
		console.assert(other instanceof Bubble)
		// a collision occurs when the distance between two bubbles centre's is less then the sum of their radii
		if(this.pos.distance(other.pos) < this.radius+other.radius){
			return true;
		} else{
			false;
		}
	}
	/** TODO Draws this Bubble on the given context using the image provided. */
	draw(ctx) {
		ctx.drawImage(BUBBLE_IMG,this.pos.x-this.radius,this.pos.y-this.radius,2*this.radius,2*this.radius);
	}
}

/** A list of Bubbles */
let bubbles = [];

/** TODO Creates a Bubble at the click location with random radius and velocity.
 */
canvas.addEventListener("click", (event) => {
	// Ranges for random numbers given as constants above.
	// Velocity ranges from -Max to Max
	// use event.offsetX and y
	let velX = rand(-1*VEL_MAX,VEL_MAX);
	let velY = rand(-1*VEL_MAX,VEL_MAX);
	let radius = rand(RAD_MIN,RAD_MAX);
	let bubbleX = event.offsetX;
	let bubbleY = event.offsetY;
	let bubble = new Bubble(bubbleX,bubbleY,radius,velX,velY);
	bubbles.push(bubble);
});

setInterval(() => {
	update();
	draw();
}, 1000 / FPS);

function update() {
	// TODO move all the bubbles
	// TODO Pop any bubbles that have touched the edge of the canvas
	// TODO Pop any bubbles that have touched another bubble
	ctx.clearRect(0,0,canvas.width,canvas.height);
	let toBeBroke =[];
	for(let i=0;i<bubbles.length;i++){
		if(!bubbles[i].isInBounds(POINT_ZERO,CANVAS_MAX) || bubbles[i].hasCollision(bubbles)){
			toBeBroke.push(bubbles[i]);
		}
	}
	for(let i=0;i<bubbles.length;i++){
		for(let k=0;k<toBeBroke.length;k++){
			if(toBeBroke[k] == bubbles[i]){
				bubbles.splice(i,1);
				i--;
				break;
			}
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = TEXT_COLOR;
	ctx.font = "bold 30px Serif";
	ctx.fillText("Bubbles:" + bubbles.length, 5, 30);

	// TODO Draw all the bubbles
	for(let i=0;i<bubbles.length;i++){
		bubbles[i].draw(ctx);
		bubbles[i].update();
	}
}

// ***** PROVIDED ***** DO NOT CHANGE ****************************************

function rand(min, max) {
	if(min === undefined) {
		min = 0;
		max = 1;
	} else if(max === undefined) {
		max = min;
		min = 0;
	}

	return Math.random() * (max - min) + min;
}

const quadrants = [
	new Point(1, 1), new Point(1, -1), new Point(-1, -1), new Point(-1, 1),
]

document.getElementById("btn4Out").addEventListener("click", () => {
	for(let quad of quadrants) {
		let bub = new Bubble(POINT_CENTRE.x, POINT_CENTRE.y,
			RAD_MAX / 2, VEL_MAX, VEL_MAX);
		bub.pos.x += quad.x * bub.radius;
		bub.pos.y += quad.y * bub.radius;
		bub.vel.x *= quad.x;
		bub.vel.y *= quad.y;
		bubbles.push(bub);
	}
});

document.getElementById("btn4In").addEventListener("click", () => {
	for(let quad of quadrants) {
		let bub = new Bubble(0, 0, RAD_MAX / 2, VEL_MAX, VEL_MAX);
		bub.pos.x = (quad.x === 1 ? CANVAS_MAX.x : POINT_ZERO.x) - quad.x * bub.radius;
		bub.pos.y = (quad.y === 1 ? CANVAS_MAX.y : POINT_ZERO.y) - quad.y * bub.radius;
		bub.vel.x *= -quad.x;
		bub.vel.y *= -quad.y;
		bubbles.push(bub);
	}
});

function makeRandom(howMany) {
	if(howMany === undefined) { howMany = 1; }
	let count = bubbles.length + howMany;
	while(bubbles.length < count) {
		let b = new Bubble(rand(CANVAS_MAX.x), rand(CANVAS_MAX.y),
			rand(RAD_MIN, RAD_MAX), rand(-VEL_MAX, VEL_MAX), rand(-VEL_MAX, VEL_MAX));
		if(!b.hasCollision(bubbles)) {
			bubbles.push(b);
		}
	}
}

document.getElementById("btn4Rand").addEventListener("click", () => {
	makeRandom(4);
});

document.getElementById("btn40Rand").addEventListener("click", () => {
	makeRandom(40);
});

document.getElementById("btnCheck").addEventListener("change", (() => {
	let randBub;
	return function (event) {
		clearInterval(randBub);
		if(event.target.checked) {
			randBub = setInterval(() => makeRandom(1), 1000 / BUB_PS)
		}
	}; // closure
})());

addEventListener("click", () => document.getElementsByTagName("video")[0].play());



// *** SMOKE TEST ****
console.assert(
	'{"pos":{"x":1,"y":2},"radius":10,"vel":{"x":100,"y":200}}' ===
	JSON.stringify(new Bubble(1, 2, 10, 100, 200)));
