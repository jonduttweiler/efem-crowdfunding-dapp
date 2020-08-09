import Entity from './Entity';
import CampaignService from '../services/CampaignService';

/**
 * The DApp Campaign model
 */
class Campaign extends Entity {

  constructor(data = {}) {
    super(data);
    const {
      dacIds = [],
      managerAddress = '',
      reviewerAddress = '',
      status = Campaign.ACTIVE
    } = data;
    this._dacIds = dacIds;
    this._managerAddress = managerAddress;
    this._reviewerAddress = reviewerAddress;
    this._status = status;
  }

  static get CANCELED() {
    return 'Canceled';
  }

  static get ACTIVE() {
    return 'Active';
  }

  static get PENDING() {
    return 'Pending';
  }

  static get type() {
    return 'campaign';
  }

  get type() {
    return Campaign.type;
  }

  get isActive() {
    return this.status === Campaign.ACTIVE;
  }

  get isPending() {
    return this.status === Campaign.PENDING;
  }

  /**
   * Cancel the campaign in feathers and blockchain
   *
   * @param from        Either the owner or reviewer. Whoever is canceling the campaign
   * @param afterCreate Callback function once a transaction is created
   * @param afterMined  Callback function once the transaction is mined and feathers updated
   */
  cancel(from, afterCreate, afterMined) {
    CampaignService.cancel(this, from, afterCreate, afterMined);
  }

  get dacIds() {
    return this._dacIds;
  }

  set dacIds(value) {
    this._dacIds = value;
  }

  get managerAddress() {
    return this._managerAddress;
  }

  set managerAddress(value) {
    this.checkType(value, ['string', 'undefined'], 'managerAddress');
    this._managerAddress = value;
  }

  get reviewerAddress() {
    return this._reviewerAddress;
  }

  set reviewerAddress(value) {
    this.checkType(value, ['string', 'undefined'], 'reviewerAddress');
    this._reviewerAddress = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this.checkValue(value, [Campaign.PENDING, Campaign.ACTIVE, Campaign.CANCELED], 'status');
    this._status = value;
    if (value === Campaign.PENDING) this.myOrder = 1;
    else if (value === Campaign.ACTIVE) this.myOrder = 2;
    else if (value === Campaign.CANCELED) this.myOrder = 3;
    else this.myOrder = 4;
  }
}

export default Campaign;