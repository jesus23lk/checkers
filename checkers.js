const player1 = {
  numPieces: 12,
  numWins: 0
}

const player2 = {
  numPieces: 12,
  numWins: 0
}

const pieceData = {
  pieceColor: '',
  isKing: false
}

/*The object below named 'game' has two booleans that require further explanation. First the boolean 'movesVisible', it is
  true when a player clicks on a piece an the possible places where it can move are visible. The variable is here to prevent a player
  from clicking on another and piece and making its moves also visible which can cause some weird behavior*/

const game = {
  pieces: [],
  player1Turn: true,
  player2Turn: false,
  movesVisible: false,
  leftVisible: '',
  rightVisible: '',
  curPos: '',
  i: 0,
  canJumpLeft: false,
  dangerPositionL: '',
  canJumpRight: false,
  dangerPositionR: ''
}

window.onload = function() {
  
  createBoard();

}

function createBoard() {

  /*This function is in charge of creating our visual html board on our webpage*/

  /*Each piece is given a 'pieceId'. They will be named 'piece-0', 'piece-1', 'piece-2', and so on until the final piece is named
    'piece-23'*/

  let pieceId = 0;

  for(let i = 0; i < 8; i++) {
    
    for(let j = 0; j < 8; j++) {

      const board = document.getElementById('board');

      /*The conditional below is entered to create CREAM SQUARES*/

      if((j + i) % 2 === 0) {
        
        const creamSquare = document.createElement('div');
        creamSquare.className = 'cream-square';
        creamSquare.id = 'loc-' + i + j;            //Note here that 'i + j' is doing string addition which is concatenation
  
        board.appendChild(creamSquare);

      }
      
      /*The conditional below is entered to create BROWN SQUARES*/
      
      else  {
        const brownSquare = document.createElement('div');
        brownSquare.className = 'brown-square';
        brownSquare.id = 'loc-' + i + j;
        
        board.appendChild(brownSquare);

        /*The conditional below is in charge of placing all of the BLACK 
          game pieces on their corresponding brown square*/

        if(i < 3) {
  
          const blackPiece = document.createElement('div');
          blackPiece.className = 'black-piece';
          blackPiece.id = 'piece-' + pieceId;

          pieceId++;

          brownSquare.appendChild(blackPiece);


        }

        /*The conditional below is in charge of placing all of the WHITE
          game pieces on their corresponding brown square*/

        else if (i > 4) {
          
          const whitePiece = document.createElement('div');
          whitePiece.className = 'white-piece';
          whitePiece.id = 'piece-' + pieceId;

          pieceId++;

          brownSquare.appendChild(whitePiece);
          
        }

        /*Every brown square on the board gets an event listener that calls the function 'showMoves()'
          Go to that fucntion definition below to see what happens when you click on a brown square*/

        //Cream squares do not get an event listener
        
        brownSquare.addEventListener('click', showMoves);

      }
    }
  }
}

function showMoves() {
  
  console.log('showMoves entered');
  
  /*This function is where all the magic happens*/
  
  /*The conditional below contains the two conditions under which the function body will not be executed*/

  /*The condition on the left side of the ||, 'game.movesVisible' checks if a player has clicked on a piece already to see
    the possible places it can go. If a player has done this, then they can't click an another piece so the
    fucntion is exited.*/

  /*The condition on the right side of the ||, '!this.children[0]' checks if the square that the player clicked on even has 
    a piece on it. If it doesn't then the function is exited*/

  if(!this.children[0]) return;

  else if (game.movesVisible) {

    if(this === game.curPos) return;

    console.log('changeMove conditional entered');

    changeMove(game.leftVisible, game.rightVisible, game.curPos);

  }

  const piece = this.children[0];   //'piece' corresponds to the game piece that lies on the square that was clicked

  rowNum = Number(this.id[4]);
  colNum = Number(this.id[5]);

  let leftPos = assignLeftPos(rowNum, colNum, piece);
  let rightPos = assignRightPos(rowNum, colNum, piece);

  saveCurPositons(leftPos, rightPos, this);

  playAnimation(leftPos, rightPos, this, piece);

  cancelMove(leftPos, rightPos, this);

  showLeftPos(leftPos, rightPos, this, piece);
  
  showRightPos(leftPos, rightPos, this, piece);

  // this.removeEventListener('click', showMoves);

}

