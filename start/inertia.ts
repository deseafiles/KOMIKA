import { middleware } from '@adonisjs/inertia/middleware'

export default middleware.share({
  auth: async ({ auth }) => {
    try {
      await auth.check()
      return {
        isLoggedIn: auth.isAuthenticated,
        user: auth.user
          ? {
              id: auth.user.id,
              email: auth.user.email,
              username: auth.user.username,
            }
          : null,
      }
    } catch {
      return { isLoggedIn: false, user: null }
    }
  },
})

