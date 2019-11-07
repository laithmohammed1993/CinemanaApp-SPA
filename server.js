// Nodejs Dependecies
const http              = require('http');
const url               = require('url');
const fs                = require('fs');
const { StringDecoder } = require('string_decoder');
const route             = require('./route/index.js');
const fun               = require('./middleware/functions');
const address           = ['/','/index.html','/search','/home','/saved','/about','/menu']

// Create a server so it can deal with our requestes.
const server = http.createServer((req, res)=>{
  // Geting query from request url, true => query as object , false => query as string
  let parseUrl = url.parse(req.url, true);
  // Get the query and save it in a abject
  let queryObject = parseUrl.query;
  // Knowning what routing the user is calling
  let path = parseUrl.pathname;
  // Getting Methods POST GET PUT DELETE 
  let method = req.method.toLowerCase();
  // Getting the headers , key and value;
  let header = req.headers;
  // Creating new object from String Decoder
  let decoder = new StringDecoder('utf-8');
  // Collector for payload
  let buffer = '';
  // When the request starting send data (payload)
  req.on('data', (data)=>{ buffer += decoder.write(data); });
  // When the request is ended
  req.on('end', ()=>{ // If no have end request, page still loading
    buffer += decoder.end(); 
    // Getting request details
    let data = {
      'method' : method,
      'query'  : queryObject,
      'payload': buffer,
      'header' : header,
    }
    // Ckeck if the path is public or not
    if(!fs.existsSync('public'+path) && address.indexOf(path) === -1){ // Path isn't public
      // Ckeck it is found or not, depend on route object line 6
      let chosenHandler = typeof(route[path]) !== 'undefined' ? route[path] : route.notFound;
      chosenHandler(data, (statusCode, returnedData)=>{ 
        // Set response status
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        // Set returned data to user
        returnedData = typeof returnedData == 'object' ? returnedData : {};
        // Check if returned data is for Rest API or not found
        if(Object.keys(returnedData).length === 0 && typeof returnedData === 'object' && !Array.isArray(returnedData)){ // Not found
          res.setHeader('Content-type','text/html');
          res.writeHeader(200)
          res.write(fs.readFileSync('route/notFound.html'))
          res.end()
        }else{ // Rest API
          res.setHeader('Content-type','application/json');
          res.writeHeader(statusCode)
          res.end(JSON.stringify(returnedData))
        }
      });
    }else{ // It is public path
      // Check client side routing or related files, check line 8
      if(address.indexOf(path) > -1){
        path = 'public/index.html'
      }else { path = 'public'+path }
      // Set Header content-type base on file type
      let contentType = fun.fileContentType(path).contentType;
      res.setHeader('Content-type',contentType);
      // Set response status
      res.writeHeader(200)
      res.write(fs.readFileSync(path))
      res.end()
    }
  });
});
//listen on a PORT
server.listen(process.env.PORT || 3000,()=>{ console.log('App is running !!')});