import Footer from './Footer'
import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <Sidebar>
      <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6">{children}</main>
      <Footer />
    </Sidebar>
  )
}

export default Layout
