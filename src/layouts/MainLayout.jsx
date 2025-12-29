import PropTypes from 'prop-types'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import './MainLayout.css'

const MainLayout = ({ children, showFooter = true }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout__content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showFooter: PropTypes.bool
}

export default MainLayout
