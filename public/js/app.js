// set variables & functions
// const domain = 'http://localhost:3000';
// const domain = 'https://cinemana-spa.herokuapp.com';
// 2019-11-08T09:56:57.277338+00:00 
localStorage.removeItem('cardIndex')
localStorage.totalFilms = 0; 
localStorage.sliderState = false
if(!localStorage.savedFilms){ localStorage.savedFilms = "[]"; }
// Add listener when page is load
window.addEventListener('load',(e)=>{
  // Routing
  routing()
  // Listener over any key pressed
  document.onkeydown = arrowNavigation;
  // Footer
  document.body.append(new Footer().html);
})
function routing(){ // Navigator for this app
  let path = window.location.pathname;
  switch (path) {
    case '/'            : getData();break;
    case '/index.html'  : getData();break;
    case '/home'        : getData();break;
    case '/menu'        : menuRender();break;
    case '/search'      : searching();break;
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
    // Get total films that we have
    let totalFilms = Object.keys(document.getElementsByClassName('card')).length;
    if(totalFilms > 0){
      // Calculate how many Cards per row into main container
      let cardsRow = cardsPerRow(); 
      // Get max index to hold movement to Down
      let maxIndex = totalFilms-1;
      let oldCardIndex = parseInt(localStorage.getItem('cardIndex'));
      let newCardIndex;
      if(oldCardIndex || oldCardIndex === 0){
        if(ArrowKeys.left  === e.keyCode){ newCardIndex = oldCardIndex-1          < 0        ? maxIndex     : oldCardIndex-1 }
        if(ArrowKeys.up    === e.keyCode){ newCardIndex = oldCardIndex - cardsRow < 0        ? oldCardIndex : oldCardIndex - cardsRow }
        if(ArrowKeys.right === e.keyCode){ newCardIndex = oldCardIndex+1          > maxIndex ? 0            : oldCardIndex+1 }
        if(ArrowKeys.down  === e.keyCode){ newCardIndex = oldCardIndex + cardsRow > maxIndex ? oldCardIndex : oldCardIndex + cardsRow }
      }else{
        oldCardIndex = null;
        newCardIndex = 0;
      }
      if(oldCardIndex !== newCardIndex){
        localStorage.setItem('cardIndex',newCardIndex);
        if(oldCardIndex !== null){ document.getElementById('card'+oldCardIndex).style.border = '2px solid #464646'; }
        let newCard = document.getElementById('card'+newCardIndex);
        newCard.style.border = '2px solid #4285F4';
        newCard.scrollIntoView({block:'center'})
        cardHover(oldCardIndex,newCardIndex)
      }
    }
  }
}
function cardHover(oldIndex,newIndex){
  let animated  = (index)=>[`card-img _${index} card-img-animated`, `card-imgback _${index} card-imgback-animated`, 
                      `card-script _${index} card-script-animated`, `card-overview _${index} card-overview-animated`, 
                      `card-details card-vote _${index} card-vote-animated`, `card-details card-release _${index} card-release-animated`, 
                      `card-details card-lang _${index} card-lang-animated`
                      ]
  let unanimated    = (index)=>[`card-img _${index}`, `card-imgback _${index}`, `card-script _${index}`, 
                      `card-overview _${index}`, `card-details card-vote _${index}`, 
                      `card-details card-release _${index}`, `card-details card-lang _${index}`
                      ];
  animated(oldIndex).map((Class,i)=>{ 
    if(document.getElementsByClassName(Class).length > 0){ 
      document.getElementsByClassName(Class)[0].className = unanimated(oldIndex)[i]; 
    } 
  }); 
  unanimated(newIndex).map((Class,i)=>{
      document.getElementsByClassName(Class)[0].className = animated(newIndex)[i]; 
  }); 
}
function getData(){ // Get all films from server side
  let container = document.getElementById('container')
  // Append loader to main container
  container.append(Loader());
  // Start Fetching
  fetch(`/films`)
    .then(request=>request.json())
    .then(response=>{
      localStorage.totalFilms = response.length;
      localStorage.dataFilms  = JSON.stringify(response);
      document.getElementById('Loader').remove();
      response.sort((a,b)=>{ return 0.5 - Math.random() })
      container.innerHTML = ''
      response.map((film,i)=>{
        film.index = i;
        let card = new FilmCard(film);
        container.append(card.html)
      });
    })
}
function searching(query){ // looking for certain film at '/search' route
  let container = document.getElementById('container');
  if(!document.getElementById('search')){ container.append(SearchInput()) }
  if(query){ // check input value is not empty
    let body = {};
    body.query = query;
    if(document.getElementById('Nothing')){ document.getElementById('Nothing').remove() };
    Object.values(container.getElementsByClassName('card')).map(element=>element.remove());
    if(!document.getElementById('Loader')){ container.append(Loader()); }
    fetch(`/films`,{ method:'post', headers:{'content-type':'application/json'},body:JSON.stringify(body)})
      .then(request=>request.json())
      .then(response=>{
        document.getElementById('Loader').remove();
        // Chec if we have films or not
        if(response.length !== 0){ 
          localStorage.totalFilms = response.length;
          response.map((film,i)=>{
            film.index = i;
            let card = new FilmCard(film);
            container.append(card.html);
          });
        }else{
          // Append NoThing component to main container
          container.append(NoThing());
        }
      })
  }
}
function aboutUsRender(){ // Append AboutUs component to main container ar '/about' route
  let container = document.getElementById('container');
  container.innerHTML = AboutUs();
}
function menuRender(sortCardBy,sortType){
  let container = document.getElementById('container');
  container.append(Loader());
  Object.values(container.getElementsByClassName('card')).map(element=>element.remove());
  if(!sortCardBy){ container.insertBefore(new SortInput().html, container.firstChild);sortCardBy='vote_average'; }
  if(!sortType){ sortType = Object.values(document.getElementsByName('sortType')).find(e=>e.checked==true).value }
  fetch('/films')
    .then(request=>request.json())
    .then(response=>{
      document.getElementById('Loader').remove();
      if(response.length > 0){
        response.sort((a,b)=>{ 
          let pair1 = sortType=='asc'?a[sortCardBy]:b[sortCardBy];
          let pair2 = sortType=='asc'?b[sortCardBy]:a[sortCardBy];
            if ( pair1.toString().toLowerCase() < pair2.toString().toLowerCase() ){ return -1; }
            if ( pair2.toString().toLowerCase() > pair1.toString().toLowerCase() ){ return 1;  }
            return 0;
        }).map((film,i)=>{
          film.index = i;
          // console.log(film[sortCardBy])
          let card = new FilmCard(film);
          container.append(card.html);
        });
      }else{
        container.append(NoThing())
      }
    })
}
function savedRender(){ // Append all stored film to main container ar '/saved' route
  let container = document.getElementById('container');
  let savedFilms = JSON.parse(localStorage.savedFilms);
  if(savedFilms.length > 0){
    savedFilms.map((film,i)=>{
      film.index = i;
      let card = new FilmCard(film);
      container.append(card.html)
    });
  }else{
    container.append(NoThing());
  }
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