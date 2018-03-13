import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import { browserHistory } from 'react-router';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';

import Toolbar from '../toolbar/'
import Menu from '../menu/'
import { setUser } from '../../actions/setUser';

import SideBar from './sidebar'
import CreateFrom from './createForm'
const customStyles = {
    content: {
        top: '22%',
        left: '35%',
        right: 'auto',
        bottom: 'auto',
        width: '30%',
        height: 'auto'

    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.59)'
    },
};

class BankFroms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentName: 'management_user',
            error: '',
            info: '',
            success: '',
            bankItems: [],
            modalIsOpen: false,
            email: "",
            password: "",
            pswConfirm: '',
            username: '',
            loginInfo: null,
            signInfo: {},
            signView: false,
            signFormValidation: false,
            tabIndex: 0,
            property_type: null
        };
    }

    componentWillMount() {

        Tracker.autorun(() => {

            if (Accounts.loginServicesConfigured()) {
                if (Meteor.user()) {
                    if (this.props.location.query.packIds) {
                        var packIDS = JSON.parse(this.props.location.query.packIds);
                        this.state.property_type = this.props.location.query.property_type;
                        const userId = Meteor.userId();
                        this.getBankInfo(packIDS);
                    }

                } else {
                    this.setState({ modalIsOpen: true });
                }
            }
        });
    }

    componentDidMount() {

    }

    getBankInfo(ids) {

        if (ids.length > 0) {
            axios.get('https://localhost:8080/borrows/BankInfo?itemId=' + ids)
                .then(response => {
                    if (response.data) {
                        resData = response.data;
                        resData.map((item, index) => {
                            if (item.loanType) {
                                loantype = item.loanType.replace(/\s/g, '').toLowerCase();
                                loantype = loantype.split(",");
                                item.loanType = loantype;
                            }
                            item['property_type'] = this.state.property_type;
                        })
                    }
                    this.setState({ bankItems: response.data })
                })
                .catch(error => {
                    console.log('Error fetching and parsing data', error);
                });
        }

    }

    redirect() {
        window.location.href = decodeURIComponent(this.props.location.query.redirectUrl);
    }

    /** login and sign function */

    handleChange(event) {
        this.setState({ email: event.target.value, });
    }

    handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    login() {
        const { email, password } = this.state
        Meteor.loginWithPassword(email, password, (error, response) => {
            if (error) {
                this.setState({ loginInfo: error.reason });
            }
            else {
                this.setState({ modalIsOpen: false });
            }
        });
    }

    signUp() {
        let { username, email, password } = this.state
        var options = { 'name': username, 'email': email, 'password': password };

        Meteor.call("userExists", options, (err, response) => {
            if (response) {
                this.setState({ error: "Email address already exists" });
            }
            else {
                Meteor.call("addUser", options, (err, response) => {
                    if (err) { console.log(err); console.log(response); }
                    else {
                        this.setState({ signView: false });
                    }
                });
            }
        });
    }

    loginWithGoogle() {

        Meteor.loginWithGoogle({ requestPermissions: ['email'] }, (err) => {
            if (err) {
                console.log(err)
            }
            else {
                this.setState({ modalIsOpen: false });
            }
        });

    }

    loginWithFacebook() {
        Meteor.loginWithFacebook({ requestPermissions: ['user_friends', 'public_profile', 'email'] }, (err) => {
            if (err) {
                console.log(err)
            } else {
                this.setState({ modalIsOpen: false });
            }
        });
    }

    continueAnonymously() {
        this.setState({ modalIsOpen: false, continueAn: true });
    }

    loginView() {
        const { error, info, success, loginInfo } = this.state;
        return (
            <div className="col-md-10 col-md-offset-1" style={{ padding: 30 }}>
                {loginInfo ? (<div className="alert alert-danger fade in"> {loginInfo} </div>) : null}
                <form noValidate>
                    <div className="form-group">
                        <label className="control-label">Email Address</label>
                        <input
                            className="form-control"
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange.bind(this)}
                            ref={(input) => { this.textInput = input; }}
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="form-group">
                        <label className="control-label">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChangePassword.bind(this)}
                            placeholder="Password"
                        />
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2 text-center">
                            <a onClick={this.login.bind(this)} className={"btn btn-success btn-block " + ((!this.state.email || !this.state.password) ? "disabled" : "")}>
                                Login</a>
                        </div>
                    </div>
                    <div className="row">
                        <hr />
                        <p className="help-block text-center">
                            Don't have an account?
                                        <a onClick={() => { this.setState({ signView: true }) }}> Sign Up </a>
                            Or
                                        <a onClick={this.continueAnonymously.bind(this)} > Continue Anonymously</a>
                        </p>
                    </div>
                </form>
                <div className="row">
                    <div className="text-center">
                        <hr />
                        OR
								<hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button
                            onClick={this.loginWithGoogle.bind(this)}
                            className="btn btn-block btn-danger"
                        >
                            <span className="fa fa-facebook-square"></span>
                            Login With Gmail
								</button>
                    </div>
                    <div className="col-md-6">
                        <button
                            onClick={this.loginWithFacebook.bind(this)}
                            className="btn btn-block btn-primary"
                        >
                            <span className="fa fa-facebook-square"></span>
                            Login With Facebook
								</button>
                    </div>
                </div>
            </div>
        )
    }

    onSignFormChange(e) {
        fieldName = e.target.name;
        value = e.target.value;
        this.setState({ [fieldName]: value }, () => {
            this.validateField(fieldName, value);
        });

    }

    validateField(fieldName, value) {

        let { username, email, password, pswConfirm, signInfo } = this.state

        switch (fieldName) {

            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                signInfo['email'] = emailValid ? false : ' Invalid email format';
                break;
            case 'password':
                passwordValid = value.length >= 8;
                signInfo['password'] = passwordValid ? false : 'Password must be greater than 8 characters';
                break;
            case 'pswConfirm':
                pswConfirmValid = value === password;
                signInfo['pswConfirm'] = pswConfirmValid ? false : ' Mismatch';
                break;
            default:
                break;
        }
        this.setState({
            signInfo: signInfo,
            signFormValidation: !signInfo.email && signInfo.email != undefined && !signInfo.password && signInfo.password != undefined && !signInfo.pswConfirm && signInfo.pswConfirm != undefined && username.length > 0
        });
    }

    signView() {

        return (
            <div className="col-md-10 col-md-offset-1" style={{ padding: 30 }}>
                {this.state.error ? (<div className="alert alert-danger fade in"> {this.state.error} </div>) : null}
                <form>
                    <div className="form-group">
                        <label className="control-label"> Name </label>
                        <input
                            value={this.state.username}
                            type="text"
                            onChange={this.onSignFormChange.bind(this)}
                            name="username"
                            className="form-control"
                            placeholder="Name"
                        />
                    </div>
                    <div className="form-group">
                        <label className="control-label"> Email </label>
                        {this.state.signInfo.email ? (<div className="alert alert-danger fade in"> {this.state.signInfo.email} </div>) : null}
                        <input
                            onChange={this.onSignFormChange.bind(this)}
                            value={this.state.email}
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <label className="control-label"> Password </label>
                        {this.state.signInfo.password ? (<div className="alert alert-danger fade in"> {this.state.signInfo.password} </div>) : null}
                        <input
                            onChange={this.onSignFormChange.bind(this)}
                            value={this.state.password}
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                        />
                    </div>
                    <div className="form-group">
                        <label className="control-label"> Confirm Password </label>
                        {this.state.signInfo.pswConfirm ? (<div className="alert alert-danger fade in"> {this.state.signInfo.pswConfirm} </div>) : null}
                        <input
                            onChange={this.onSignFormChange.bind(this)}
                            value={this.state.pswConfirm}
                            type="password"
                            name="pswConfirm"
                            className="form-control"
                            placeholder="Confirm Password"
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2 text-center">
                            <hr />
                            <a onClick={this.signUp.bind(this)} className={"btn btn-success btn-block " + (this.state.signFormValidation ? "" : "disabled")}>
                                Sign Up
							</a>
                        </div>
                    </div>
                    <div className="row">
                        <hr />
                        <p className="help-block text-center">
                            Already have an account? Login <a onClick={() => this.setState({ signView: false })}> here </a>
                        </p>
                        <hr />
                    </div>
                </form>
            </div>
        )
    }

    /* End of login and sign functions */

    content() {

        const { signView, bankItems } = this.state;

        return (
            <div className="full-height" >
                <div id="navbar">
                    <Toolbar name={this.state.contentName} dashboardName={this.state.dashboardName} />
                </div>
                <SideBar items={bankItems}/>
                <CreateFrom />
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    ariaHideApp={false}
                    style={customStyles}>
                    {signView ? (this.signView()) : this.loginView()}
                </Modal>
            </div>
        );
    }

    render() {
        return this.content();
    }
}

const mapDispatchToProps = dispatch => {
    return
    {
        setUser: user => {
            dispatch(setUser(user))
        }
    }
};

const mapStateToProps = state => ({
    state: state,
    currentUser: state.currentUser.currentUser
});

export default
    compose(
        withTracker(() => {
            return { currentUser: Meteor.user() }
        })
    )(BankFroms);