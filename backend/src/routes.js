const {Router} = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');
const routes = Router();


/*1º param = nav url; Como, no momento, quer localhost:3333/ temos '/'
  2º param = função como arrow fn do js            
  Métodos HTTP : GET, POST, PUT, DELETE        */

/*Tipos de parâmetros:
Query: req.query(filtros, ordenação, paginação,...)
Route: req.params(Identificar recurso por ID)
Body : req.body(Dados para criação ou alteração de um registro)
*/
//async & await allow the code to be run after response from API

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

module.exports = routes;