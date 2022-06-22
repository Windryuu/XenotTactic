const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 900;

//globals
const cellSize = 50;
let frame = 0;
let enemiesInterval = 600;

const gameGrid = [];
const defenders = [];
const enemies = [];

//mouse
const mouse = {
    x: 10,
    y: 10,
    width : 0.1,
    height : 0.1,
}

let canvasPosition = canvas.getBoundingClientRect();
//console.log(canvasPosition);
canvas.addEventListener('mousemove' , function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave',function(e){
    mouse.x = undefined;
    mouse.y = undefined;
})

//game board
const controlsBar = {
    width : canvas.width,
    height : cellSize,
}





class Defender{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = cellSize *2;
        this.height = cellSize *2;
        this.range = 200;
        this.isSelected = false;
    }

    draw(){
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x,this.y,this.width,this.height);
        
    }

    drawRange(){
        
        ctx.beginPath();
        ctx.arc(this.x + cellSize, this.y + cellSize, this.range,0,Math.PI * 2);
        ctx.stroke(); 
    
    
    }

    //update(){}
    //upgrade(){}
}

function handleDefenders(){
    for(let i =0;i<defenders.length;i++){
        defenders[i].draw();
        if(defenders[i].isSelected === true) defenders[i].drawRange();
    }
}



class Cell {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.isTaken = false;

    }

    draw(){
        if(mouse.x && mouse.y && collision(this,mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x,this.y,this.width + cellSize,this.height + cellSize); 
        }
    }
}

function createGrid(){
    for(let y = cellSize; y < canvas.height; y+= cellSize){
        for(let x = 0; x < canvas.width; x+= cellSize){
            gameGrid.push(new Cell(x,y));
        }
    }
}
createGrid();
function handleGameGrid(){
    for(let i =0; i < gameGrid.length;i++){
        gameGrid[i].draw();
    }
}



class Enemy{
    constructor(verticalPosition) {
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize;
        this.height = cellSize;
        this.speed = 1;
        this.movement = this.speed;
        this.health = 5;
        this.maxHealth = this.health;
        
    }
    update(){
        this.x -= this.movement;
    }

    draw(){
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

function handleEnemies(){
    for(let i=0;i<enemies.length;i++){
        if(enemies[i].x < 0 - cellSize){
            enemies.splice(i,1);
            
        }

            //Algo fastest path
            //Fonction de déplacement
            for(let j=0;j<defenders.length;j++){
                //while
                
                if(enemies[i].y > defenders[j].y - cellSize){                    
                    enemies[i].y -= 1;
                    enemies[i].movement = 0;
                } else {
                    enemies[i].movement = 1;
                }
            }
        
        
        enemies[i].update();
        enemies[i].draw();
        
    }
    
    if(frame % enemiesInterval === 0){
        let verticalPosition = Math.floor(Math.random() *16 +1) *cellSize;
        enemies.push(new Enemy(verticalPosition));
        //enemyPositions.push(verticalPosition);
        //if(enemiesInterval > 120) enemiesInterval -= 50;
        console.log(enemies);
    }

}





canvas.addEventListener('click',function(e){
    const gridPositionX = mouse.x - (mouse.x%cellSize);
    const gridPositionY = mouse.y - (mouse.y%cellSize);
    if(gridPositionY < cellSize)return;
    
    // for(let i = 0; i < defenders.length; i++){
    //     if( (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) || 
    //         (defenders[i].x === gridPositionX - cellSize && defenders[i].y === gridPositionY) ||
    //         (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY - cellSize) ||
    //         (defenders[i].x === gridPositionX - cellSize && defenders[i].y === gridPositionY - cellSize) || 
    //         (defenders[i].x === gridPositionX + cellSize && defenders[i].y === gridPositionY + cellSize) ||
    //         (defenders[i].x === gridPositionX + cellSize && defenders[i].y === gridPositionY) ||
    //         (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY + cellSize) ||
    //         (defenders[i].x === gridPositionX + cellSize && defenders[i].y === gridPositionY - cellSize) ||
    //         (defenders[i].x === gridPositionX - cellSize && defenders[i].y === gridPositionY + cellSize)
    //          ){
                
    //         defenders[i].isSelected = !(defenders[i].isSelected);

    //     return;}
    
    // }

    for(let i = 0; i < gameGrid.length;i++){
        //if()
    }

    for(let j = 0; j < defenders.length;j++){
        defenders[j].isSelected = false;
    }
    for(let k = 0; k < gameGrid.length;k++){
        if(gameGrid[k].x === gridPositionX && gameGrid[k].y === gridPositionY){
            gameGrid[k].isTaken = true;
            gameGrid[k+1].isTaken = true;
            gameGrid[k+18].isTaken = true;
            gameGrid[k+19].isTaken = true;
        }
    }
    defenders.push(new Defender(gridPositionX,gridPositionY));
    console.log(defenders);
})


const levelsWall = {
    width: cellSize,
    height: cellSize,
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0,0,controlsBar.width,controlsBar.height);
    ctx.fillStyle = 'black';
    handleGameGrid();
    handleDefenders();
    handleEnemies();
    frame++;

    requestAnimationFrame(animate);
}

animate();

function collision(first,second){
    if(!(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y
        )){
            return true;
        }
}

window.addEventListener('resize',function(){
    canvasPosition = canvas.getBoundingClientRect();
})