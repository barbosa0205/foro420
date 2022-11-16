import UserSchema from 'models/F420User'
import PostSchema from 'models/Post'
import NotificationSchema from 'models/Notification'
import { notificationIcons } from 'helpers/icons'
export default async function handler(req, res) {
  const { method, query, body } = req

  switch (method) {
    case 'GET':
      try {
        const user = await UserSchema.findOne({
          _id: query.uid,
        }).populate('notifications')
        if (user?.notifications.length) {
          const notificationsPromise = user.notifications.map(
            async (notify) =>
              await NotificationSchema.findOne({
                _id: notify._id,
              }).populate('from')
          )
          const notifications = await Promise.all(notificationsPromise)
          console.log('notifications', notifications)
          if (query.getnotifications === 'pendients') {
            const notificationsPendients = notifications.filter(
              (notify) => !notify.notifyWatched
            )

            res.status(200).json({
              success: true,
              notificationsPendients,
            })
          } else if (query.getnotifications === 'all') {
            const allNotifications = notifications.slice(0, 11)
            if (!allNotifications.length) {
              res.status(200).json({
                success: true,
                message: 'no notifications',
              })
            }
            res.status(200).json({
              success: true,
              notifications: allNotifications,
            })
          }
        } else {
          res.status(200).json({
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
    case 'POST':
      try {
        if (query.type === 'comment') {
          const post = await PostSchema.findOne({
            _id: query.post,
          }).populate('postedBy')
          const user = post.postedBy
          if (query.emisor === String(user._id)) {
            return
          }
          const emisor = await UserSchema.findOne({
            _id: query.emisor,
          })
          const notification = new NotificationSchema({
            from: query.emisor,
            post: post._id,
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
          res.status(200).json({
            success: true,
            message: 'notification saved successfully',
            data: {
              emisor,
              notification: 'Comento tu publicación',
              icon: notificationIcons.comment,
            },
            socket: user.socket,
          })
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'algo salio mal al enviar notificacion',
        })
      }
      break
    case 'PUT':
      try {
        if (query.method === 'markAsNotifyWatched') {
          const notifyNotWatched = await NotificationSchema.find({
            notifyWatched: false,
          })

          const notifyIds = notifyNotWatched.map((notify) => notify._id)

          await NotificationSchema.update(
            {
              _id: {
                $in: notifyIds,
              },
            },
            {
              notifyWatched: true,
            }
          )
          res.status(200).json({
            success: true,
            message: 'notifyWatched updated successfully',
          })
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'algo salio mal al cambiar notifyWatched',
        })
      }
  }
}
