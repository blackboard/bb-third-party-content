import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import KeyCode from 'key-code';
import VALIDATIONS from './constants/validations';

class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isDirty: false,
            isTouched: false,
            inputValue: props.value,
            validationErrors: [],
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.updateValidations = this.updateValidations.bind(this);
    }

    componentDidMount() {
        this.updateValidations(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                inputValue: nextProps.value,
            }, () => this.updateValidations(nextProps));
        } else {
            nextProps.validations.some((validation) => {
                if (!this.props.validations.includes(validation)) {
                    this.updateValidations(nextProps);
                    return true;
                }
                return false;
            });
        }
    }

    handleInputChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            isDirty: value && value !== false,
            inputValue: value,
        });

        this.props.onChange(name, value);
    }

    handleKeyDown(event) {
        if (this.props.onEnter && event.keyCode === KeyCode.ENTER) {
            this.props.onEnter(event);
        }
    }

    onFocus() {
        this.setState({
            isTouched: true,
        });
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    updateValidations(props) {
        const { onValidate, translate } = this.props;
        const validationErrors = [];

        if (props.validations.length === 0) {
            return;
        }

        props.validations.forEach((key) => {
            if (!VALIDATIONS[key].regex.test(props.value)) {
                validationErrors.push({
                    key,
                    message: translate(VALIDATIONS[key].errorMessageLocalizationKey, {
                        value: props.value,
                    }),
                });
            }
        });

        this.setState({
            validationErrors,
        });
        if (onValidate) {
            onValidate({
                [props.id]: validationErrors,
            });
        }
    }

    render() {
        const { autoComplete, className, disabled, id, name, type, onBlur, validations } = this.props;
        const { inputValue, isDirty, isTouched, validationErrors } = this.state;
        const additionalClasses = classNames({
            'is-dirty': isDirty,
            'is-invalid': validationErrors.length > 0,
            'is-touched': isTouched,
            'is-valid': validationErrors.length === 0 && validations.length > 0,
        });

        return (
            <div className="form-field">
                <input
                    ref={(el) => { this.inputEl = el; }}
                    autoComplete={autoComplete}
                    className={`${className} ${additionalClasses}`}
                    disabled={disabled}
                    id={id}
                    name={name}
                    type={type}
                    value={inputValue}
                    onChange={this.handleInputChange}
                    onBlur={onBlur}
                    onFocus={this.onFocus}
                    onKeyDown={this.handleKeyDown}
                />
                {
                    validationErrors.length > 0 && (isTouched || isDirty) &&
                    <div className="validation-errors">
                        {
                            validationErrors.map(error => (
                                <div key={error.key} className="message-container icon-small attention-alert">
                                    <em className="message">
                                        {error.message}
                                    </em>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        );
    }
}

Input.propTypes = {
    autoComplete: PropTypes.oneOf(['off', 'on']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onEnter: PropTypes.func,
    onValidate: PropTypes.func,
    translate: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['number', 'password', 'search', 'text', 'url']),
    validations: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(VALIDATIONS))),
    value: PropTypes.string,
};

Input.defaultProps = {
    autoComplete: 'on',
    className: 'appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter py-3 px-4',
    disabled: false,
    isRequired: false,
    onBlur: null,
    onFocus: null,
    onEnter: null,
    onValidate: null,
    type: 'text',
    validations: [],
    value: '',
};

export default Input;
