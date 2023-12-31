import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {IoLocationSharp} from 'react-icons/io5'

import {BsBagFill} from 'react-icons/bs'

import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'

import Header from '../Header'

import './index.css'

const ApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: ApiStatusConstants.initial,
    jobItemDetails: [],
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItem()
  }

  getJobItem = async () => {
    this.setState({apiStatus: ApiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const something = data.job_details
      const similarJobs = data.similar_jobs

      const updateSkills = something.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))

      const updateLifeAtCompany = {
        description: something.life_at_company.description,
        imageUrl: something.life_at_company.image_url,
      }

      const updateJobDetails = {
        companyLogoUrl: something.company_logo_url,
        companyWebsiteUrl: something.company_website_url,
        employmentType: something.employment_type,
        id: something.id,
        jobDescription: something.job_description,
        location: something.location,
        packagePerAnnum: something.package_per_annum,
        rating: something.rating,
        title: something.title,
      }

      const updateSimilarJobs = similarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      const totalData = [updateJobDetails, updateLifeAtCompany, updateSkills]
      this.setState({
        similarJobs: updateSimilarJobs,
        jobItemDetails: totalData,
        apiStatus: ApiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: ApiStatusConstants.failure})
    }
  }

  successView = () => {
    const {jobItemDetails, similarJobs} = this.state
    console.log(jobItemDetails)
    const updateJobDetails = jobItemDetails[0]
    const updateLifeAtCompany = jobItemDetails[1]
    const updateSkills = jobItemDetails[2]

    return (
      <div>
        <div className="item-background">
          <div className="title-and-icon">
            <img
              className="success-icon"
              src={updateJobDetails.companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="jobs-title">{updateJobDetails.title}</h1>
              <div className="rating-container">
                <FaStar className="star" />
                <p className="rating">{updateJobDetails.rating}</p>
              </div>
            </div>
          </div>

          <div className="location-and-emp-container">
            <div className="loca-emp-dis">
              <div className="location-container">
                <IoLocationSharp className="location-icon" />
                <p className="p">{updateJobDetails.location}</p>
              </div>
              <div className="emp-type">
                <BsBagFill className="emp-icon" />
                <p className="p">{updateJobDetails.employmentType}</p>
              </div>
            </div>
            <p>{updateJobDetails.packagePerAnnum}</p>
          </div>

          <hr />
          <div className="description-container">
            <div className="dis-container">
              <h1 className="description">Description</h1>
              <a
                className="web-url-link"
                href={updateJobDetails.companyWebsiteUrl}
              >
                <p>Visit</p>
                <FaExternalLinkAlt className="link-icon" />
              </a>
            </div>
            <p>{updateJobDetails.jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-list-container">
              {updateSkills.map(each => (
                <li className="skill-item" key={each.name}>
                  <img
                    className="skill-logo"
                    src={each.imageUrl}
                    alt={each.name}
                  />
                  <p className="skill-name">{each.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company">
            <h1 className="life-at-company-heading">Life At Company</h1>
            <div className="list-description-container">
              <p>{updateLifeAtCompany.description}</p>
              <img
                className="life-at-company-image"
                src={updateLifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list-container">
            {similarJobs.map(each => (
              <li key={each.id} className="similar-jobs-container-item">
                <div className="title-and-icon">
                  <img
                    className="success-icon"
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                  />
                  <div>
                    <h1 className="jobs-title">{each.title}</h1>
                    <div className="rating-container">
                      <FaStar className="star" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="description-container">
                  <h1 className="description">Description</h1>

                  <p>{each.jobDescription}</p>
                </div>

                <div className="location-and-emp-container">
                  <div className="loca-emp-dis">
                    <div className="location-container">
                      <IoLocationSharp className="location-icon" />
                      <p className="p">{each.location}</p>
                    </div>

                    <div className="emp-type">
                      <BsBagFill className="emp-icon" />
                      <p className="p">{each.employmentType}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  failureButtonClick = () => this.getJobItem()

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.failureButtonClick} type="button">
        Retry
      </button>
    </div>
  )

  ItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case ApiStatusConstants.success:
        return this.successView()
      case ApiStatusConstants.failure:
        return this.failureView()
      case ApiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )

      default:
        return null
    }
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div>
        <Header />
        <div className="item-details-view">{this.ItemDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
