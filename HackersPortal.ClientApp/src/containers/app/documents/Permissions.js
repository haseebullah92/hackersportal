import React, { Component } from 'react';
import Moment from 'react-moment';
import { Modal, Button } from 'react-bootstrap';
import { changePermission, getDocumentPermissions } from '../../../services/document-service';
import { getUsersForPermission } from '../../../services/user-service';
import { ToastsContainer, ToastsStore } from 'react-toasts';

class Permissions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTable: [],
            userTable: [],
            id: '',
        };

        this.changeHandlerCheckBox = this.changeHandlerCheckBox.bind(this);
    }

    getDocumentPermissions = (id) => {
        let that = this;
        getDocumentPermissions(id)
            .then(
                function (resp) {
                    if (resp.success) {
                        that.setState({ dataTable: resp.data });
                    }
                },
                (error) => {
                    ToastsStore.error("An error occur!");
                },
            );
    }

    changeHandlerCheckBox = (event, item, accessLevel) => {
        if (accessLevel == 1 && item.canEdit) {
            return;
        }
        let that = this;

        if (window.confirm("Are you sure?")) {
            var model = {
                id: item.id,
                documentId: this.state.id,
                userId: item.userId,
                accessLevel: accessLevel,
                access: event.target.checked
            }
            changePermission(model)
                .then(
                    function (resp) {
                        if (resp.success) {
                            ToastsStore.success("Permission changed successfully!");
                            that.setState({
                                accessLevel: '',
                                userId: '',
                            });
                            that.getDocumentPermissions(that.state.id);
                        } else {
                            ToastsStore.error(resp.message);
                        }
                    },
                    (error) => {
                        ToastsStore.error("An error occur!");
                    },
                );
        }


    };

    changeHandler = (event) => {
        const nam = event.target.name;
        const val = event.target.value;
        this.setState({ [nam]: val });
    };

    componentDidUpdate() {
        if (this.props.data.id && this.props.data.id != this.state.id) {
            this.setState({
                id: this.props.data.id
            });
            this.getDocumentPermissions(this.props.data.id);
        }
    }

    onClose() {
        this.setState({
            id: '',
        });
        this.props.onHide();
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Permissions
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User Name</th>
                                    <th>Can View</th>
                                    <th>Can Edit</th>
                                    <th>Created On</th>
                                    <th>Modified On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.dataTable.length > 0 ? this.state.dataTable.map(function (item, i) {
                                        return <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{item.userName}</td>
                                            <td className="text-center"><input type="checkbox" className="form-check-input" checked={item.canView} disabled={item.canEdit} onChange={(event) => this.changeHandlerCheckBox(event, item, 1)} /></td>
                                            <td className="text-center"><input type="checkbox" className="form-check-input" checked={item.canEdit} onChange={(event) => this.changeHandlerCheckBox(event, item, 2)} /></td>
                                            <td>{item.createdOn ? <Moment format="YYYY-MM-DD">
                                                {item.createdOn}
                                            </Moment> : null}</td>
                                            <td>{item.modifiedOn ? <Moment format="YYYY-MM-DD">
                                                {item.modifiedOn}
                                            </Moment> : null}</td>
                                        </tr>
                                    }, this) : <tr><td colSpan="5" className="text-center">No record found!</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={() => this.onClose()}>Close</Button>
                </Modal.Footer>

            </Modal>
        )
    }
}

export default Permissions;

