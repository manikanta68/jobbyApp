import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsBagFill} from 'react-icons/bs'

import './index.css'

const Header = props => {
  const logoutClick = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar">
      <Link to="/">
        <img
          className="navbar-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>

      <ul className="navbar-icons-container">
        <Link to="/">
          <li className="nav-icon">
            <AiFillHome className="icon" />
          </li>
        </Link>
        <Link to="/jobs">
          <li className="nav-icon">
            <BsBagFill className="icon" />
          </li>
        </Link>
        <Link to="/">
          <li className="nav-icon">
            <FiLogOut className="icon" />
          </li>
        </Link>
      </ul>
      <ul className="nav-desktop-items">
        <Link to="/">
          <li className="nav-icon">Home</li>
        </Link>
        <Link to="/jobs">
          <li className="nav-icon">Jobs</li>
        </Link>
      </ul>
      <button onClick={logoutClick} className="nav-logout-button" type="button">
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
