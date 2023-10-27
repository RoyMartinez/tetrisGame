import './style.css'
import {BLOCK_SIZE,BOARD_HEIGH,BOARD_WIDTH,TIME_TO_DROP,MOVEMENTS,COLOURS} from './const'


const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')

let score = 0
let lastTime = 0
let dropCounter = 0
canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGH
context.scale(BLOCK_SIZE,BLOCK_SIZE)

const board = createBoard(BOARD_WIDTH,BOARD_HEIGH)
const piecesShapes = [
  [
    [1,1],
    [1,1]
  ],
  [
    [0,1,1],
    [1,1,0]
  ],
  [
    [1,1,1],
    [0,1,0]
  ],
  [
    [1,1,1,1]
  ],
  [
    [1,1,0],
    [0,1,1]
  ],
  [
    [1,0,0],
    [1,1,1]
  ],
  [
    [0,0,1],
    [1,1,1]
  ]
]

const piece ={
  position :{x:5,y:5},
  shape: getShape()
}

function getShape(){
  return piecesShapes[Math.floor(Math.random()* piecesShapes.length)]
}

function createBoard(width, height){
  return Array(height).fill().map(()=> Array(width).fill(0))
}



function drawBackGround(){
  context.fillStyle= COLOURS.BOARD;
  context.fillRect(0,0,canvas.width,canvas.height)
}
function drawSolidifiedPieces(){
  board.forEach((row,y)=>{
    row.forEach((value,x)=>{
       if(value === 1){
          context.fillStyle = COLOURS.SOLIDIFIED_PIECE
          context.fillRect(x,y,1,1)
       }
    })
  })
}
function drawPiece(){
  piece.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
        if(value ==1){
          context.fillStyle =COLOURS.PIECE
          context.fillRect(x+piece.position.x,y+piece.position.y,1,1)
        }
    })
  })
}

function draw(){
  drawBackGround()
  drawSolidifiedPieces()
  drawPiece()
}

function checkCollision(){
  return piece.shape.find((row,y)=>{
    return row.find((value,x)=>{
      return(
        value !== 0 &&
        board[y+piece.position.y]?.[x+piece.position.x]!== 0
      )
    })
  })
}

function checkGameOver(){
  if(checkCollision()){
    window.alert("Game Over")
    board.forEach(row => row.fill(0))
  }
}

function restartPiecePosition(){
  //get random shape and randon position
  piece.shape = getShape()
  //get random position
  piece.position.x = Math.floor(Math.random() * BOARD_WIDTH/2)
  piece.position.y = 0
  
  checkGameOver()
}

function solidifyPiece(){
  piece.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
        if(value === 1){
          board[y+piece.position.y][x+piece.position.x] = 1
        }
    })
  })
  restartPiecePosition();
}

function removeRows(){
  const rowsToRemove = []

  board.forEach((row,y)=>{
    if(row.every(value => value === 1)){
      rowsToRemove.push(y);
    }
  })

  rowsToRemove.forEach(y=>{
    score +=10
    board.splice(y,1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
  })
  $score.innerText = score
}


function moveLeft(){
  piece.position.x--
  if(checkCollision())
    piece.position.x++
}
function moveRigth(){
  piece.position.x++
  if(checkCollision())
    piece.position.x--
}
function moveDown(){
  piece.position.y++;
  if(checkCollision()){
    piece.position.y--
    solidifyPiece()
    removeRows()
  }
}
function moveUp(){
  const rotatedShape = []
  for(let i = 0; i < piece.shape[0].length;i++){
    const row =[]
    for(let j = piece.shape.length-1;j>=0;j--){
      row.push(piece.shape[j][i])
    }
    rotatedShape.push(row)
  }
  const originalShape = piece.shape
  piece.shape = rotatedShape
  if(checkCollision()){
    piece.shape = originalShape
  }
}


document.addEventListener('keydown',event=>{
  if(event.key===MOVEMENTS.LEFT) moveLeft()
  if(event.key===MOVEMENTS.RIGHT) moveRigth()
  if(event.key===MOVEMENTS.DOWN) moveDown()
  if(event.key === MOVEMENTS.UP) moveUp()
})


function drop(time){
  const deltaTime = time-lastTime
  lastTime = time
  dropCounter += deltaTime

  if(dropCounter>TIME_TO_DROP){
    piece.position.y++
    dropCounter=0
    moveDown()
  }
}

// el refrescamiento del juego
function update(time = 0){
  drop(time)
  draw()
  requestAnimationFrame(update)
}

function start(){
  update()
}

start()