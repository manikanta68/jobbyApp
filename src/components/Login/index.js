import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showSubmitError: false}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onsubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const fetchedResponse = await response.json()
    if (response.ok === true) {
      const jwtToken = fetchedResponse.jwt_token
      this.onSubmitSuccess(jwtToken)
    } else {
      this.onsubmitFailure(fetchedResponse.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, errorMsg, showSubmitError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page">
        <div className="login-popup">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form onSubmit={this.onSubmitForm}>
            <div className="username-input-container">
              <label className="username-label" htmlFor="userName">
                USERNAME
              </label>
              <input
                onChange={this.onChangeUsername}
                value={username}
                placeholder="username"
                className="username-input-box"
                id="userName"
                type="text"
              />
            </div>
            <div className="password-input-container">
              <label className="password-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                onChange={this.onChangePassword}
                value={password}
                placeholder="password"
                className="password-input-box"
                id="password"
                type="password"
              />
            </div>

            <button className="login-button" type="submit">
              Login
            </button>
            {showSubmitError && <p className="errorMsg">{`*${errorMsg}`}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
