let on = false;

const piece = document.getElementById('piece');
const square1 = document.getElementById('top-left');
const square2 = document.getElementById('bot-right');

console.log(piece);

piece.addEventListener('click', () => {

  if (!on) {
    piece.style.animationIterationCount = 'infinite';
    square1.style.animationIterationCount = 'infinite';
    square2.style.animationIterationCount = 'infinite';
    on = true;
  }

  else {
    piece.style.animationIterationCount = '0';
    square2.style.animationIterationCount = '0';
    square1.style.animationIterationCount = '0';

    on = false;
  } 

});