function assignLeftPos(rowNum, colNum, piece) {

  console.log('assign left');
  
  if(game.player1Turn && isWhite(piece)) {
     
    let leftPos = document.getElementById('loc-' + (rowNum - 1) + (colNum - 1));

    if(!leftPos) return leftPos;

    let leftChild = leftPos.firstChild;

    game.dangerPositionL = leftPos;
    
    if(isBlack(leftChild)) {

      leftPos = document.getElementById('loc-' + (rowNum - 2) + (colNum - 2));

      if(isEmptySquare(leftPos)) game.canJumpLeft = true;

    }

    return leftPos;

  }


  else if (game.player2Turn && isBlack(piece)) {

    let leftPos = document.getElementById('loc-' + (rowNum + 1) + (colNum - 1));

    if(!leftPos) return leftPos;

    let leftChild = leftPos.firstChild;

    game.dangerPositionL = leftPos;

    if(isWhite(leftChild)) {

      leftPos = document.getElementById('loc-' + (rowNum + 2) + (colNum - 2) )

      if(isEmptySquare(leftPos)) game.canJumpLeft = true;

    }

    return leftPos;

  }

}

function assignRightPos(rowNum, colNum, piece) {

  console.log('assign right');

  if(game.player1Turn && isWhite(piece)) {
    
    let rightPos = document.getElementById('loc-' + (rowNum - 1) + (colNum + 1));

    if(!rightPos) return rightPos;

    let rightChild = rightPos.firstChild;

    game.dangerPositionR = rightPos;

    if(isBlack(rightChild)) {

      rightPos = document.getElementById('loc-' + (rowNum - 2) + (colNum + 2));

      if(isEmptySquare(rightPos)) game.canJumpRight = true;

    }

    return rightPos;

  }

  else if (game.player2Turn && isBlack(piece)) {

    let rightPos = document.getElementById('loc-' + (rowNum + 1) + (colNum + 1));

    if(!rightPos) return rightPos;

    let rightChild = rightPos.firstChild;

    game.dangerPositionR = rightPos;

    if(isWhite(rightChild)) {

      rightPos = document.getElementById('loc-' + (rowNum + 2) + (colNum + 2));

      if(isEmptySquare(rightPos)) game.canJumpRight = true;

    }

    return rightPos;

  }

}

function changeMove(leftPos, rightPos, curPos) {

  if(rightPos) rightPos.removeEventListener('click', showRight1);
  if(leftPos) leftPos.removeEventListener('click', showLeft1);

  stopAnimation(leftPos, rightPos, curPos);

  game.movesVisible = true;

  curPos.removeEventListener('click', hideMoves);
  curPos.addEventListener('click', showMoves);

}

function cancelMove(leftPos, rightPos, curPos) {

  curPos.addEventListener('click', hideMoves = () => {

    stopAnimation(leftPos, rightPos, curPos);
    
    game.movesVisible = false;

    removeListeners(leftPos, rightPos, curPos);

  });    


}

function showLeftPos(leftPos, rightPos, curPos, piece) {

  if(!leftPos || leftPos.children[0]) return;

  leftPos.addEventListener('click', showLeft1 = () => {

    calcLeftMove(piece, leftPos);

    removeListeners(leftPos, rightPos, curPos);
    
    stopAnimation(leftPos, rightPos, curPos);

    changePlayerTurn();
    
  });
}

function showRightPos(leftPos, rightPos, curPos, piece) {

  if(!rightPos || rightPos.children[0]) return;
  
  rightPos.addEventListener('click', showRight1 = function() {

    calcRightMove(piece, rightPos);

    removeListeners(leftPos, rightPos, curPos);

    stopAnimation(leftPos, rightPos, curPos);

    changePlayerTurn();

  });
}

