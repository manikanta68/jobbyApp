import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoLocationSharp} from 'react-icons/io5'

import {BsBagFill, BsSearch} from 'react-icons/bs'

import {FaStar} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jobsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileApi: profileApiStatusConstants.initial,
    profile: '',
    jobsList: [],
    employmentType: '',
    minimumPackage: '',
    search: '',
    jobsApi: jobsApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({profileApi: profileApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profile: updatedData,
        profileApi: profileApiStatusConstants.success,
      })
    } else {
      this.setState({profileApi: profileApiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApi: jobsApiStatusConstants.inProgress})
    const {employmentType, minimumPackage, search} = this.state
    const jwtToken = Cookies.get('jwtToken')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${search}`
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const {jobs} = data
      console.log(jobs)
      if (jobs.length !== 0) {
        const newData = jobs.map(newOne => ({
          companyLogoUrl: newOne.company_logo_url,
          employmentType: newOne.employment_type,
          id: newOne.id,
          jobDescription: newOne.job_description,
          location: newOne.location,
          packagePerAnnum: newOne.package_per_annum,
          rating: newOne.rating,
          title: newOne.title,
        }))
        this.setState({
          jobsList: newData,
          jobsApi: jobsApiStatusConstants.success,
        })
      } else {
        this.setState({
          jobsList: [],
          jobsApi: jobsApiStatusConstants.success,
        })
      }
    } else {
      this.setState({jobsApi: jobsApiStatusConstants.failure})
    }
  }

  onInputChange = event => {
    console.log('calling...')
    this.setState({search: event.target.value})
  }

  onInputClick = () => {
    const {search} = this.state
    this.setState({search}, this.getJobs)
  }

  renderInputContainer = () => {
    const {search} = this.state
    return (
      <div className="input-container">
        <input
          className="search-input-box"
          id="search"
          onChange={this.onInputChange}
          placeholder="Search"
          type="search"
          value={search}
        />
        <label className="search-icon1" htmlFor="search">
          <button
            onClick={this.onInputClick}
            className="search-icon-button"
            type="button"
            data-testid="searchButton"
          >
            {}
            <BsSearch className="search-icon" />
          </button>
        </label>
      </div>
    )
  }

  profileRetryButton = () => {
    this.getProfile()
  }

  profileView = () => {
    const {profile, profileApi} = this.state
    const {name, profileImageUrl, shortBio} = profile
    switch (profileApi) {
      case profileApiStatusConstants.success:
        return (
          <div className="profile-view-container">
            <img
              className="profile-image"
              src={profileImageUrl}
              alt="profile"
            />
            <h1 className="profile-heading">{name}</h1>
            <p className="profile-bio">{shortBio}</p>
          </div>
        )
      case profileApiStatusConstants.failure:
        return (
          <button onClick={this.profileRetryButton} type="button">
            Retry
          </button>
        )
      case profileApiStatusConstants.inProgress:
        return (
          <div data-testid="loader" className="products-loader-container">
            <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
          </div>
        )

      default:
        return null
    }
  }

  onTypeChange = event => {
    console.log(event.target.value)
    this.setState({employmentType: event.target.value}, this.getJobs)
  }

  salaryRange = event => {
    console.log(event.target.value)
    this.setState({minimumPackage: event.target.value}, this.getJobs)
  }

  profileAndFiltersView = () => (
    <div className="profile-and-filter-container">
      <div className="profile-container">{this.profileView()}</div>
      <hr />
      <div className="typeFilter-container">
        <h1 className="employment-heading">Type of Employment</h1>
        <ul className="types-list">
          {employmentTypesList.map(each => (
            <li className="bca" key={each.employmentTypeId}>
              <input
                onChange={this.onTypeChange}
                value={each.employmentTypeId}
                id="typeCheck"
                className="typeInputCheckBox "
                type="checkbox"
              />
              <label htmlFor="typeCheck">{each.label}</label>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div className="salaryFilter-container">
        <h1 className="salary-heading">Salary Range</h1>
        <ul className="types-list">
          {salaryRangesList.map(salary => (
            <li className="bca" key={salary.salaryRangeId}>
              <input
                value={salary.salaryRangeId}
                onChange={this.salaryRange}
                id="salaryCheck"
                className="typeInputCheckBox"
                type="radio"
              />
              <label htmlFor="typeCheck">{salary.label}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  jobsRetry = () => {
    this.getJobs()
  }

  jobsView = () => {
    const {jobsList, jobsApi} = this.state
    switch (jobsApi) {
      case jobsApiStatusConstants.success:
        console.log('ok')
        console.log(jobsList.length)
        if (jobsList.length !== 0) {
          return (
            <div className="success-card">
              <ul className="success-list-container">
                {jobsList.map(item => (
                  <li className="jobList-item" key={item.id}>
                    <Link className="link-style" to={`/jobs/${item.id}`}>
                      <div className="pls">
                        <div className="title-and-icon">
                          <img
                            className="success-icon"
                            src={item.companyLogoUrl}
                            alt="company logo"
                          />
                          <div>
                            <h1 className="jobs-title">{item.title}</h1>
                            <div className="rating-container">
                              <FaStar className="star" />
                              <p className="rating">{item.rating}</p>
                            </div>
                          </div>
                        </div>

                        <div className="location-and-emp-container">
                          <div className="loca-emp-dis">
                            <div className="location-container">
                              <IoLocationSharp className="location-icon" />
                              <p className="p">{item.location}</p>
                            </div>
                            <div className="emp-type">
                              <BsBagFill className="emp-icon" />
                              <p className="p">{item.employmentType}</p>
                            </div>
                          </div>
                          <p>{item.packagePerAnnum}</p>
                        </div>

                        <hr />
                        <div className="description-container">
                          <h1 className="description">Description</h1>
                          <p>{item.jobDescription}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        return (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        )

      case jobsApiStatusConstants.failure:
        console.log('fail')
        return (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops something went Wrong</h1>
            <p>we cannot seem to find the page you are looking for.</p>
            <button onClick={this.jobsRetry} type="button">
              Retry
            </button>
          </div>
        )
      case jobsApiStatusConstants.inProgress:
        return (
          <div data-testid="loader" className="products-loader-container">
            <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
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
      <div className="jobs-page">
        <Header />
        <div className="jobsPage-mobile-view">
          <div>
            <div>{this.renderInputContainer()}</div>
          </div>
          <div>{this.profileAndFiltersView()}</div>
        </div>
        <div className="jobsPage-desktop-view">
          <div className="filters">{this.profileAndFiltersView()}</div>
          <div className="input-and-jobs-view">
            <div>{this.renderInputContainer()}</div>
            <div>{this.jobsView()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
