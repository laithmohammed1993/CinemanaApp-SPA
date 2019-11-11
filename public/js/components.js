const Loader = ()=>{
  let Img = document.createElement('img');
  Img.className = 'loader-gif';
  Img.alt = 'loader';
  Img.src = 'assets/icons/loader.gif';
  let Div = document.createElement('div');
  Div.className = 'loader'
  Div.id = 'Loader';
  Div.append(Img)
  return Div;
}

const NoThing = ()=>{
    let Header = document.createElement('h1');
    Header.innerText = 'No Thing';
    Header.className = 'nothing-component';
    Header.id = 'Nothing'
    return Header
}

const FilmCard = class {
  constructor (props){
    this.id           = props.id;
    this.poster       = "http://image.tmdb.org/t/p/w500"+props.poster_path;
    this.title        = props.title;
    this.releaseDate  = props.release_date;
    this.voteAverage  = props.vote_average;
    this.language     = props.original_language;
    this.overview     = props.overview
    this.index        = props.index;
    this.divCard      = document.createElement('div');
    this.imgPoster    = document.createElement('img');
    this.imgBack      = document.createElement('img');
    this.divChild1    = document.createElement('div');
    this.divScript    = document.createElement('div');
    this.h3           = document.createElement('h3');
    this.pOverview    = document.createElement('p')
    this.imgLabel     = document.createElement('img');
    this.pDate        = document.createElement('p');
    this.pVote        = document.createElement('p');
    this.divLang      = document.createElement('div');
  }
  // set props
  get html(){
    // Main div
    let Card          = this.divCard;
    Card.className    = 'card';
    Card.id           = 'card'+this.index;
    Card.onclick      = ()=>this.onClickCard();
    // Poster Image
    let Img           = this.imgPoster;
    Img.src           = this.poster;
    Img.alt           = this.title;
    Img.title         = this.title;
    Img.className     = `card-img _${this.index}`;
    let ImgBack       = this.imgBack;
    ImgBack.src       = this.poster;
    ImgBack.className = `card-imgback _${this.index}`;
    // Sub-div1
    let Cover         = this.divChild1;
    Cover.className   = 'card-sub';
    // Title & Overview
    let Script        = this.divScript
    Script.className  = `card-script _${this.index}`
    let Title         = this.h3
    Title.className   = 'card-title';
    Title.innerText   = this.title;
    let Overview      = this.pOverview;
    Overview.className= `card-overview _${this.index}`;
    Overview.innerText= this.overview;
    // Save Label
    let Label         = this.imgLabel;
    let isSaved       = getObjectInArray(JSON.parse(localStorage.savedFilms),{id:this.id});
    Label.src         = Object.keys(isSaved).length > 0 ? 'assets/icons/label-green.png':'assets/icons/label-white.png';
    Label.alt         = `label${this.index}`;
    Label.id          = `label${this.id}`;
    Label.className   = 'card-label';
    Label.onclick     = ()=>this.onClickLabel();
    // ReleaseDate & Vote
    let Vote          = this.pVote;
    Vote.innerText    = `${this.voteAverage}⭐`;
    Vote.className    = `card-details card-vote _${this.index}`;
    let ReleaseDate   = this.pDate;
    ReleaseDate.innerText = this.releaseDate.substring(0,4);
    ReleaseDate.className = `card-details card-release _${this.index}`;
    let Language       = this.divLang;
    Language.className = `card-details card-lang _${this.index}`;
    Language.innerText = this.language;
    // Nesting
    Script.append(Title)
    Script.append(Overview)
    Cover.append(Label);
    Cover.append(Language)
    Cover.append(ReleaseDate);
    Cover.append(Vote);
    Cover.append(Script);
    Card.append(Img);
    Card.append(ImgBack)
    Card.append(Cover);
    /*
    <Card>
      <Img></Img>
      <ImgBack></ImgBack>
      <Cover>
        <Title></Title>        
        <Label></Label>
        <Language></Language>
        <ReleaseDate></ReleaseDate>
        <Vote></Vote>         
      </Cover>     
    </Card>
    */
    return Card
  }
  onClickCard = ()=>{ // Focus on the card at the time of clicking
    let oldCardIndex = parseInt(localStorage.getItem('cardIndex'));
    let newCardIndex = this.index;
    localStorage.cardIndex = newCardIndex
    document.getElementById('card'+oldCardIndex).style.border = '2px solid #464646';
    this.divCard.style.border = '2px solid #4285F4';
  }
  onClickLabel = ()=>{
    let ID = parseInt(this.id);
    let filmObject = JSON.parse(localStorage.dataFilms).find(film=>film.id==ID)
    let savedFilms = JSON.parse(localStorage.getItem('savedFilms'));
    let isExist = getObjectInArray(savedFilms,{id:ID});
    if(Object.keys(isExist).length != 0){
      let modifiedArray = removeObjectInArray(savedFilms,{id:ID});
      localStorage.savedFilms = JSON.stringify(modifiedArray);
      if(window.location.pathname === '/saved'){
        this.divCard.onclick = ()=>{}
        this.divCard.remove()
      }else{
        this.imgLabel.src = 'assets/icons/label-white.png';
      }
    }else{
      savedFilms.push(filmObject);
      localStorage.savedFilms = JSON.stringify(savedFilms)
      this.imgLabel.src = 'assets/icons/label-green.png';
    }  
  }
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

const Footer = class{
  constructor(){
    this.data = {
      INFORMATION : [
        { name : 'Resourse', url : '#' },
        { name : 'Blogs', url : '#' },
        { name : 'Plans', url : '#' },
        { name : 'Jobs', url : '#' },
        { name : 'About us', url : '/about' },
      ],
      LEGAL : [
        { name : 'Terms & Conditions', url : '#' },
        { name : 'License Agreement', url : '#' },
        { name : 'Privacy policy', url : '#' },
        { name : 'Terms & Conditions', url : '#' },
      ],
      'SOCIAL MEDIA' : [
        { name : 'Fasebook', url : '#' },
        { name : 'Twitter', url : '#' },
        { name : 'Instagram', url : '#' },
        { name : 'Youtube', url : '#' },
      ],
      HELP : [
        { name : 'Support', url : '#' },
        { name : 'Contact', url : '#' },
      ]
    };
  }
  get html(){
    // Footer
    let Footer = document.createElement('div');
    Footer.className = 'footer'
    Object.keys(this.data).map(key=>{
      // Box
      let Box      = document.createElement('div');
      Box.className= 'footer-box';
      // Header
      let Header   = document.createElement('h2');
      Header.className = 'footer-header';
      Header.innerText = key;
      Box.append(Header);
      this.data[key].map(item=>{
        // Paragraph
        let Paragraph = document.createElement('p');
        Paragraph.className = 'footer-para';
        Paragraph.innerText = item.name;
        let Link = document.createElement('a');
        Link.href = item.url;
        Link.className = 'footer-link';
        Link.append(Paragraph);
        Box.append(Link);
      })
      Footer.append(Box);
    });
    let RightCopy = document.createElement('p');
    RightCopy.className = 'footer-rightcopy';
    RightCopy.innerText = 'Copyright © 2019'
    Footer.append(RightCopy);
    return Footer
  }
}
let SortInput = class{
  constructor(props){
    this.list = {
      "vote_average":"Vote",
      "title":"Title",
      "vote_count":"Most Popular",
      "release_date":"Release Date",
    }
  }
  get html(){
    // Container
    let Container = document.createElement('div');
    Container.className = 'selector-box'
    let Div = document.createElement('div');
    Div.className = 'selector-div';
    // Selector
    let Selector = document.createElement('select');
    Selector.className = 'selector';
    Selector.onchange = (e)=>menuRender(e.target.value,undefined)
    // Options
    Object.keys(this.list).map((key,i)=>{
      let Option = document.createElement('option');
      Option.className = 'selector-option';
      Option.value = key;
      Option.innerText = this.list[key];
      Selector.append(Option);
    });
    let RadioInput = (name,value,title,index,checked)=>{
      let radio = document.createElement('input');
      radio.name = name;
      radio.type = 'radio';
      radio.className = 'selector-sort-radio'
      radio.value = value;
      radio.id = name+index;
      radio.checked = checked;
      radio.onclick = (e)=>menuRender(document.getElementsByClassName('selector')[0].value,e.target.value)
      let label = document.createElement('label');
      label.className = 'selector-sort-span'
      label.innerText = title;
      label.htmlFor = name+index;
      return [radio,label]
    }
    // Check radio
    let CheckASC = RadioInput('sortType','asc','Ascending','0',true);
    let CheckDESC = RadioInput('sortType','desc','Descending','1',false);
    let SortTypeDiv = document.createElement('div');
    SortTypeDiv.className = 'selector-div-radio'
    SortTypeDiv.append(CheckASC[0])
    SortTypeDiv.append(CheckASC[1])
    SortTypeDiv.append(CheckDESC[0])
    SortTypeDiv.append(CheckDESC[1])
    // Tilte
    let Title = document.createElement('p');
    Title.innerText = 'Sorted by :';
    Title.className = 'selector-title';
    Div.append(Selector)
    Div.append(Title)
    Div.append(SortTypeDiv)
    Container.append(Div);
    return Container
  }
}
const SearchInput = ()=>{
  let SearchDiv = document.createElement('div');
  SearchDiv.className = 'search';
  let SearchTextInput = document.createElement('input');
  SearchTextInput.type = 'search';
  SearchTextInput.placeholder = 'search ...';
  SearchTextInput.onchange = (e)=>searching(e.target.value)
  SearchTextInput.className = 'search-input';
  SearchTextInput.id = 'search';
  SearchDiv.append(SearchTextInput);
  return SearchDiv
}