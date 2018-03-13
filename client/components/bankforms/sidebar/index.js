import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BForm from '../form'

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            hasError: false
        }
    }

    componentWillMount() {

    }

    contentHasError(err) {
        this.state.hasError = err;
    }

    selectTab(tabIndex) {
        if (this.state.hasError) return;
        currentTabIdex = this.state.tabIndex
        this.state.tabIndex = tabIndex
        this.setState({ tabIndex })
    }

    nextTab() {
        if (this.state.hasError) return;
        tabs = this.props.items.length;
        currentTabIdex = this.state.tabIndex
        tabIndex = currentTabIdex + 1
        if (tabIndex > tabs - 1)
            tabIndex = 0;
        this.setState({ tabIndex });
    }

    preTab() {
        if (this.state.hasError) return;
        tabs = this.props.items.length;
        currentTabIdex = this.state.tabIndex
        tabIndex = currentTabIdex - 1
        if (tabIndex < 0)
            tabIndex = tabs - 1;
        this.setState({ tabIndex });

    }

    content(items) {
        return (
            <Tabs
                selectedIndex={this.state.tabIndex}
                onSelect={this.selectTab.bind(this)}
                selectedTabClassName="vertical-react-tabs__tab--selected"
                selectedTabPanelClassName="vertical-react-tabs__tab-panel--selected"
                className="vertical-react-tabs" >
                <TabList className="vertical-react-tabs__tab-list" >
                    {
                        items.map((item, index) => {
                            return (
                                <Tab key={index} className="vertical-react-tabs__tab">
                                    <div>
                                        <img src={item.logo} />
                                        <p>{item.bank_name}</p>
                                    </div>
                                </Tab>
                            )
                        })
                    }
                </TabList>

                {
                    items.map((item, index) => {
                        return (
                            <TabPanel className="vertical-react-tabs__tab-panel" key={index}>
                                <div className="col-md-1">
                                    <div className="react-tab-pager">
                                        <a onClick={this.preTab.bind(this)} className="btn"><span className="glyphicon glyphicon-menu-left"></span></a>
                                    </div>
                                </div>
                                <div className="col-md-10">
                                    <BForm item={item} contentHasError={this.contentHasError.bind(this)} />
                                </div>
                                <div className="col-md-1">
                                    <div className="react-tab-pager">
                                        <a onClick={this.nextTab.bind(this)} className="btn"> <span className="glyphicon glyphicon-menu-right"></span></a>
                                    </div>
                                </div>
                            </TabPanel>
                        )
                    })
                }
            </Tabs>
        )
    }

    render() {
        const { items } = this.props;
        return items.length > 0 ? this.content(items) : null;
    }
}



const mapDispatchToProps = dispatch => {
    return
    {

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
    )(SideBar);