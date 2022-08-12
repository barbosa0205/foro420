import UserSchema from 'models/F420User'
import PostSchema from 'models/Post'
import NotificationSchema from 'models/Notification'
import { notificationIcons } from 'helpers/icons'
export default async function handler(req, res) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        })
        if (user?.notifications?.length) {
          const notificationsPendients = user.notifications.filter(
            (notify) => notify.pendientToView
          )
          res.status(200).json({
            success: true,
            notificationsPendients,
          })
        } else {
          res.status(404).json({
            success: false,
            message: 'notifications are not',
          })
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'server internal error',
        })
      }
      break
    case 'PUT':
      try {
        if (query.type === 'comment') {
          const post = await PostSchema.findOne({
            _id: query.post,
          }).populate('postedBy')
          const user = post.postedBy
          const notification = new NotificationSchema({
            from: query.emisor,
            notification: 'Comento tu publicación',
            icon: notificationIcons.comment,
          })

          await notification.save()
          await UserSchema.findOneAndUpdate(
            {
              _id: user._id,
            },
            {
              $push: {
                notifications: notification,
              },
            }
          )
          //TODO: save the notification on db as pendient notificarion
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'algo salio mal al enviar notificacion',
        })
      }
  }
}
