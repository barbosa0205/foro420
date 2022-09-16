import App from 'next/app'
import { SessionProvider } from 'next-auth/react'
import UserProvider from 'contexts/UserProvider'
import Layout from 'components/Layout'
import 'tailwindcss/tailwind.css'
import 'styles/globals.css'
import SocketProvider from 'contexts/socket/SocketProvider'
import MessageProvider from 'contexts/messages/MessageProvider'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <SocketProvider>
          <MessageProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MessageProvider>
        </SocketProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default MyApp
