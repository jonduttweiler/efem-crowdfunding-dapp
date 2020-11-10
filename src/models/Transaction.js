import { nanoid } from '@reduxjs/toolkit'
import Model from './Model';
import Status from './Status';
import StatusUtils from '../utils/StatusUtils';

/**
 * Representa una transacción en la blockchain de la Dapp.
 */
class Transaction extends Model {

  constructor({
    clientId = nanoid(),
    hash,
    gasEstimated,
    gasPrice,
    createTitleKey,
    createSubtitleKey,
    status = Transaction.CREATED.toStore(),
  } = {}) {
    super();
    this._clientId = clientId;
    this._hash = hash;
    this._gasEstimated = gasEstimated;
    this._gasPrice = gasPrice;
    this._createTitleKey = createTitleKey;
    this._createSubtitleKey = createSubtitleKey;
    this._status = StatusUtils.build(status.name, status.isLocal);
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      clientId: this._clientId,
      hash: this._hash,
      gasEstimated: this._gasEstimated,
      gasPrice: this._gasPrice,
      createTitleKey: this._createTitleKey,
      createSubtitleKey: this._createSubtitleKey,
      status: this._status.toStore()
    };
  }

  static get CREATED() {
    return StatusUtils.build('Created', true);
  }

  static get SUBMITTED() {
    return StatusUtils.build('Submitted', true);
  }

  static get CONFIRMED() {
    return StatusUtils.build('Confirmed');
  }

  static get REJECTED() {
    return StatusUtils.build('Rejected');
  }

  get isCreated() {
    return this.status.name === Transaction.CREATED.name;
  }

  get feeEstimated() {
    return this._gasEstimated.multipliedBy(this._gasPrice);
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this.checkType(value, ['string'], 'clientId');
    this._clientId = value;
  }

  get hash() {
    return this._hash;
  }

  set hash(value) {
    this.checkType(value, ['string'], 'hash');
    this._hash = value;
  }

  get gasEstimated() {
    return this._gasEstimated;
  }

  set gasEstimated(value) {
    this.checkType(value, ['string'], 'gasEstimated');
    this._gasEstimated = value;
  }

  get gasPrice() {
    return this._gasPrice;
  }

  set gasPrice(value) {
    this._gasPrice = value;
  }

  get createTitleKey() {
    return this._createTitleKey;
  }

  set createTitleKey(value) {
    this._createTitleKey = value;
  }
  
  get createSubtitleKey() {
    return this._createSubtitleKey;
  }

  set createSubtitleKey(value) {
    this._createSubtitleKey = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this.checkInstanceOf(value, Status, 'status');
    this._status = value;
  }
}

export default Transaction;
