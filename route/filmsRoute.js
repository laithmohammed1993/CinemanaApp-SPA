// Seprate Database to easy get through or any future modification
const DataBase = require('../middleware/database.js');

module.exports = function(data, callback){
  // Methods are accepted by this route
  let methods = ['get','post'];
  if(methods.indexOf(data.method) > -1){
    if(data.method === 'get'){ // to get all films
      callback(200,DataBase.getItems('films',{}))
    }
    if(data.method === 'post'){ // searching in certain film
      try {
        let payload = JSON.parse(data.payload);
        if(typeof payload.query === 'string'){
          callback(200,DataBase.getItems('films',{query:payload.query}))
        }
      } catch (err) { callback(200,{error:err.message}) }
    }
  }else{
      callback(400);
  }
}