var canvas = document.getElementById("pintura")
var ctx = canvas.getContext("2d");

var begin = false;
var tempoAntigo = Date.now();

var maxPontuation = 0;
var pontuation = 1;
var timePlacar = 0;
var time = 0;
var gameOverTime = 0;
var isGameOver = false;

let musicTheme = new Audio()
musicTheme.src = "audio/RE3Nemesis_UnstoppableNemesis.mp3"

let gameOverImage = new Image();
gameOverImage.src = "img/GameOver.png"

let inicio = {
    X: 0,
    Y: 0,
    timeCounter: 0,
    frame: 0,
    background: []
}

let world = {
    gravity: 10 * 100,
    floor: 595,
}

let cidade = {
    acceleration: 25,
    speed: 230,
    X: 0,
    Y: 0,
    orientation: -1,
    background: new Image()
}

let nemesis = {
    acceleration: 25,
    speed: 150,
    altura: 270,
    largura: 170,
    X: 10,
    Y: 325,
    characterImage: new Image()
}

let jill = {
    speedY: 0,
    massa: 75,
    crouch: false,
    altura: 150,
    largura: 80,
    X: 650,
    Y: 445,
    characterImage: new Image()
}

let obstacles = {
    obstacle: [],
    speed: 230,
    acceleration: 25,
}

let pontos = {
    cor: "#FFFFFF",
    font: "40px Arial",
}



function startScreen(){
    for (image = 0; image < 60; image++){
        inicio.background.push(new Image());
        if (image < 10){
            inicio.background[image].src = "img/gif/TheLastEscape0"+String(image)+".gif";
        }
        else{
            inicio.background[image].src = "img/gif/TheLastEscape"+String(image)+".gif";
        }
    }
}

function drawMenu(deltaTime){
    ctx.drawImage(inicio.background[inicio.frame], inicio.X, inicio.Y);
    inicio.timeCounter += deltaTime;
    if (inicio.timeCounter > (1 / 30) * (inicio.frame + 1)){
        inicio.frame += 1
        if (inicio.frame == 60){
            inicio.frame = 0
            inicio.timeCounter = 0
        }
    }
}

function start(){

    tempoAntigo = Date.now();

    pontuation = 1;
    timePlacar = 0;
    time = 0;



    musicTheme = new Audio()
    musicTheme.src = "audio/RE3Nemesis_UnstoppableNemesis.mp3"

    inicio = {
        X: 0,
        Y: 0,
        timeCounter: 0,
        frame: 0,
        background: []
    }

    world = {
        gravity: 10 * 100,
        floor: 595,
    }

    cidade = {
        acceleration: 25,
        speed: 230,
        X: 0,
        Y: 0,
        orientation: -1,
        background: new Image()
    }

    nemesis = {
        acceleration: 25,
        speed: 150,
        altura: 270,
        largura: 170,
        X: 10,
        Y: 325,
        characterImage: new Image()
    }

    jill = {
        speedY: 0,
        massa: 75,
        crouch: false,
        altura: 150,
        largura: 80,
        X: 650,
        Y: 445,
        characterImage: new Image()
    }

    obstacles = {
        obstacle: [],
        speed: 230,
        acceleration: 25,
    }

    pontos = {
        cor: "#FFFFFF",
        font: "40px Arial",
    }

    cidade.background.src = "img/cidade.jpg";
    nemesis.characterImage.src = "img/Nemesis.png";
    jill.characterImage.src = "img/Jill.png";

    begin = true;
}

//DELTA TIME É O INTERVALO DE TEMPO ENTRE 2 FRAMES
function getDeltaTime(){
    let tempoAgora = Date.now();
    let deltaTime = ((tempoAgora - tempoAntigo) / 1000);
    tempoAntigo = tempoAgora;
    
    return deltaTime;
}

function drawText(text, X, Y){
    ctx.fillStyle = pontos.cor;
    ctx.font = pontos.font
    ctx.fillText(text, X, Y);
}

function placar(deltaTime){
    if ((begin == true) && (isGameOver == false)){
        timePlacar += deltaTime
        pontuation = Math.floor(timePlacar * 5)
    }
}

function checkSpeedLimit(){
    if (cidade.speed > 1100){
        cidade.speed = 1100;
    }
    
    else if (cidade.speed < -500){
        cidade.speed = -500
    }
}

