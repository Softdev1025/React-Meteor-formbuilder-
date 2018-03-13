import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import { browserHistory } from 'react-router';
import Controls from "../control"


class CreateFrom extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div style={{ height: "90%" }} >
                <div className="container-fluid action-main-container full-height">
                    <div className="panel panel-default rfq-container">
                        <div className="panel-heading">
                            <h1>Create From</h1>
                        </div>
                        <div className="panel-body">
                            <h1>Create From</h1>
                        </div>
                    </div>
                </div>
                <Controls />
            </div>
        )
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
    )(CreateFrom);