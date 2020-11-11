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
    submittedTime,
    createdTitleKey,
    createdSubtitleKey,
    submittedTitleKey,
    status = Transaction.CREATED.toStore(),
  } = {}) {
    super();
    this._clientId = clientId;
    this._hash = hash;
    this._gasEstimated = gasEstimated;
    this._gasPrice = gasPrice;
    this._submittedTime = submittedTime;
    this._createdTitleKey = createdTitleKey;
    this._createdSubtitleKey = createdSubtitleKey;
    this._submittedTitleKey = submittedTitleKey;
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
      submittedTime: this._submittedTime,
      createdTitleKey: this._createdTitleKey,
      createdSubtitleKey: this._createdSubtitleKey,
      submittedTitleKey: this._submittedTitleKey,
      status: this._status.toStore()
    };
  }

  submitted(hash) {
    this.hash = hash;
    this.status = Transaction.SUBMITTED;
    this.submittedTime = Date.now();
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

  get submittedTime() {
    return this._submittedTime;
  }

  set submittedTime(value) {
    this._submittedTime = value;
  }

  get createdTitleKey() {
    return this._createdTitleKey;
  }

  set createdTitleKey(value) {
    this._createdTitleKey = value;
  }
  
  get createdSubtitleKey() {
    return this._createdSubtitleKey;
  }

  set createdSubtitleKey(value) {
    this._createdSubtitleKey = value;
  }

  get submittedTitleKey() {
    return this._submittedTitleKey;
  }

  set submittedTitleKey(value) {
    this._submittedTitleKey = value;
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
