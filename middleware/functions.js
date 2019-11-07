function getObjectsInArray(array,object){
  let option=[];
  if(typeof object != 'object'){ throw Error('getObjectsInArray object is not object');  }
  if(!Array.isArray(array)){ throw Error('getObjectsInArray array is not array') }
  if(!Array.isArray(object) && typeof object == 'object'){ option.push(object); }
  if(Array.isArray(object)){ option = object; }
  let targetData  = [];
  for(let x in array){
    let currentData = array[x];
    for(let o in option){
      let optionObj   = option[o];
      let optionNum   = 0;
      let optionMatch = 0;
      for(let Key in optionObj){
        if(currentData[Key].toLowerCase() == optionObj[Key].toLowerCase() || currentData[Key].toLowerCase().includes(optionObj[Key].toLowerCase())){ optionMatch++; }
        optionNum++;
      }
      if(optionNum == optionMatch && optionNum != 0 && optionMatch != 0){ targetData.push(currentData); }
    }
  }
  if(Object.keys(object).length == 0){ targetData = array }
  return targetData;
}
module.exports.getObjectsInArray = getObjectsInArray;

function fileContentType(path=''){
  if(path.includes('.css'))  return {contentType : 'text/css' }
  if(path.includes('.js'))   return {contentType : 'application/javascript' }
  if(path.includes('.html')) return {contentType : 'text/html' }
  if(path.includes('.jpg'))  return {contentType : 'image/jpeg' }
  if(path.includes('.png'))  return {contentType : 'image/png' }
  return {contentType : 'text/plain' }
}
module.exports.fileContentType = fileContentType;

// var getdata = (e)=>{
//   let query = document.getElementById('query').value;
//   fetch('https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query='+query)
//     .then(res=>res.json())
//     .then(data=>{
//       document.getElementById('film').innerHTML = '';
//       for(let i in data.results){
//         let film = data.results[i];
//         let img = new Image();
//         img.src = "http://image.tmdb.org/t/p/w500"+film.poster_path;
//         img.alt = film.id;
//         img.title = film.title
//         img.id = '_'+film.id
//         img.onclick = (e)=>{
//           let data = localStorage.getItem('data');
//           data = JSON.parse(data)
//           data.push(film);
//           localStorage.setItem('data',JSON.stringify(data));
//           document.getElementById('_'+film.id).remove();
//         };
//         document.getElementById('film').appendChild(img);
//       }
//     })
// }