
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import config from '../configuration';

/**
 * Selecciona de idioma de la aplicación.
 */
class LanguageSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: config.language.default
        };
        this.changeValue = this.changeValue.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.setLanguage(config.language.default);
    }

    changeValue(event) {
        let value = event.currentTarget.value;
        this.setState({
            value: value
        });
        this.setLanguage(value);
    }

    /**
     * Cambia el lenguaje de la aplicación a través del API de react-i18next.
     * 
     */
    setLanguage(language) {
        const { i18n } = this.props;
        i18n.changeLanguage(language);
    }

    render() {
        const options = config.language.options.map(language => (
            <option key={language.key} value={language.key}>{language.name}</option>
        ));
        return (
            <select id="language-selector"
                onChange={this.changeValue}
                value={this.state.value}>
                {options}
            </select>
        );
    }
}

export default withTranslation()(LanguageSelector);