function saveCurPositons(leftPos, rightPos, curPos) {

  if(leftPos) game.leftVisible = leftPos;
  if(rightPos) game.rightVisible = rightPos;
  game.curPos = curPos;
}

function playAnimation(leftPos, rightPos, curPos, piece) {
  
  if(isEmptySquare(leftPos)) {
    leftPos.style.backgroundColor = 'green';
    leftPos.style.animationIterationCount = 'infinite';
  } 
  
  if(isEmptySquare(rightPos)) {
    rightPos.style.backgroundColor = 'green';
    rightPos.style.animationIterationCount = 'infinite';
  }
  
  curPos.style.backgroundColor = 'rgb(190, 6, 6)';
  game.movesVisible = true;

  console.log('canJumpLeft:', game.canJumpLeft);
  console.log('canJumpRight:', game.canJumpRight);

}

function stopAnimation(leftPos, rightPos, curPos) {

  game.canJumpLeft = false;
  game.canJumpRight = false;

  if(leftPos) {
    leftPos.style.backgroundColor = 'rgb(135, 93, 55)';
    leftPos.style.animationIterationCount = '0';
  }
  
  if(rightPos) {
    rightPos.style.backgroundColor = 'rgb(135, 93, 55)';
    rightPos.style.animationIterationCount = '0';
  }  

  curPos.style.backgroundColor = 'rgb(135, 93, 55)';
}

function removeListeners(leftPos, rightPos, curPos) {

  if(leftPos) leftPos.removeEventListener('click', showLeft1);
  if(rightPos) rightPos.removeEventListener('click', showRight1);
  curPos.removeEventListener('click', hideMoves);
}

function changePlayerTurn() {

  if(game.player1Turn) {

    game.movesVisible = false;
    game.player1Turn = false;
    game.player2Turn = true;

    document.getElementById('player-turn').innerHTML = 'Player 2 Turn';
    document.getElementById('header-div').style.backgroundColor = 'rgb(38, 38, 202)';
    
  }

  else if (game.player2Turn) {

    game.movesVisible = false;
    game.player1Turn = true;
    game.player2Turn = false;

    document.getElementById('player-turn').innerHTML = 'Player 1 Turn';
    document.getElementById('header-div').style.backgroundColor = 'rgb(218, 21, 21)';

  }
}

function calcLeftMove(piece, newPos) {

  if(game.canJumpLeft) jumpLeft(piece);

  else moveLeft(piece);

  piece.addEventListener('transitionend', () =>{
  
    newPos.appendChild(piece);
  
    piece.style.translate = '0px 0px';
  
  });

  
}

function jumpLeft(piece) {

  if(game.player1Turn) piece.style.translate = '-140px -140px';

  else piece.style.translate = '-140px 140px';

  piece.style.transition = '.3s';

  game.dangerPositionL.removeChild(game.dangerPositionL.firstChild);

}

function moveLeft(piece) {
  
  if(game.player1Turn) piece.style.translate = '-70px -70px';
  
  else piece.style.translate = '-70px 70px';
  
  piece.style.transition = '.4s';

}

function calcRightMove(piece, newPos) {

  if(game.canJumpRight) jumpRight(piece);

  else moveRight(piece);

  piece.addEventListener('transitionend', () =>{

    newPos.appendChild(piece);

    piece.style.translate = 'none';
    piece.style.transition = 'none';

  });
}

function jumpRight(piece) {

  if(game.player1Turn) piece.style.translate = '140px -140px';

  else piece.style.translate = '140px 140px';

  piece.style.transition = '.3s';

  game.dangerPositionR.removeChild(game.dangerPositionR.firstChild);

}

function moveRight(piece) {

  if(game.player1Turn) piece.style.translate = '70px -70px';
  
  else piece.style.translate = '70px 70px';

  piece.style.transition = '.4s';
}

function isBlack(piece) {

  if(piece && piece.className === 'black-piece') return true

  else return false;

}

function isWhite(piece) {

  if(piece && piece.className === 'white-piece') return true;

  else return false;

}

function isEmptySquare(position) {

  if(position && !position.firstChild) return true;

  else return false;
}