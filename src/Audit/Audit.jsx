import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

import { Navbar, Nav } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import moment from 'moment';
class Auditpage extends React.Component {
    constructor() {
        super();
        this.state = {
            timeFormat: 'DD/MM/YYYY, hh:mm:ss A',
            name: '',
            users: ''
        }
    }
    componentDidMount() {
        this.props.getUsers();
    }

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }

    changeTimeFormat = (format) => {
        if(format.target.value === "12") {
            this.setState({ timeFormat: 'DD/MM/YYYY, hh:mm:ss A' })
        }else {
            this.setState({ timeFormat: 'DD/MM/YYYY, HH:mm:ss' })
        }
    }

    filterName = (e) => {
        let { users } = this.props;
        let { value } = e.target;
        if(value && value.length > 0) {
            users = {...users, items: users.items && users.items.filter(
                (item) => {
                    let name = item.firstName + ' ' + item.lastName;
                    return item.firstName && name.toLowerCase().includes(value)
                }
            )}
        }
        this.setState({ users: users, name: value })
    }

    render() {
        const { user } = this.props;
        let users = this.state.users ? this.state.users : this.props.users;
        const data = users.items && users.items.map(userData=>{
            let date = new Date(userData.createdDate);
            return { id: userData.id, role: userData.role, name: userData.firstName + ' ' + userData.lastName, create_date: moment(date).format(this.state.timeFormat), actions: userData.deleting ? <em> Deleting...</em>
            : userData.deleteError ? <span className="text-danger"> ERROR: {userData.deleteError}</span>
                : <a onClick={this.handleDeleteUser(userData.id)}>Delete</a> }
        });
        const columns = [
            {
                name: 'ID',
                selector: 'id',
                sortable: true,
            },
            {
                name: 'Role',
                selector: 'role',
                sortable: true,
            },
            {
                name: 'Name',
                selector: 'name',
                sortable: true,
            },
            {
                name: 'Created Date',
                selector: 'create_date',
                sortable: true,
            },
            {
                name: 'Actions',
                selector: 'actions',
            }
          ];
          let selectOptions = <React.Fragment>
                <select onChange={this.changeTimeFormat}>
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                </select> 
                <input value={this.state.name} onChange={this.filterName} placeholder="Search by Name" />
            </React.Fragment>
        let message = <React.Fragment>{users.loading ? <em>Loading users...</em> : users.error ? <span className="text-danger">ERROR: {users.error}</span> : 'No Records Found'}</React.Fragment>
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand ></Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link ><Link to="/">Home</Link></Nav.Link>
                        <Nav.Link href="#features">Auditor</Nav.Link>
                        <Nav.Link> <Link to="/login">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
                <div className="col-md-6 col-md-offset-3">

                    <h1>Hi {user.firstName}!</h1>
                    <p>You're logged in with React!!</p>
                    
                
                </div>
                <div style={{width: '1020px'}}>
                    <DataTable
                        columns={columns}
                        data={data}
                        title="All login audit"
                        noDataComponent={message}
                        pagination
                        subHeader
                        subHeaderComponent={data ? selectOptions : ''}
                    />
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };