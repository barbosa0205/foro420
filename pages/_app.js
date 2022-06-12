import App from 'next/app'
import { SessionProvider } from 'next-auth/react'
import UserProvider from '../contexts/UserProvider'
import Layout from '../components/Layout'
import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  )
}

export default MyApp
