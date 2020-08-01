import Entity from './Entity';
import BigNumber from 'bignumber.js';
import { getStartOfDayUTC } from 'lib/helpers';
import MilestoneItemModel from './MilestoneItem';

/**
 * Modelo Milestone de Dapp.
 */
export default class Milestone extends Entity {
  constructor(data = {}) {
    super(data);
    const {
      campaignId,
      fiatType = 'USD',
      fiatAmountTarget,
      managerAddress = '',
      reviewerAddress = '',
      campaignReviewerAddress,
      recipientAddress = '',
      status = Milestone.IN_PROGRESS,
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

  static get PROPOSED() {
    return Milestone.statuses.PROPOSED;
  }

  static get ACTIVE() {
    return Milestone.statuses.ACTIVE;
  }

  static get REJECTED() {
    return Milestone.statuses.REJECTED;
  }

  static get PENDING() {
    return Milestone.statuses.PENDING;
  }

  static get IN_PROGRESS() {
    return Milestone.statuses.IN_PROGRESS;
  }

  static get NEEDS_REVIEW() {
    return Milestone.statuses.NEEDS_REVIEW;
  }

  static get COMPLETED() {
    return Milestone.statuses.COMPLETED;
  }

  static get CANCELED() {
    return Milestone.statuses.CANCELED;
  }

  static get PAYING() {
    return Milestone.statuses.PAYING;
  }

  static get PAID() {
    return Milestone.statuses.PAID;
  }

  static get FAILED() {
    return Milestone.statuses.FAILED;
  }

  static get statuses() {
    return {
      ACTIVE: 'Active',
      PROPOSED: 'Proposed',
      REJECTED: 'Rejected',
      PENDING: 'Pending',
      IN_PROGRESS: 'InProgress',
      NEEDS_REVIEW: 'NeedsReview',
      COMPLETED: 'Completed',
      CANCELED: 'Canceled',
      PAYING: 'Paying',
      PAID: 'Paid',
      FAILED: 'Failed',
    };
  }

  get isPending() {
    return this.status === Milestone.PENDING;
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
    this.checkType(value, ['string'], 'campaignId');
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
    this.checkValue(value, Object.values(Milestone.statuses), 'status');
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
}
