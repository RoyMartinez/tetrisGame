import './style.css'

//Configuracion del canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGH = 30;

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

// el refrescamiento del juego
function update(){
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
  return piece.shape.find((row,x)=>{
    return row.find((value,y)=>{
      return(
        value !== 0 &&
        board[y+piece.position.y]?.[x+piece.position.x]!== 0
      )
    })
  })
}

function solidifyPiece(){
  piece.shape.forEach((row,x)=>{
    row.forEach((value,y)=>{
        if(value === 1){
          board[y+piece.position.y][x+piece.position.x] = 1
        }
    })
  })
  piece.position.x = 3
  piece.position.y = 2
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