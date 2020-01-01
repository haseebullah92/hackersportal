import React, { Component } from 'react';
import { getAll, deleteUser, unlockUser } from '../../../services/user-service';
import AddUser from './AddUser';
import EditUser from './EditUser';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';

class Users extends Component {
    constructor(props) {
        super(props);
        let auth = JSON.parse(localStorage.getItem('auth'));
        this.state = {
            role: auth.role,
            dataTable: [],
            filterDataTable: [],
            addModal: false,
            editModal: false,
            confirmModal: false,
            editUser: {},
            confirmUser: {},
            confirm: ""
        };
        this.openAddModal = this.openAddModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.openConfirmModal = this.openConfirmModal.bind(this);
        //this.getData = this.getData.bind(this);
        this.getData();
    }

    changeHandler = (event) => {
        const val = event.target.value.toLowerCase();
        if (val) {
            let filterData = this.state.dataTable.filter((item) => item.fullName.toLowerCase().includes(val));
            this.setState({ filterDataTable: filterData });
        } else {
            this.setState({ filterDataTable: this.state.dataTable });
        }

    };

    getData = () => {
        let that = this;
        getAll()
            .then(
                function (resp) {
                    if (resp.success) {
                        that.setState({ dataTable: resp.data, filterDataTable: resp.data });
                    }
                },
                (error) => {
                    ToastsStore.error("An error occur!");
                },
            );
    }

    openEditModal = (editUser) => {
        this.setState({
            editModal: true,
            editUser: editUser
        });
    }

    openAddModal = () => {
        this.setState({
            addModal: true
        });
    }

    openConfirmModal = (confirmUser, confirm) => {
        this.setState({
            confirmModal: true,
            confirmUser: confirmUser,
            confirm: confirm
        });
    }

    closeAddModel = (resp) => {
        this.setState({
            addModal: false
        });
        if (resp === true) {
            this.getData();
        }
    }

    closeConfirmModal = (resp) => {
        if (resp === true) {
            let that = this;
            if (this.state.confirm == "delete") {
                deleteUser(this.state.confirmUser.id)
                    .then(
                        function (resp) {
                            if (resp.success) {
                                ToastsStore.success("User deleted successfully!");
                                that.setState({
                                    confirmModal: false,
                                    confirmUser: {},
                                    confirm: ""
                                });
                                that.getData();
                            }
                        },
                        (error) => {
                            ToastsStore.error("An error occur!");
                        },
                    );
            } else {
                unlockUser(this.state.confirmUser.id)
                    .then(
                        function (resp) {
                            if (resp.success) {
                                ToastsStore.success("User unlocked successfully!");
                                that.setState({
                                    confirmModal: false,
                                    confirmUser: {},
                                    confirm: ""
                                });
                                that.getData();
                            }
                        },
                        (error) => {
                            ToastsStore.error("An error occur!");
                        },
                    );
            }
        } else {
            this.setState({
                confirmModal: false,
                confirmUser: {},
                confirm: ""
            });
        }
    }

    closeEditModel = (resp) => {
        this.setState({
            editModal: false,
            editUser: {}
        });
        if (resp === true) {
            this.getData();
        }
    }

    render() {
        if (!this.state.dataTable) {
            return null;
        }
        return (
            <div>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className="card mb-3">
                            <div className="card-header">
                                <i className="fa fa-users"></i> Users
                                {
                                    this.state.role == "Admin" ? <button type="button" className="btn btn-primary pull-right" onClick={() => this.openAddModal()}>
                                        <i className="fa fa-plus"></i> Add
                                </button> : null
                                }
                            </div>
                            <div className="card-body my-auto">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className='form-group'>
                                            <div className='form-label-group'>
                                                <label htmlFor='inputSearch'>Search with Name</label>
                                                <input
                                                    type='text'
                                                    id='inputSearch'
                                                    className='form-control'
                                                    placeholder='Search'
                                                    name='search'
                                                    onChange={this.changeHandler}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive mt-1">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                {
                                                    this.state.role == 'Admin' ?
                                                        <th></th> : null
                                                }

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.filterDataTable.length > 0 ?
                                                    this.state.filterDataTable.map(function (item, i) {
                                                        return <tr key={item.id}>
                                                            <td>{i + 1}</td>
                                                            <td>{item.fullName}</td>
                                                            <td>{item.email}</td>
                                                            <td>{item.role}</td>
                                                            {
                                                                this.state.role == 'Admin' ?
                                                                    <td>
                                                                        {
                                                                            (item.role != 'Admin') ?
                                                                                <div className="pull-right">
                                                                                    {
                                                                                        item.isLockout ? <button type="button" className="btn btn-primary mr-2" onClick={() => this.openConfirmModal(item, "unlock")}>
                                                                                            <i className="fa fa-pencil"></i> Unlock</button> : null
                                                                                    }
                                                                                    <button type="button" className="btn btn-primary" onClick={() => this.openEditModal(item)}>
                                                                                        <i className="fa fa-pencil"></i> Edit</button>
                                                                                    <button type="button" className="btn btn-secondary ml-2" onClick={() => this.openConfirmModal(item, "delete")}>
                                                                                        <i className="fa fa-pencil"></i> Delete</button>
                                                                                </div>

                                                                                : null
                                                                        }
                                                                    </td> : null
                                                            }
                                                        </tr>
                                                    }, this) : this.state.role == 'Admin' ?
                                                        <tr><td colSpan="5" className="text-center">No record found!</td></tr>
                                                        : <tr><td colSpan="4" className="text-center">No record found!</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <AddUser show={this.state.addModal} onHide={(resp) => this.closeAddModel(resp)} />
                            <EditUser show={this.state.editModal} data={this.state.editUser} onHide={(resp) => this.closeEditModel(resp)} />
                            <Modal
                                isOpen={this.state.confirmModal}
                                className={this.props.className}
                            >
                                <ModalHeader toggle={() => this.closeConfirmModal(false)}>Confirmation</ModalHeader>
                                <ModalBody>
                                    {
                                        this.state.confirm == "delete" ? <span>Are you sure you want to delete this user?</span>
                                            : <span>Are you sure you want to unlock this user?</span>
                                    }
                                </ModalBody>
                                <ModalFooter>
                                    <Button color='secondary' onClick={() => this.closeConfirmModal(false)}>Cancel</Button>
                                    <Button color='primary' onClick={() => this.closeConfirmModal(true)}>
                                        {
                                            this.state.confirm == "delete" ? <span>Delete</span> : <span>Unlock</span>
                                        }
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            <ToastsContainer store={ToastsStore} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Users;
