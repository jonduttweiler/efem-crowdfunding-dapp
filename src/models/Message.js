import Model from './Model';

/**
 * Severidad de un mensaje
 */
export const Severity = {
  INFO: 'Info',
  SUCCESS: 'Success',
  WARN: 'Warn',
  ERROR: 'Error'
}

/**
 * Representa un mensaje en la Dapp.
 */
class Message extends Model {

  constructor({
    clientId,
    title,
    text = '',
    severity = Severity.INFO,
  } = {}) {
    super();
    this._clientId = clientId;
    this._title = title;
    this._text = text;
    this._severity = severity;
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this.checkType(value, ['string'], 'clientId');
    this._clientId = value;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this.checkType(value, ['string'], 'title');
    this._title = value;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this.checkType(value, ['string'], 'text');
    this._text = value;
  }

  get severity() {
    return this._severity;
  }

  set severity(value) {
    this._severity = value;
  }
}

export default Message;
