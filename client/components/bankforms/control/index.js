import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router';

export default class Controls extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return (
            <div className="navbar navbar-static-bottom">
                <div style={{ float: "right", display: "inline-block", paddingRight: "50px" }}>
                    <button title="Completed" className="btn btn-success">
                        <span className="glyphicon glyphicon-ok">
                        </span>
                        <span className="cb-text"> Completed</span>
                    </button>
                </div>
                <div style={{ float: "left", display: "inline-block", paddingLeft: "50px" }}>
                    <button title="Go back to Easyrate.com" className="btn btn-success">
                        <span className="glyphicon glyphicon-ok">
                        </span>
                        <span className="cb-text">&nbsp;Back</span>
                    </button>
                </div>
            </div>
        )
    }
}