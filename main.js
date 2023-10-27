import './style.css'

//Configuracion del canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGH = 30;
const TIME_TO_DROP = 500;

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGH

context.scale(BLOCK_SIZE,BLOCK_SIZE)


const board = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,0,0],
]

const piece ={
  position :{x:5,y:5},
  shape:[
    [1,1],
    [1,1]
  ]
}

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
]


let lastTime = 0
let dropCounter = 0
// el refrescamiento del juego
function update(time = 0){
  
  const deltaTime = time-lastTime
  lastTime = time
  dropCounter += deltaTime

  if(dropCounter>TIME_TO_DROP){
    piece.position.y++
    dropCounter =0
    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  requestAnimationFrame(update)
}

function draw(){
  context.fillStyle= '#000';

  context.fillRect(0,0,canvas.width,canvas.height)
  board.forEach((row,y)=>{
    row.forEach((value,x)=>{
       if(value === 1){
          context.fillStyle = 'yellow'
          context.fillRect(x,y,1,1)
       }
    })
  })

  piece.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
        if(value ==1){
          context.fillStyle ='red'
          context.fillRect(x+piece.position.x,y+piece.position.y,1,1)
        }
    })
  })
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

function solidifyPiece(){
  piece.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
        if(value === 1){
          board[y+piece.position.y][x+piece.position.x] = 1
        }
    })
  })
  //get random shape and randon position
  piece.shape = piecesShapes[Math.floor(Math.random()* piecesShapes.length)]
  //get random position
  piece.position.x = Math.floor(Math.random() * BOARD_WIDTH/2)
  piece.position.y = 0
  //check is game over
  if(checkCollision()){
    window.alert("Game Over")
    board.forEach(row => row.fill(0))
  }
}

function removeRows(){
  const rowsToRemove = []

  board.forEach((row,y)=>{
    if(row.every(value => value === 1)){
      rowsToRemove.push(y);
    }
  })

  rowsToRemove.forEach(y=>{
    board.splice(y,1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
  })
}

document.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'){
    piece.position.x--
    if(checkCollision())
      piece.position.x++
  }
  if(event.key==='ArrowRight'){
    piece.position.x++
    if(checkCollision())
      piece.position.x--
  }
  if(event.key==='ArrowDown'){
    piece.position.y++;
    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }
})

update();