const CELL_SIZE = window.screen.availHeight > 900 ? 32 : 25;
const BOARD_SIZE = 20;
const SIZE = CELL_SIZE * BOARD_SIZE;
const VECTORS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };

const INFO_ELEMENT = document.getElementById("info");
const SCORE_ELEMENT = document.getElementById("score");
const HIGH_SCORE_ELEMENT = document.getElementById("high-score");
const START_SCREEN_ELEMENT = document.getElementById("start-screen");
const PAUSE_SCREEN_ELEMENT = document.getElementById("pause-screen");
const DEATH_SCREEN_ELEMENT = document.getElementById("death-screen");

let highScore = 0;
let fps = 7;

let isEasy;
let isPause;
let isDead;
let isNewHighScore;
let hasFood;

let score;
let direction;
let food;
let snake;
let speed;

function setDifficulty(value) {
	isEasy = value;

	let btns = START_SCREEN_ELEMENT.getElementsByTagName("button");
	let descr = START_SCREEN_ELEMENT.getElementsByClassName("description")[0];

	if (isEasy) {
		btns[0].classList.add("selected");
		btns[1].classList.remove("selected");
		descr.innerHTML = `
			<li> you can walk through walls</li>
			<li> speed doesn't increase</li>`;
	} else {
		btns[0].classList.remove("selected");
		btns[1].classList.add("selected");
		descr.innerHTML = `
			<li>you can't walk through walls</li>
			<li>speed increase</li>`;
	}
}

function drawGrid() {
	stroke(200);
	for (let i = 0; i < BOARD_SIZE; i++) {
		line(0, CELL_SIZE * i, SIZE, CELL_SIZE * i);
		line(CELL_SIZE * i, 0, CELL_SIZE * i, SIZE);
	}
}

function drawSnake() {
	fill("#222");
	for (let i = 0; i < snake.length; i++) {
		body = snake[i];
		const x = body[0] * CELL_SIZE;
		const y = body[1] * CELL_SIZE;
		rect(x, y, CELL_SIZE, CELL_SIZE);
	}
}

function drawFood() {
	fill("#ff5252");
	rect(food[0] * CELL_SIZE, food[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function addFood() {
	food.push(Math.ceil(random(0, BOARD_SIZE - 1)));
	food.push(Math.ceil(random(0, BOARD_SIZE - 1)));
	hasFood = true;
}

function collision() {
	let head = snake[0];
	// collision with edges
	if (!isEasy) {
		if (
			head[0] < 0 ||
			head[1] < 0 ||
			head[0] >= BOARD_SIZE ||
			head[1] >= BOARD_SIZE
		) {
			death();
		}
	}

	// colision with myself
	for (let i = 0; i < snake.length; i++) {
		const body = snake[i];
		for (let j = i + 1; j < snake.length; j++) {
			const element = snake[j];
			if (body[0] === element[0] && body[1] === element[1]) death();
		}
	}

	// colision with food
	if (head[0] === food[0] && head[1] === food[1]) {
		eat();
	}
}

function death() {
	isDead = true;
	let hsMsg = DEATH_SCREEN_ELEMENT.getElementsByClassName("new-high-score");

	if (isNewHighScore) hsMsg[0].classList.remove("hide");
	else hsMsg[0].classList.add("hide");

	DEATH_SCREEN_ELEMENT.classList.remove("hide");
	noLoop();
}

function pause() {
	if (isPause) {
		loop();
		isPause = false;
		START_SCREEN_ELEMENT.classList.add("hide");
		PAUSE_SCREEN_ELEMENT.classList.add("hide");
	} else {
		if (!isDead) {
			noLoop();
			isPause = true;
			PAUSE_SCREEN_ELEMENT.classList.remove("hide");
		}
	}
}

function eat() {
	let tail = snake[snake.length - 1];
	snake.push(tail);
	food = [];
	hasFood = false;
	score++;

	if (score > highScore) {
		highScore = score;
		isNewHighScore = true;
	}

	if (!isEasy) {
		if (score % 10 == 0) {
			fps++;
			frameRate(fps);
		}
	}
}

function move() {
	let vector = VECTORS[direction];
	let head = [];

	snake.pop();
	head[0] = snake[0][0] + vector[0];
	head[1] = snake[0][1] + vector[1];

	if (isEasy) {
		if (head[0] >= BOARD_SIZE) head[0] -= BOARD_SIZE;
		if (head[1] >= BOARD_SIZE) head[1] -= BOARD_SIZE;
		if (head[0] < 0) head[0] += BOARD_SIZE;
		if (head[1] < 0) head[1] += BOARD_SIZE;
	}

	snake = [head, ...snake];
}

function showScore() {
	SCORE_ELEMENT.innerText = score;
	HIGH_SCORE_ELEMENT.innerText = highScore;
}

function start() {
	PAUSE_SCREEN_ELEMENT.classList.add("hide");
	DEATH_SCREEN_ELEMENT.classList.add("hide");
	START_SCREEN_ELEMENT.classList.remove("hide");
	fps = 7;
	score = 0;
	speed = 20;
	direction = "down";
	isDead = false;
	hasFood = false;
	isPause = true;
	isEasy = true;
	isNewHighScore = false;
	snake = [[9, 10], [9, 9], [9, 8]];
	food = [];
	noLoop();
	background(255);
	drawGrid();
	showScore();
	setDifficulty(isEasy);
}

function setup() {
	createCanvas(SIZE, SIZE);
	frameRate(fps);
	start();
}

function draw() {
	if (!hasFood) addFood();
	background(255);
	drawGrid();
	drawSnake();
	drawFood();
	showScore();
	move();
	collision();
}

function keyPressed() {
	switch (keyCode) {
		case LEFT_ARROW:
			if (direction !== "right") {
				direction = "left";
				newStep = false;
			}
			break;

		case RIGHT_ARROW:
			if (direction !== "left") {
				direction = "right";
				newStep = false;
			}
			break;

		case DOWN_ARROW:
			if (direction !== "up") {
				direction = "down";
				newStep = false;
			}
			break;

		case UP_ARROW:
			if (direction !== "down") {
				direction = "up";
				newStep = false;
			}
			break;

		case 32:
			pause();
			break;

		case 82:
			start();
			break;
	}
}
