/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import LoginController from '#controllers/auth/login_controller'
import RegisterController from '#controllers/auth/register_controller'
import ComicsController from '#controllers/comics_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import HomeController from '#controllers/home_controller'
import LogoutController from '#controllers/auth/logout_controller'

router.get('/', [HomeController, 'index']).as('home')

router.get('comic/coverUrl/:fileName', [ComicsController, 'showCoverImage']).use(middleware.auth())

router.group(() => {
  router.get('/register', [RegisterController, 'index'])
  router.post('/register', [RegisterController, 'store'])
  router.get('/login', [LoginController, 'index'])
  router.post('/login', [LoginController, 'store'])
  router.post('/logout', [LogoutController, 'handle']).use(middleware.auth())
})

router
  .group(() => {
    router.get('/index', [ComicsController, 'index'])
    router.post('/create', [ComicsController, 'create']).use(middleware.auth())
    router.post('/store', [ComicsController, 'store']).use(middleware.auth())
  })
  .prefix('/comic')
