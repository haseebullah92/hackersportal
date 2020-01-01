import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';
import { withRouter } from 'react-router-dom';

class LogoutButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  toggle = (resp) => {
    this.setState({
      modal: !this.state.modal,
    });
    if (resp) {
      localStorage.removeItem('auth');

      this.props.history.push('/');
    }
  };

  render() {
    return (
      <div>
        <a className='nav-link' onClick={() => this.toggle(false)}>
          <i className='fa fa-fw fa-sign-out' />
          &nbsp;Logout
        </a>
        <Modal
          isOpen={this.state.modal}
          toggle={() => this.toggle(false)}
          className={this.props.className}
        >
          <ModalHeader toggle={() => this.toggle(false)}>Ready to Leave</ModalHeader>
          <ModalBody>
            Select "Logout" below if you are ready to end your current session.
          </ModalBody>
          <ModalFooter>
            <Button color='secondary' onClick={() => this.toggle(false)}>
              Cancel
            </Button>
            <Button color='primary' onClick={() => this.toggle(true)}>
              Logout
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withRouter(LogoutButton);