function checkSpeedLimitObstacles(){
    if (obstacles.speed > 1100){
        obstacles.speed = 1100;
    }
}

function gameOver(){
    isGameOver = true;
    musicTheme.pause()
}

function gameOverring(deltaTime){
    if (isGameOver == true){
        if (pontuation > maxPontuation){
            maxPontuation = pontuation;
        }
    
        gameOverTime += deltaTime
        if (gameOverTime >= 5){
            gameOverTime = 0
            begin = false;
            isGameOver = false;
        }
    }
}

function drawGameOver(){
    if (isGameOver == true){
        ctx.drawImage(gameOverImage, ((canvas.width / 2) - (840 / 2)), ((canvas.height / 2) - (360 / 2)));

        drawText(pontuation, ((canvas.width / 2) - 20), ((canvas.height / 2) + 15));
        drawText(maxPontuation, ((canvas.width / 2) - 20), ((canvas.height / 2) + 120));
    }
}

function accelerateCity(deltaTime){
    cidade.speed += cidade.acceleration * deltaTime * deltaTime;
    cidade.acceleration += 1 * deltaTime;
}

function resetCityPosition(){
    if(cidade.X < -1400) {
        cidade.X = 0;
    }
}

function drawCity(x, y){
    ctx.drawImage(cidade.background, x, y);
}

function moveCity(deltaTime){

    accelerateCity(deltaTime);
    checkSpeedLimit();

    cidade.X += cidade.orientation * cidade.speed * deltaTime;

    resetCityPosition();
}

function timeGame(deltaTime){
    time += deltaTime
    while (time >= 2){
        time -= 2;
        trySpawn();
    }
}

function drawCharacters(character){
    ctx.drawImage(character.characterImage, character.X, character.Y, character.largura, character.altura);
}

function accelerateObstacles(deltaTime){
    obstacles.speed += obstacles.acceleration * deltaTime * deltaTime;
    obstacles.acceleration += 1 * deltaTime;
}

function moveObstacles(deltaTime){

    accelerateObstacles(deltaTime)
    checkSpeedLimitObstacles()

    for (i = 0; i < obstacles.obstacle.length; i++){
        obstacles.obstacle[i].X -= obstacles.speed * deltaTime;
    }
    for (i = 0; i < obstacles.obstacle.length; i++){
        if (obstacles.obstacle[i].X <= 0 - obstacles.obstacle[i].largura){
            obstacles.obstacle.splice(i, 1);
        }
    }
}

function spawnZombie(){
    obstacles.obstacle.push({type:"Zombie", X: 1400 + 58, Y: world.floor - 150, altura: 150, largura: 58, characterImage: new Image()});
    obstacles.obstacle[obstacles.obstacle.length - 1].characterImage.src = "img/Zombie.png";
}

function spawnBarricada(){
    obstacles.obstacle.push({type:"Barricada", X: 1400 + 100, Y: world.floor - 100, altura: 100, largura: 100, characterImage: new Image()});
    obstacles.obstacle[obstacles.obstacle.length - 1].characterImage.src = "img/Barricada.png";
}

function spawnCrows(){
    obstacles.obstacle.push({type:"Crows", X: 1400 + 230, Y: world.floor - 200, altura: 80, largura: 230, characterImage: new Image()});
    obstacles.obstacle[obstacles.obstacle.length - 1].characterImage.src = "img/Crows.png";
}

function spawnCar(){
    obstacles.obstacle.push({type:"Car", X: 1400 + 222, Y: world.floor - 120, altura: 120, largura: 220, characterImage: new Image()});
    obstacles.obstacle[obstacles.obstacle.length - 1].characterImage.src = "img/Carro.png";
}

function drawObstacles(){
    for (i = 0; i < obstacles.obstacle.length; i++){
        drawCharacters(obstacles.obstacle[i]);
    }
}

function randomObstacles(){
    typeObstacle = Math.floor(Math.random() * 4)

    if (typeObstacle == 0){
        spawnZombie()
    }
    else if (typeObstacle == 1){
        spawnBarricada()
    }
    else if (typeObstacle == 2){
        spawnCrows()
    }
    else if (typeObstacle == 3){
        spawnCar()
    }
}

