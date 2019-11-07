const filmsRoute = require('./filmsRoute');
const route = {
  '/films'    : (data, callback)=>filmsRoute(data, callback),
  notFound    : (data, callback)=>{ callback(404) },
};
module.exports = route;