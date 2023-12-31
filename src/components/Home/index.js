import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => {
  const token = Cookies.get('jwt_token')
  if (token === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="home-page">
      <Header />
      <div className="homepage-description">
        <h1 className="homepage-heading">Find The Job That Fits Your Life</h1>
        <p className="homepage-para">
          Millions of people are searching for jobs, salary information, company
          views. Find The Job fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="jobs-button" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
