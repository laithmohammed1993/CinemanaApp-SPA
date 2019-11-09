// set variables & functions
// const domain = 'http://localhost:3000';
// const domain = 'https://cinemana-spa.herokuapp.com';
// 2019-11-08T09:56:57.277338+00:00 
localStorage.cardIndex = 0; 
localStorage.totalFilms = 0; 
localStorage.sliderState = false
if(!localStorage.savedFilms){ localStorage.savedFilms = "[]"; }
// Add listener when page is load
window.addEventListener('load',(e)=>{
  // Routing
  routing()
  // Listener over any key pressed
  document.onkeydown = arrowNavigation;
})
function routing(){ // Navigator for this app
  let path = window.location.pathname;
  switch (path) {
    case '/'            : getData();break;
    case '/index.html'  : getData();break;
    case '/home'        : getData();break;
    case '/menu'        : break;
    case '/search'      : searching({renderElement:true});break;
    case '/saved'       : savedRender();break;
    case '/about'       : aboutUsRender();break;
    default             : getData();break;
  }
}
function arrowNavigation(e){
  // Set object include all directions for arrow keys 
  let ArrowKeys = { 
    left : 37,
    up   : 38,
    right: 39,
    down : 40
  }
  // Ckeck if arrow keys are pressed
  if(Object.values(ArrowKeys).indexOf(e.keyCode) !== -1){
    // Ckeck right arrow key is pressed and slider is opened for close it
    if(e.keyCode === ArrowKeys.right && localStorage.sliderState){ sliderToggle(false) }
    // Check if there are elements
    if(localStorage.totalFilms > 0){
      // Calculate how many Cards per row into main container
      let cardsRow = cardsPerRow(); 
      // Get total films that we have
      let totalFilms = localStorage.totalFilms;
      // Get max index to hold movement to Down
      let maxIndex = totalFilms-1;
      let oldCardIndex = parseInt(localStorage.getItem('cardIndex'));
      let newCardIndex;
        if(ArrowKeys.left  === e.keyCode){ newCardIndex = oldCardIndex-1          < 0        ? maxIndex     : oldCardIndex-1 }
        if(ArrowKeys.up    === e.keyCode){ newCardIndex = oldCardIndex - cardsRow < 0        ? oldCardIndex : oldCardIndex - cardsRow }
        if(ArrowKeys.right === e.keyCode){ newCardIndex = oldCardIndex+1          > maxIndex ? 0            : oldCardIndex+1 }
        if(ArrowKeys.down  === e.keyCode){ newCardIndex = oldCardIndex + cardsRow > maxIndex ? oldCardIndex : oldCardIndex + cardsRow }
      localStorage.setItem('cardIndex',newCardIndex);
      document.getElementById('card'+oldCardIndex).style.border = '2px solid #464646';
      let newCard = document.getElementById('card'+newCardIndex);
      newCard.style.border = '2px solid #4285F4';
      newCard.scrollIntoView({block:'center'})
    }
  }
}
function getData(){ // Get all films from server side
  let container = document.getElementById('container')
  // Append loader to main container
  container.innerHTML = Loader();
  // Start Fetching
  fetch(`/films`)
    .then(request=>request.json())
    .then(response=>{
      localStorage.totalFilms = response.length;
      localStorage.dataFilms  = JSON.stringify(response);
      container.innerHTML = ''
      response.map((film,i)=>{
        film.index = i;
        let card = new FilmCard(film);
        container.append(card.html)
      });
    })
}
function searching(state={}){ // looking for certain film at '/search' route
  let searchInput = document.getElementById('search');
  if(state.renderElement){ searchInput.style.display = 'flex'; }
  if(searchInput.value){ // check input value is not empty
    let body = {};
    body.query = searchInput.value;
    let container = document.getElementById('container')
    container.innerHTML = Loader();
    fetch(`/films`,{ method:'post', headers:{'content-type':'application/json'},body:JSON.stringify(body)})
      .then(request=>request.json())
      .then(response=>{
        // Chec if we have films or not
        if(response.length !== 0){ 
          container.innerHTML = '';
          searchInput.style.display = 'none';
          localStorage.totalFilms = response.length;
          response.map((film,i)=>{
            film.index = i;
            let card = new FilmCard(film);
            container.append(card.html);
          });
        }else{
          // Append NoThing component to main container
          container.innerHTML = NoThing();
        }
      })
  }
}
function aboutUsRender(){ // Append AboutUs component to main container ar '/about' route
  let container = document.getElementById('container');
  container.innerHTML = AboutUs();
}
function savedRender(){ // Append all stored film to main container ar '/saved' route
  let container = document.getElementById('container');
  let savedFilms = JSON.parse(localStorage.savedFilms);
  savedFilms.map((film,i)=>{
    film.index = i;
    let card = new FilmCard(film);
    container.append(card.html)
  });
}
const cardsPerRow = ()=>{ // Calculate number or films per row within main container
  let minoffsetTop = null;
  let columns = 0;
  // Get all films elements
  Object.values(document.getElementsByClassName('card')).map((card)=>{
    // Base on Top offset for each elements we can count total columns number
    let offsetTop = card.offsetTop;
    if (offsetTop <= minoffsetTop || minoffsetTop==null) {     
      columns++;
      minoffsetTop = offsetTop;
    }
  });
  return columns;
}
function sliderToggle(state='toggle'){ // 
  let slider = document.getElementById('slider');
  if(state === 'toggle'){ state = JSON.parse(localStorage.sliderState)?false:true }
  if(state){
    slider.style.display='flex'
  }else{
    slider.style.display='none'
  }
  localStorage.sliderState = state;
}