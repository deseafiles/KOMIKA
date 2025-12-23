import db from '@adonisjs/lucid/services/db';
import scheduler from 'adonisjs-scheduler/services/main'

scheduler.command("inspire").everyFiveSeconds();

scheduler.call(async () => {
  await db.rawQuery(`
    DELETE FROM email_verifications
    WHERE expired_at < now()
  `)
}).everyTwoMinutes();
