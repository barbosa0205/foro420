import App from 'next/app'
import { SessionProvider } from 'next-auth/react'
import UserProvider from 'contexts/UserProvider'
import Layout from 'components/Layout'
import 'tailwindcss/tailwind.css'
import 'styles/globals.css'
import SocketProvider from 'contexts/socket/SocketProvider'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <SocketProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SocketProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default MyApp
