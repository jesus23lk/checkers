const topLeft = document.getElementById('top-left');

topLeft.addEventListener('click', () => {
  changeColor(topLeft);
} )

const topRight = document.getElementById('top-right');

changeColor(topRight);

function changeColor(position) {

  console.log(position);

  console.log('yes');
  
  position.style.backgroundColor = 'red';

}