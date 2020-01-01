import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { updateUser } from '../../../services/user-service';
import { ToastsContainer, ToastsStore } from 'react-toasts';

class EditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            fullname: '',
            username: '',
            role: '',
            password: '',
            confirmpassword: ''
        };

        this.submitFormHandler = this.submitFormHandler.bind(this);
    }

    submitFormHandler = (event) => {
        event.preventDefault();
        if (this.state.password) {
            if (this.state.password != this.state.confirmpassword) {
                ToastsStore.error("Password doesn't match!");
                return;
            }
            let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
            if (!regex.test(this.state.password)) {
                ToastsStore.error("Password must contain at least 6 characters, one upper case letter, one lower case, one numeric character and one special character!");
                return;
            }
        }
        let that = this;
        updateUser(this.state)
            .then(
                function (resp) {
                    if (resp.success) {
                        ToastsStore.success("User edited successfully!");
                        that.props.onHide(true);
                    } else {
                        ToastsStore.error(resp.message);
                    }
                },
                (error) => {
                    ToastsStore.error("An error occur!");
                },
            );
    };

    changeHandler = (event) => {
        const nam = event.target.name;
        const val = event.target.value;
        this.setState({ [nam]: val });
    };

    componentDidUpdate() {
        if (this.props.data.id && this.props.data.id != this.state.id) {
            this.setState({
                id: this.props.data.id,
                fullname: this.props.data.fullName,
                username: this.props.data.email,
                role: this.props.data.role,
                password: '',
                confirmpassword: ''
            });
        }
    }

    onClose() {
        this.setState({
            id: '',
            fullname: '',
            username: '',
            role: '',
            password: '',
            confirmpassword: ''
        });
        this.props.onHide();
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <form onSubmit={this.submitFormHandler}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Edit user
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="exampleInputName">Full name</label>
                            <input className="form-control" id="name" ref="fullname" value={this.state.fullname} type="text" aria-describedby="nameHelp" placeholder="Enter first name"
                                name='fullname'
                                onChange={this.changeHandler} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input className="form-control" id="email" value={this.state.username} type="email" aria-describedby="emailHelp"
                                placeholder="Enter email" name='username'
                                onChange={this.changeHandler} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Role</label>
                            <select className="form-control" id="role" value={this.state.role} aria-describedby="roleHelp"
                                name='role' onChange={this.changeHandler} required>
                                <option value=""> -- Select -- </option>
                                <option value="ProjectManager">ProjectManager</option>
                                <option value="User">User</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">New password</label>
                            <input className="form-control" id="password" type="password" placeholder="Password"
                                name='password'
                                onChange={this.changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleConfirmPassword">Confirm password</label>
                            <input className="form-control" id="confirmPassword" type="password" placeholder="Confirm password"
                                name='confirmpassword'
                                onChange={this.changeHandler} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn btn-secondary" onClick={() => this.onClose()}>Cancel</Button>
                        <button type="submit" className="btn btn-primary">Update</button>
                    </Modal.Footer>
                </form>
            </Modal>
        )
    }
}

export default EditUser;

