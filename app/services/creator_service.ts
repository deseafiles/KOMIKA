import User from '#models/user'

export class CreatorService {
  static async createCreatorIfNotExist(user: User) {
    const existCreator = await user.related('creator').query().first()

    if (!existCreator) {
      const creator = await user.related('creator').create({
        totalEarning: 0,
        withdrawnBalance: 0,
      })
      return creator
    }
    return existCreator
  }
}

