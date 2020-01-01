import React, { Component } from 'react';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import { signIn } from '../../../services/auth-service';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  submitFormHandler = (event) => {
    event.preventDefault();
    let that = this;
    signIn(this.state)
      .then(resp => {
        if (resp.success) {
          localStorage.setItem('auth', JSON.stringify(resp.data));
          that.props.history.push('/');
        } else {
          ToastsStore.error(resp.message);
        }
      }).catch(error => {
        ToastsStore.error("An error occur!");
      });
  };

  changeHandler = (event) => {
    const nam = event.target.name;
    const val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    return (
      <div className='card card-login mx-auto mt-5'>
        <div className='card-header'>Login</div>
        <div className='card-body'>
          <form onSubmit={this.submitFormHandler}>
            <div className='form-group'>
              <div className='form-label-group'>
                <input
                  type='email'
                  id='inputEmail'
                  className='form-control'
                  placeholder='Email address'
                  required='required'
                  name='username'
                  onChange={this.changeHandler}
                />
                <label htmlFor='inputEmail'>Email address</label>
              </div>
            </div>
            <div className='form-group'>
              <div className='form-label-group'>
                <input
                  type='password'
                  id='inputPassword'
                  className='form-control'
                  placeholder='Password'
                  required='required'
                  name='password'
                  onChange={this.changeHandler}
                />
                <label htmlFor='inputPassword'>Password</label>
              </div>
            </div>
            <input
              type='submit'
              className='btn btn-primary btn-block'
              value='Login'
            />
          </form>
        </div>
        <ToastsContainer store={ToastsStore} />
      </div>
    );
  }
}

export default Login;
