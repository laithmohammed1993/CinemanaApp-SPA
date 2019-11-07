const films = require('../assets/files/movies.json'); // Local Database ;)
const fun   = require('./functions'); // Public functions

module.exports.getItems = (collection,options={})=>{
  if(collection === 'films'){
    if(!options.query){ 
      return fun.getObjectsInArray(films,{}); // Get all objects
    }
    if(options.query && typeof options.query === 'string'){
      return fun.getObjectsInArray(films,{title:options.query}); // Get all films are matched
    }
    return []
  }
}