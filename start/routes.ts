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

router.get('/', [HomeController, 'index']).as('home')

router.get('comic/coverUrl/:fileName', [ComicsController, 'showCoverImage']).use(middleware.auth())

router.get('/register', [RegisterController, 'index'])
router.post('/register', [RegisterController, 'store'])

router.get('/login', [LoginController, 'index'])
router.post('/login', [LoginController, 'store'])

router
  .post('logout', async ({ auth, response }) => {
    await auth.use('web').logout()
    return response.redirect('/login')
  })
  .use(middleware.auth())

router.get('test/comic/index', [ComicsController, 'index'])
router.post('/test/comic/create', [ComicsController, 'create'])
router.post('/test/comic/store', [ComicsController, 'store']).use(middleware.auth())
