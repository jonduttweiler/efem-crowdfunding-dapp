import { withFormsy } from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';
import { utils } from 'web3';
import { getTruncatedText } from 'lib/helpers';
import Item from '../models/Item';
import DateViewer from './DateViewer';

/** *
 * NOTE: This component is created as a Formsy form component
 * That way we can perform validation on editing milestones
 * based on milestone items being added
 *
 * This also means that this component needs to be wrapped in a
 * Formsy Form component or it won't mount
 *
 * See EditMilestone component
 */
class ItemRow extends React.Component {

  componentDidMount() {
    if (this.props.isEditMode) {
      this.props.setValue(true); // required for validation being true} 
    }
  }

  render() {
    const { removeItem, item, isEditMode, token } = this.props;
    return (
      <tr>
        <td className="td-item-date"><DateViewer value={item.date} /></td>
        <td className="td-item-description">{getTruncatedText(item.description)}</td>
        {/*<td className="td-item-amount-fiat">
            {item.fiatType} {item.fiatAmount.toFixed()}
            <br />
            <span className="help-block">
              {`1 ${token.name} = ${item.conversionRate} ${item.fiatType}`}
            </span>
          </td>*/}
        <td className="td-item-amount-ether">{/*utils.fromWei(item.wei)*/}</td>
        <td className="td-item-file-upload">
          {/*item.imageCidUrl && isEditMode && (
            <div className="image-preview small">
              <img src={item.imageCidUrl} alt="Preview of uploaded file" />
            </div>
          )*/}
          {/*item.imageCidUrl && !isEditMode && (
            <div className="image-preview small">
              <a href={item.imageCidUrl} target="_blank" rel="noopener noreferrer">
                <img src={item.imageCidUrl} alt="View uploaded file" style={{ height: 'initial' }} />
              </a>
            </div>
          )*/}
          {
            <div className="image-preview small">
              <a href={item.imageSrc} target="_blank" rel="noopener noreferrer">
                <img src={item.imageSrc} alt="View uploaded file" style={{ height: 'initial' }} />
              </a>
            </div>
          }
        </td>
        {isEditMode && (
          <td className="td-item-remove">
            <button type="button" className="btn btn-link" onClick={removeItem}>
              X
            </button>
          </td>
        )}
      </tr>
    );
  }
}

ItemRow.propTypes = {
  setValue: PropTypes.func.isRequired,
  removeItem: PropTypes.func,
  item: PropTypes.instanceOf(Item).isRequired,
  isEditMode: PropTypes.bool,
  token: PropTypes.shape().isRequired,
};

ItemRow.defaultProps = {
  isEditMode: false,
  removeItem: () => { }
};

export default withFormsy(ItemRow);
