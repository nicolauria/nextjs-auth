import App from 'next/app'
import '../styles/globals.css'
import { parseCookies } from 'nookies'
import { redirectUser } from '../utils/auth'
import jwt from 'jsonwebtoken'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx)
    
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    if (!token) {
      const isProtectedRoute = ctx.pathname === '/account'
      if (isProtectedRoute) {
        redirectUser(ctx, '/login')
      }
    } else if (ctx.pathname !== "/login") {
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
      } catch(err) {
        console.error(err)
        redirectUser(ctx, '/login')
      }
    }
    
    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Component {...pageProps} />
    )
  }
}

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

export default MyApp