function trySpawn(){
    prob = Math.floor(Math.random() * 2)
    if (prob == 1){
        randomObstacles()
    }
}

function colision(){
    for (i = 0; i < obstacles.obstacle.length; i++){
        
        if (obstacles.obstacle[i].type == "Barricada" || obstacles.obstacle[i].type == "Car"){
            if ((jill.X + jill.largura > obstacles.obstacle[i].X) && (jill.X < obstacles.obstacle[i].X + obstacles.obstacle[i].largura)){

                // Verifica se a Jill deve ficar em cima do obstáculo
                if (((jill.Y + jill.altura) >= obstacles.obstacle[i].Y) && ((jill.Y + jill.altura) <= obstacles.obstacle[i].Y + (obstacles.obstacle[i].altura / 10))){
                    jill.Y = obstacles.obstacle[i].Y - jill.altura
                    jill.speedY = 0
                }

                // Caso não, Jill é empurrada
                else if ((jill.Y + jill.altura) > obstacles.obstacle[i].Y + (obstacles.obstacle[i].altura / 10)){
                    jill.X = obstacles.obstacle[i].X - jill.largura;
                } 
            }
        }

        else if (obstacles.obstacle[i].type == "Zombie" || obstacles.obstacle[i].type == "Crows"){
            if ((jill.X + jill.largura - 40 > obstacles.obstacle[i].X) && (jill.X < obstacles.obstacle[i].X + obstacles.obstacle[i].largura)){
                if ((jill.Y + jill.altura > obstacles.obstacle[i].Y) && (jill.Y < obstacles.obstacle[i].Y + obstacles.obstacle[i].altura)){
                    gameOver();
                }
            }  
        } 
    }

    if ((jill.X + jill.largura > nemesis.X) && (jill.X < nemesis.X + nemesis.largura)){
        if ((jill.Y + jill.altura > nemesis.Y) && (jill.Y < nemesis.Y + nemesis.altura)){
            gameOver();
        }
    }  
}

function impulso(){
    if (((jill.Y == world.floor - jill.altura) || (jill.Y == world.floor - jill.altura - 100 && jill.speedY == 0) || (jill.Y == world.floor - jill.altura - 120 && jill.speedY == 0)) && (jill.crouch == false)){
        jill.speedY = -6.2 * 100;
    }    
}

function updateMainCharacterMove(deltaTime){
    jill.Y += jill.speedY * deltaTime
    jill.speedY += world.gravity * deltaTime
    if (jill.Y >= world.floor - jill.altura){
        jill.Y = world.floor - jill.altura
        jill.speedY = 0
    }
}

function slide(){
    if (jill.Y == world.floor - jill.altura && jill.crouch == false){
        jill.altura = jill.altura - 50;
        jill.Y += 50;
        jill.crouch = true;
    }
}

function standing(){
    if (jill.Y == world.floor - jill.altura && jill.crouch == true){
        jill.Y -= 50;
        jill.altura = jill.altura + 50;
        jill.crouch = false;
    }
}


// main() = tick()
function tick(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let deltaTime = getDeltaTime();

    if(begin == false){
        startScreen();
        drawMenu(deltaTime);
    }

    if(begin == true){

        moveObstacles(deltaTime);
        moveCity(deltaTime);
        updateMainCharacterMove(deltaTime);
        placar(deltaTime);
        timeGame(deltaTime);
        colision();
        gameOverring(deltaTime);


        drawCity(cidade.X, cidade.Y);
        drawCity(cidade.X - 1400 * cidade.orientation, cidade.Y);
        drawObstacles();
        drawCharacters(nemesis);
        drawCharacters(jill);


        drawText(pontuation, 650, 50);
        drawText(maxPontuation, 1300, 50);
        drawGameOver();
    }


    requestAnimationFrame(tick)
}

document.addEventListener("keydown", function(evento){
    var keyCode = evento.keyCode;
    if (keyCode == 32) {
        if (begin == false){
            start()
            musicTheme.play()
        }
        else{
            impulso()
        }
    }
    if (keyCode == 83) {
        slide()
    }
})

document.addEventListener("keyup", function(evento){
    var keyCode = evento.keyCode;
    if (keyCode == 83) {
        standing()
    }
})

tick()