import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { withStyles } from '@material-ui/core/styles';
import { Box, Checkbox, FormControlLabel} from '@material-ui/core';

const categories = [
    {id: 1, description: 'Ambiente'},
    {id: 2, description: 'Crecimiento personal'},
    {id: 3, description: 'Educación'},
    {id: 4, description: 'Trabajo'}
];

/**
 * Selecciona de idioma de la aplicación.
 */
class CategorySelector extends Component {

    constructor(props) {
        super(props);
        this.state = { value: [] };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log(this.props.value);
        this.setState({ value: this.props.value });
    }

    handleChange(event, catId) {
        let array = [...this.state.value];
        let index = array.indexOf(catId);
        if (index !== -1) {
            array.splice(index, 1);
        } else {
            array.push(catId);
        }
        this.setState({value: array});
        this.props.setCategories(array);
    }

    render() {
        const options = categories.map(cat => (
            <Box>
                <FormControlLabel
                    control={
                        <Checkbox checked={(this.state.value.indexOf(cat.id) !== -1)}
                        onChange={(event) => this.handleChange(event, cat.id)} name={cat.id} />
                        }
                    label={cat.description}
                />
            </Box>
        ));
        return (
            <div>
                <label class="control-label">{this.props.label}</label>
                <Box m={0} display="flex" justifyContent="space-evenly">
                    {options}
                </Box>
                <span class="help-block">{this.props.helpText}</span>
            </div>
        );
    }
}
export default withTranslation()(withStyles(styles)(CategorySelector));