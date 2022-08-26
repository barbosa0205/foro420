export default async function handler(req, res) {
  const { body, query, method } = req
  switch (method) {
    case 'PUT':
      try {
        if (query.method === 'markAsRead') {
        }
      } catch (error) {}
      break

    default:
      break
  }
}
