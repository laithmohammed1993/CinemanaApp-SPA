const Loader = ()=>{
  return `
    <div class="loader">
      <img src="assets/icons/loader.gif" alt="loader" class="loader-gif"/>
    </div>
  `
}

const NoThing = ()=>{
  return `
    <h1 class="nothing-component">No Thing</h1>
  `
}

const FilmCard = class {
  constructor (props){
    this.id           = props.id;
    this.poster       = "http://image.tmdb.org/t/p/w500"+props.poster_path;
    this.title        = props.title;
    this.releaseDate  = props.release_date;
    this.voteAverage  = props.vote_average;
    this.index        = props.index;
  }
  get html(){
    let isSaved = getObjectInArray(JSON.parse(localStorage.savedFilms),{id:this.id});
    let label = Object.keys(isSaved).length > 0 ? 'label-green.png':'label-white.png';
    return `
      <div class="card" id="card${this.index}" onclick='onClickCard(this.id)'>
        <img src="${this.poster}" alt="${this.title}" title="${this.title}" class='card-img'>
        <div class="card-sub">
          <div class='card-details'>
            <img src="assets/icons/${label}" alt="label${this.index}" id="label${this.id}" class="card-label" onclick="saveFilm(this.id)"/>
            <p class='card-details-p'>${this.releaseDate.substring(0,4)}</p>
            <p class='card-details-p'>${this.voteAverage}⭐</p>
          </div>
          <h3 class='card-title'>${this.title}</h3>
        </div>
      </div>
    `
  };
};

function AboutUs(){
  return `
    <h1 class="about">About us</h1>
    <h3 class="about">
      Cinemana Group was established in 2001 with the philosophy to create a different and unique movie experience in Turkey by combining 
      technology and comfort with a service approach that is beyond the expectations. Thanks to the services and technological advancements offered, 
      Cinemana Group was rewarded with the "International Movie Theater Group of the Year Award" by the largest movie theater union across the 
      globe, UNIC (International Union of Cinemas) in 2013. It is now the largest movie theater chain in Turkey with approximately 848 movie theaters 
      and 97 cinema enterprises in 36 cities.
    </h3>
    <h3 class="about">
      The company follows the developments in cinema technologies and brings these novelties to Turkish audience before others to offer maximum cinema 
      experience for its guests. With this passion, CGV Mars has become the first cinema chain in Turkey that completed the digital transformation and 
      digitalized all of the imaging and sound systems.
    </h3>
    <h3 class="about">
      As the owner of all of the IMAX movie theaters in Turkey, Cinemana Group brought 4DX technology to Turkish audience in November 2015 and 
      embarked on yet another novelty.Screen X technology was included to Cinemana Group technologies on May 2017.
    </h3>
    <h3 class="about">
      In addition to cinema management activities, Cinemana Group also operates in the cinema advertisement industry with CGV Mars Media and movie 
      distribution industry with CGV Mars Distribution company. 
    </h3>
  `
}

function getObjectInArray(array,option){
  let data = {};
  for(let i in array){
    let object = array[i]
    if(object[Object.keys(option)[0]]==option[Object.keys(option)[0]]){ data = object; }
  }
  return data
}
function removeObjectInArray(array,option){
  let newArray = [];
  for(let i in array){
    let object = array[i]
    if(object[Object.keys(option)[0]]!=option[Object.keys(option)[0]]){ newArray.push(object) }
  }
  return newArray
}