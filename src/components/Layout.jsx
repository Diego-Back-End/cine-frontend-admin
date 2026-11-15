import Footer from './Footer'
import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
