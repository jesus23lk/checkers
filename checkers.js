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
  i: 0
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

function showMoves() {

  /*This function is where all the magic happens*/
  
  /*The conditional below contains the two conditions under which the function body will not be executed*/

  /*The condition on the left side of the ||, 'game.movesVisible' checks if a player has clicked on a piece already to see
    the possible places it can go. If a player has done this, then they can't click an another piece so the
    fucntion is exited.*/

  /*The condition on the right side of the ||, '!this.children[0]' checks if the square that the player clicked on even has 
    a piece on it. If it doesn't then the function is exited*/

  game.i++;

  console.log('This is click number ' + game.i);

  console.log('moves Visible is ' + game.movesVisible);

  if(!this.children[0]) return;

  else if (game.movesVisible) {

    if(this === game.curPos) return;

    console.log('changeMove conditional entered');

    changeMove(game.leftVisible, game.rightVisible, game.curPos);

  }

  game.curPos = this;


  const piece = this.children[0];   //'piece' corresponds to the game piece that lies on the square that was clicked

  rowNum = Number(this.id[4]);

  colNum = Number(this.id[5]);

  /*Conditional below deals only with moving WHITE pieces and will not be entered if it is
    player 2's turn*/

    let leftPos;
    let rightPos;

  if(game.player1Turn && piece.className === 'white-piece') {
    
    leftPos = document.getElementById('loc-' + (rowNum - 1) + (colNum - 1));
    rightPos = document.getElementById('loc-' + (rowNum - 1) + (colNum + 1));

  }

  else if (game.player2Turn && piece.className === 'black-piece') {

    leftPos = document.getElementById('loc-' + (rowNum + 1) + (colNum - 1));
    rightPos = document.getElementById('loc-' + (rowNum + 1) + (colNum + 1));

  }

  else return;


  /*The if statement below is entered when we click on a white pice that lies along
    the left edge of the board*/

  if(!leftPos && !rightPos.children[0]) {

    console.log('correct loop entered');

    rightPos.style.backgroundColor = 'green';

    game.movesVisible = true;

    cancelMove(leftPos, rightPos, this);

    showRightPos(leftPos, rightPos, piece);
  }

  /*The conditional below is entered when we click on a white piece that lies along 
    the right edge of the board*/

  else if(!rightPos && !leftPos.children[0]) {

    leftPos.style.backgroundColor = 'green';

    game.movesVisible = true;

    cancelMove(leftPos, rightPos, this);

    showLeftPos(leftPos, rightPos, piece);
  }

  else if(!leftPos.children[0] && !rightPos.children[0]) {

    leftPos.style.backgroundColor = 'green';
    rightPos.style.backgroundColor = 'green';

    game.movesVisible = true;

    cancelMove(leftPos, rightPos, this);

    showLeftPos(leftPos, rightPos, piece);

    showRightPos(leftPos, rightPos, piece);

    this.removeEventListener('click', showMoves);

  }

  else if(!leftPos.children[0]) {

    leftPos.style.backgroundColor = 'green';

    game.movesVisible = true;

    cancelMove(leftPos, rightPos, this);

    showLeftPos(leftPos, rightPos, piece);

  }

  else if(!rightPos.children[0]) {

    rightPos.style.backgroundColor = 'green';

    game.movesVisible = true;

    cancelMove(leftPos, rightPos, this);

    showRightPos(leftPos, rightPos, piece);

  }

}

function changeMove(leftPos, rightPos, curPos) {

  if(rightPos) rightPos.removeEventListener('click', showRight1);
  if(leftPos) leftPos.removeEventListener('click', showLeft1);

  if(leftPos) leftPos.style.backgroundColor = 'rgb(135, 93, 55)';
  if(rightPos) rightPos.style.backgroundColor = 'rgb(135, 93, 55)';

  game.movesVisible = true;

  curPos.removeEventListener('click', hideMoves);
  curPos.addEventListener('click', showMoves);

}

function cancelMove(leftPos, rightPos, curPos) {

  curPos.addEventListener('click', hideMoves = () => {

    console.log(curPos);
    
    if(rightPos) rightPos.removeEventListener('click', showRight1);
    if(leftPos) leftPos.removeEventListener('click', showLeft1);

    console.log('cancel EL entered');

    if(leftPos) leftPos.style.backgroundColor = 'rgb(135, 93, 55)';
    if(rightPos) rightPos.style.backgroundColor = 'rgb(135, 93, 55)';

    
    game.movesVisible = false;
    curPos.addEventListener('click', showMoves);
    
    curPos.removeEventListener('click', hideMoves);

  });    


}

function showLeftPos(leftPos, rightPos, piece) {

  game.leftVisible = leftPos;
  game.rightVisible = rightPos;

  leftPos.addEventListener('click', showLeft1 = () => {

    if(game.player1Turn) {

      piece.style.translate = '-70px -70px';
      
    }

    else {

      console.log('entered');

      piece.style.translate = '-70px 70px';

    }

    piece.style.transition = '.4s';
    
    piece.addEventListener('transitionend', () =>{


      leftPos.appendChild(piece);

      piece.style.translate = '0px 0px';

    });

    /*Below we are turning the square color back to brown*/

    if(rightPos) rightPos.style.backgroundColor = 'rgb(135, 93, 55)';
    leftPos.style.backgroundColor = 'rgb(135, 93, 55)';

    
    if(rightPos) rightPos.removeEventListener('click', showRight1);
    leftPos.removeEventListener('click', showLeft1);
    
    changePlayerTurn();
    
  });

}

function showRightPos(leftPos, rightPos, piece) {

  game.leftVisible = leftPos;
  game.rightVisible = rightPos;
  
  rightPos.addEventListener('click', showRight1 = function() {

    if(game.player1Turn) {

      piece.style.translate = '70px -70px';
      
    }
    
    else {

      piece.style.translate = '70px 70px';

    }

    piece.style.transition = '.4s';

    piece.addEventListener('transitionend', () =>{

      rightPos.appendChild(piece);

      piece.style.translate = 'none';
      piece.style.transition = 'none';

    });

    /*Below we are turning the square color back to brown*/

    if(leftPos) leftPos.style.backgroundColor = 'rgb(135, 93, 55)';
    rightPos.style.backgroundColor = 'rgb(135, 93, 55)';

    
    if(leftPos) leftPos.removeEventListener('click', showLeft1);
    rightPos.removeEventListener('click', showRight1);
    
    
    changePlayerTurn();
  });
}
