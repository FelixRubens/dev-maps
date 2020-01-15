const { Router } = require('express');
const Dev_controller = require('./controllers/Dev_controller')
const Search_controller = require('./controllers/Search_controller')


const routes = Router();

routes.post('/devs', Dev_controller.store)
routes.get('/devs', Dev_controller.index)

routes.get('/search', Search_controller.index)

module.exports = routes;