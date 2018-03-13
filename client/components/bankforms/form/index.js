import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import moment from "moment";
import Form from "react-jsonschema-form";

class BForm extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentWillMount() {
        this.getDefinitions(this.props.item);

        Tracker.autorun(() => {
            if (Accounts.loginServicesConfigured()) {
                if (Meteor.user()) {
                    const userId = Meteor.userId();
                    this.getMasterfield(userId);
                }
            }
        });
    }
    componentWillUnmount() {
        this.storeDataToUserProfile();
    }

    storeDataToUserProfile() {

        const {bank_name}=this.state;

        var currentFormdata = this.state[bank_name] ? this.state[bank_name]["formData"] : false;

        var objectConstructor = {}.constructor;

        if (!currentFormdata)
            return;

        var objectConstructor = {}.constructor;
        var data = {}
        a(currentFormdata);
        function a(obj, key) {
            if (!obj) {
                return;
            } else if (obj.constructor !== objectConstructor) {
                data[key] = obj;
            } else {
                Object.keys(obj).map((key, index) => {
                    a(obj[key], key);
                })
            }
        }

        currentUserID = Meteor.userId();

        if (currentUserID) {
            Meteor.call("findOneMasterField", currentUserID, (err, res) => {
                if (err) {
                    console.log(err);
                } else if (res) {
                    Object.keys(data).map((key, index) => {
                        res.usedfield[key] = data[key];
                    });
                    Meteor.call("updateMasterfield", currentUserID, res.usedfield);
                } else {
                    Meteor.call("addMasterfields", currentUserID, data);
                }
            });
        }
    }

    compareFormdata(item, formSchema) {

        if (formSchema) {

            if (Object.keys(formSchema).length > 0) {

                definitions = formSchema.schema.definitions ? formSchema.schema.definitions : formSchema.schema;

                if (!this.state.masterfiled) return;

                masterfiled = this.state.masterfiled.usedfield;
                
                comparedData = {};

                a(definitions, masterfiled, comparedData)

                function a(obj, masterfiled, comparedData) {

                    Object.keys(obj).map((key, index) => {

                        if (obj[key].type === "object") {

                            comparedData[key] = {}

                            a(obj[key].properties, masterfiled, comparedData[key]);

                        } else if (obj[key].type === "array" && !obj[key].uniqueItems) {

                            console.log(obj[key].items)

                        } else {

                            if (masterfiled[key]) {

                                comparedData[key] = masterfiled[key];

                            }
                        }
                    })
                }
                return comparedData;
            } else {
                return;
            }
        } else {
            return;
        }

    }

    getMasterfield(userId) {

        Meteor.call("findOneMasterField", userId, (err, res) => {
            this.setState({masterfiled:res});
        });
    }

    getDefinitions(item) {

        Meteor.call('getBankform', item, (err, response) => {
            if (response)
                this.setState(response);
        });
    }

    bankFormChange(bank_name, bankform) {

        this.props.contentHasError(bankform.errors.length > 0);
        this.state[bank_name]["formData"] = bankform.formData
    }

    formView(item) {

        const { continueAn } = this.state;

        currentUserID = Meteor.userId();

        this.state['bank_name'] = bank_name = item.bank_name.replace(/\s/g, '').toLowerCase();

        formSchema = this.state[bank_name];

        formdata = continueAn ? false : this.compareFormdata(item, formSchema);

        if (formSchema) {
            formSchema = Object.keys(formSchema).length > 0 ? formSchema : null;
            formdata = this.state[bank_name]["formData"] ? this.state[bank_name]["formData"] : formdata ? formdata : {};
        }

        function CustomFieldTemplate(props) {
            const { id, classNames, label, help, required, errors, children, schema } = props;
            const { htmlClass, title, isSection, description, subSectiondescription, type, colWidth, rightLabel, leftLabel } = schema;
            if (type === "label") {
                return (
                    <div className={htmlClass} style={{ width: colWidth }}>
                        {title && !isSection ? (
                            <label htmlFor={id} style={{ minHeight: "30px" }}> {label}{required ? "*" : null}</label>
                        ) : <label htmlFor={id} style={{ minHeight: "30px" }}><div></div></label>}

                    </div>
                )
            } else {
                return (
                    <div className={htmlClass} style={{ width: colWidth }}>
                        {title && !isSection ? (
                            <label htmlFor={id}>
                                {label}{required ? "*" : null}
                                <p className="field-desc">{description}</p>
                            </label>
                        ) : null}
                        {leftLabel ? (<div className="left-label"><span>{leftLabel}</span></div>) : null}
                        {children}
                        {rightLabel ? (<div className="right-label"><span>{rightLabel}</span></div>) : null}
                        {subSectiondescription ? (
                            <p className="subSectiondescription" >{subSectiondescription}</p>
                        ) : null}
                        {type !== "object" ? errorTemplate(errors.props) : null}
                        {/* {help} */}
                    </div>
                );
            }

        }

        function errorTemplate(props) {
            if (!props.errors) return;
            return (
                props.errors.map((err, index) => {
                    return (
                        <div key={index} className="validation-error">
                            {err}
                        </div>
                    )
                })
            );
        }

        function transformErrors(errors) {
            return errors.map(error => {
                if (error.name === "pattern") {
                    error.message = "Only digits are allowed."
                } else if (error.name === "required") {
                    error.message = "Requires field "
                } else if (error.name === "type") {
                    if (Array.isArray(error.argument)) {
                        if (error.argument[0] === "number") {
                            error.message = "Only digits are allowed."
                        }
                    }
                } else if (error.name === "format") {
                    if (error.argument === "email") {
                        error.message = "Invalid Email format!";
                    }
                }
                return error;
            });
        }

        function customValidate(schema, formData, errors) {

            let allData = formData

            DOBValidation = (minAge, data) => {

                var date = moment(Date.parse(data))

                var now = moment();

                var duration = moment.duration(now.diff(date));

                var years = Math.round(duration.asYears());

                return minAge > years;
            }

            maxLenValidation = (data, maxlen) => {
                return maxlen < data.length;
            }

            lengthOfServiceValidation = (year, data) => {
                if (year >= 1) {
                    return false;
                } else {
                    if (!data)
                        return true;
                    else
                        return false;
                }
            }

            idMap = (definitions, formData, errors) => {

                Object.keys(definitions).map((key, index) => {

                    if (definitions[key].type === "object") {

                        idMap(definitions[key].properties, formData[key], errors[key])

                    } else if (definitions[key].type === "array" && !definitions[key].uniqueItems) {

                        console.log(definitions[key].items)

                    } else {

                        if (definitions[key].validation) {

                            var data = formData[key];

                            if (eval(definitions[key].validation))

                                errors[key].addError(definitions[key].validationMsg);

                        } else if (definitions[key].maxlen) {
                            if (formData[key])
                                if (maxLenValidation(formData[key], definitions[key].maxlen))
                                    errors[key].addError("Maximum length is " + definitions[key].maxlen);

                        }

                    }

                })
            }

            idMap(schema.definitions, formData, errors)

            return errors;
        }

        return (
            <div className="bankform">
                {formSchema ? (
                    <Form schema={formSchema.schema}
                        uiSchema={formSchema.uischema}
                        FieldTemplate={CustomFieldTemplate}
                        showErrorList={false}
                        liveValidate={true}
                        formData={formdata}
                        transformErrors={transformErrors}
                        validate={customValidate.bind(this, formSchema.schema)}
                        onChange={this.bankFormChange.bind(this, bank_name)} >
                        {/* <div></div> */}
                    </Form>
                ) : null}
            </div>
        )
    }

    render() {

        const { item } = this.props

        return item ? this.formView(item) : null
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
    )(BForm);