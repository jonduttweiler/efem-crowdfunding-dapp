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
    createdTitle,
    createdSubtitle,
    pendingTitle,
    confirmedTitle,
    confirmedDescription,
    status = Transaction.CREATED.toStore(),
  } = {}) {
    super();
    this._clientId = clientId;
    this._hash = hash;
    this._gasEstimated = gasEstimated;
    this._gasPrice = gasPrice;
    this._submittedTime = submittedTime;
    this._createdTitle = createdTitle;
    this._createdSubtitle = createdSubtitle;
    this._pendingTitle = pendingTitle;
    this._confirmedTitle = confirmedTitle;
    this._confirmedDescription = confirmedDescription;
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
      createdTitle: this._createdTitle,
      createdSubtitle: this._createdSubtitle,
      pendingTitle: this._pendingTitle,
      confirmedTitle: this._confirmedTitle,
      confirmedDescription: this._confirmedDescription,
      status: this._status.toStore()
    };
  }

  submitted(hash) {
    this.hash = hash;
    this.status = Transaction.PENDING;
    this.submittedTime = Date.now();
  }

  confirmed() {
    this.status = Transaction.CONFIRMED;
  }

  rejected() {
    this.status = Transaction.REJECTED;
  }

  static get CREATED() {
    return StatusUtils.build('Created', true);
  }

  static get PENDING() {
    return StatusUtils.build('Pending', true);
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

  get isConfirmed() {
    return this.status.name === Transaction.CONFIRMED.name;
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

  get createdTitle() {
    return this._createdTitle;
  }

  set createdTitle(value) {
    this._createdTitle = value;
  }
  
  get createdSubtitle() {
    return this._createdSubtitle;
  }

  set createdSubtitle(value) {
    this._createdSubtitle = value;
  }

  get pendingTitle() {
    return this._pendingTitle;
  }

  set pendingTitle(value) {
    this._pendingTitle = value;
  }

  get confirmedTitle() {
    return this._confirmedTitle;
  }

  set confirmedTitle(value) {
    this._confirmedTitle = value;
  }

  get confirmedDescription() {
    return this._confirmedDescription;
  }

  set confirmedDescription(value) {
    this._confirmedDescription = value;
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
