import NotifySchema from 'models/Notification'
export default async function handler(req, res) {
  const { body, query, method } = req
  switch (method) {
    case 'PUT':
      try {
        if (query.method === 'markAsRead') {
          await NotifySchema.updateOne(
            {
              _id: query.id,
            },
            {
              pendientToView: false,
            }
          )

          // const allNotifications = await NotificationSchema.find({})

          res.status(200).json({
            success: true,
            message: 'Notificacion acttualizada como vista',
          })
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: 'Error al actualizar como vista la notificacion' })
      }
      break

    default:
      break
  }
}
