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
    pendingTitleKey,
    pendingSubtitleKey,
    status = Transaction.PENDING.toStore(),
  } = {}) {
    super();
    this._clientId = clientId;
    this._hash = hash;
    this._gasEstimated = gasEstimated;
    this._gasPrice = gasPrice;
    this._pendingTitleKey = pendingTitleKey;
    this._pendingSubtitleKey = pendingSubtitleKey;
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
      pendingTitleKey: this._pendingTitleKey,
      pendingSubtitleKey: this._pendingSubtitleKey,
      status: this._status.toStore()
    };
  }

  static get PENDING() {
    return StatusUtils.build('Pending', true);
  }

  get isPending() {
    return this.status.name === Transaction.PENDING.name;
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

  get pendingTitleKey() {
    return this._pendingTitleKey;
  }

  set pendingTitleKey(value) {
    this._pendingTitleKey = value;
  }
  
  get pendingSubtitleKey() {
    return this._pendingSubtitleKey;
  }

  set pendingSubtitleKey(value) {
    this._pendingSubtitleKey = value;
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
