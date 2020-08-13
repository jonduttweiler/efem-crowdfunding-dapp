import Entity from './Entity';
import BigNumber from 'bignumber.js';
import { getStartOfDayUTC } from 'lib/helpers';
import MilestoneItemModel from './MilestoneItem';
import StatusUtils from '../utils/StatusUtils';
import Status from './Status';

/**
 * Modelo Milestone de Dapp.
 */
export default class Milestone extends Entity {
  constructor(data = {}) {
    super(data);
    const {
      campaignId,
      fiatType = 'USD',
      fiatAmountTarget = new BigNumber(),
      managerAddress = '',
      reviewerAddress = '',
      campaignReviewerAddress,
      recipientAddress = '',
      status = Milestone.PENDING,
      items = [],
      date = getStartOfDayUTC().subtract(1, 'd')
    } = data;
    this._campaignId = campaignId;
    this._fiatType = fiatType;
    this._fiatAmountTarget = fiatAmountTarget;
    this._managerAddress = managerAddress;
    this._reviewerAddress = reviewerAddress;
    this._recipientAddress = recipientAddress;
    this._campaignReviewerAddress = campaignReviewerAddress;
    this._status = status;

    // TODO Revisar
    this._items = items.map(i => new MilestoneItemModel(i));
    this._itemizeState = items && items.length > 0;
    this._date = getStartOfDayUTC(date);
  }

  /**
   * Determina si el usuario es el manager del Milestone.
   * 
   * @param user a determinar si es el manager del milestone.
   */
  isManager(user) {
    return user && user.address === this.managerAddress;
  }

  /**
   * Determina si el usuario es el recipient del Milestone.
   * 
   * @param user a determinar si es el recipient del milestone.
   */
  isRecipient(user) {
    return user && user.address === this.recipientAddress;
  }

  static get PENDING() {
    return StatusUtils.build('Pending', true);
  }

  static get ACTIVE() {
    return StatusUtils.build('Active');
  }

  static get CANCELLED() {
    return StatusUtils.build('Cancelled');
  }

  static get COMPLETED() {
    return StatusUtils.build('Completed');
  }

  static get APPROVED() {
    return StatusUtils.build('Approved');
  }

  static get REJECTED() {
    return StatusUtils.build('Rejected');
  }

  static get PAYING() {
    return StatusUtils.build('Paying', true);
  }

  static get PAID() {
    return StatusUtils.build('Paid');
  }

  get isPending() {
    return this.status.name === Milestone.PENDING.name;
  }

  get isActive() {
    return this.status.name === Milestone.ACTIVE.name;
  }

  get isCompleted() {
    return this.status.name === Milestone.COMPLETED.name;
  }

  get isApproved() {
    return this.status.name === Milestone.APPROVED.name;
  }

  static get type() {
    return 'milestone';
  }

  // eslint-disable-next-line class-methods-use-this
  get type() {
    return Milestone.type;
  }

  get campaignId() {
    return this._campaignId;
  }

  set campaignId(value) {
    this.checkType(value, ['number'], 'campaignId');
    this._campaignId = value;
  }

  get fiatType() {
    return this._fiatType;
  }

  set fiatType(value) {
    this.checkType(value, ['string'], 'fiatType');
    this._fiatType = value;
  }

  get fiatAmountTarget() {
    return this._fiatAmountTarget;
  }

  set fiatAmountTarget(value) {
    this.checkInstanceOf(value, BigNumber, 'fiatAmountTarget');
    this._fiatAmountTarget = value;
  }

  get managerAddress() {
    return this._managerAddress;
  }

  set managerAddress(value) {
    this.checkType(value, ['string'], 'managerAddress');
    this._managerAddress = value;
  }

  get reviewerAddress() {
    return this._reviewerAddress;
  }

  set reviewerAddress(value) {
    this.checkType(value, ['string'], 'reviewerAddress');
    this._reviewerAddress = value;
  }

  get campaignReviewerAddress() {
    return this._campaignReviewerAddress;
  }

  set campaignReviewerAddress(value) {
    this.checkType(value, ['string'], 'campaignReviewerAddress');
    this._campaignReviewerAddress = value;
  }

  get recipientAddress() {
    return this._recipientAddress;
  }

  set recipientAddress(value) {
    this.checkType(value, ['string'], 'recipientAddress');
    this._recipientAddress = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this.checkInstanceOf(value, Status, 'status');
    this._status = value;
  }

  get items() {
    return this._items;
  }

  set items(value) {
    value.forEach(item => {
      this.checkInstanceOf(item, MilestoneItemModel, 'items');
    });
    this._items = value;
  }

  get itemizeState() {
    return this._itemizeState;
  }

  set itemizeState(value) {
    this.checkType(value, ['boolean'], 'itemizeState');
    this._itemizeState = value;
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this.checkIsMoment(value, 'date');
    this._date = value;
  }

  /**
   * Determina si la entidad recibe fondos o no.
   */
  get receiveFunds() {
    return this.isActive || this.isCompleted || this.isApproved;
  }
}
