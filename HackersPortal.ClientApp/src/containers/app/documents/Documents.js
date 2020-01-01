import React, { Component } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import Permissions from './Permissions';
import { getMyDocuments, getOtherDocuments, deleteUser } from '../../../services/document-service';
import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';

class Documents extends Component {
  constructor(props) {
    super(props);
    let auth = JSON.parse(localStorage.getItem('auth'));
    this.state = {
      role: auth.role,
      dataTable: [],
      filterDataTable: [],
      permissionModal: false,
      document: {},
      delModal: false,
      deldocument: {},
      search: ""
    };
    this.openPermissionsModal = this.openPermissionsModal.bind(this);
    this.getData();
  }

  changeHandler = (event) => {
    const val = event.target.value.toLowerCase();
    if (val) {
      let filterData = this.state.dataTable.filter((item) => item.name.toLowerCase().includes(val));
      this.setState({ filterDataTable: filterData, search: event.target.value });
    } else {
      this.setState({ filterDataTable: this.state.dataTable, search: "" });
    }

  };

  openPermissionsModal = (document) => {
    this.setState({
      permissionModal: true,
      document: document
    });
  }

  closePermissionsModel = () => {
    this.setState({
      permissionModal: false,
      document: {}
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.myDocuments != this.props.myDocuments) {
      this.setState({
        dataTable: [],
        filterDataTable: [],
        permissionModal: false,
        document: {},
        delModal: false,
        deldocument: {},
        search: ""
      });
      this.getData();
    }
  }

  getData = () => {
    let that = this;
    if (this.props.myDocuments) {
      getMyDocuments()
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
    } else {
      getOtherDocuments()
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
  }

  openDelModal = (document) => {
    this.setState({
      delModal: true,
      deldocument: document
    });
  }

  closeDelModel = (resp) => {
    if (resp) {
      var that = this;
      deleteUser(this.state.deldocument.id)
        .then(
          function (resp) {
            if (resp.success) {
              that.setState({
                delModal: false,
                deldocument: {}
              });
              ToastsStore.success("Document Deleted successfully!");
              that.getData();
            }
          },
          (error) => {
            ToastsStore.error("An error occur!");
          },
        );
    } else {
      this.setState({
        delModal: false,
        deldocument: {}
      });
    }
  };

  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-md-12'>
            <div className="card mb-3">
              <div className="card-header">
                <i className="fa fa-file-text-o"></i> {(this.props.myDocuments) ? <span>My Documents</span> : <span>Manage Documents</span>}
                {(this.props.myDocuments) ? <Link to='/app/documents/add' className="btn btn-primary pull-right">
                  <i className="fa fa-plus"></i> Add
                  </Link> : null}
              </div>
              <div className="card-body my-auto">
                <div className="row">
                  <div className="col-md-4">
                    <div className='form-group'>
                      <div className='form-label-group'>
                        <label htmlFor='inputSearch'>Search with Title</label>
                        <input
                          type='text'
                          id='inputSearch'
                          className='form-control'
                          placeholder='Search with title'
                          value={this.state.search}
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
                        <th>Document Title</th>
                        <th>Created On</th>
                        {
                          !this.props.myDocuments ? <th>Created By</th> : null
                        }
                        <th>Modified On</th>
                        <th>Modified By</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.filterDataTable.length > 0 ? this.state.filterDataTable.map(function (item, i) {
                          return <tr key={item.id}>
                            <td>{i + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.createdOn ? <Moment format="YYYY-MM-DD">
                              {item.createdOn}
                            </Moment> : null}</td>
                            {
                              !this.props.myDocuments ? <td>{item.createdByName}</td> : null
                            }
                            <td>{item.modifiedOn ? <Moment format="YYYY-MM-DD">
                              {item.modifiedOn}
                            </Moment> : null}</td>
                            <td>{item.modifiedByName}</td>
                            <td>
                              {
                                (this.props.myDocuments || item.canEdit) ?
                                  <div className="pull-right">
                                    {
                                      (this.state.role != "User" && (this.props.myDocuments || item.canManage)) ? <button type="button" className="btn btn-primary" onClick={() => this.openPermissionsModal(item)}>
                                        <i className="fa fa-pencil"></i> Permissions</button> : null
                                    }
                                    <Link className="btn btn-primary ml-2" to={{
                                      pathname: '/app/documents/edit' + '/' + item.id
                                    }}>
                                      <i className="fa fa-pencil"></i> Edit</Link>
                                    {
                                      ((this.state.role != "User" && item.canManage) || this.props.myDocuments) ?
                                        <button type="button" className="btn btn-secondary ml-2" onClick={() => this.openDelModal(item)}>
                                          <i className="fa fa-trash"></i> Delete</button> : null
                                    }
                                  </div>
                                  : <div className="pull-right"><Link className="btn btn-primary ml-2" to={{
                                    pathname: '/app/documents/view' + '/' + item.id
                                  }}>
                                    <i className="fa fa-eye  "></i> View</Link></div>

                              }
                            </td>
                          </tr>
                        }, this)
                          : (this.props.myDocuments) ?
                            <tr><td colSpan="6" className="text-center">No record found!</td></tr>
                            : <tr><td colSpan="7" className="text-center">No record found!</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <Modal
                isOpen={this.state.delModal}
                className={this.props.className}
              >
                <ModalHeader toggle={() => this.closeDelModel(false)}>Confirmation</ModalHeader>
                <ModalBody>
                  Are you sure you want to delete this user?
                                </ModalBody>
                <ModalFooter>
                  <Button color='secondary' onClick={() => this.closeDelModel(false)}>Cancel</Button>
                  <Button color='primary' onClick={() => this.closeDelModel(true)}>Delete</Button>
                </ModalFooter>
              </Modal>
              <Permissions show={this.state.permissionModal} data={this.state.document} onHide={(resp) => this.closePermissionsModel(resp)} />
              <ToastsContainer store={ToastsStore} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Documents;
