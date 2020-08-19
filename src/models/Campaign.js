import Entity from './Entity';
import CampaignService from '../services/CampaignService';
import StatusUtils from '../utils/StatusUtils';
import Status from './Status';

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
      status = Campaign.PENDING.toStore()
    } = data;
    this._dacIds = dacIds;
    this._managerAddress = managerAddress;
    this._reviewerAddress = reviewerAddress;
    this._status = StatusUtils.build(status.name, status.isLocal);
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    let entityStore = super.toStore();
    return Object.assign(entityStore, {
      dacIds: this._dacIds,
      managerAddress: this._managerAddress,
      reviewerAddress: this._reviewerAddress,
      status: this._status.toStore()
    });
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

  static get FINISHED() {
    return StatusUtils.build('Finished');
  }

  static get type() {
    return 'campaign';
  }

  get type() {
    return Campaign.type;
  }

  get isActive() {
    return this.status.name === Campaign.ACTIVE.name;
  }

  get isPending() {
    return this.status.name === Campaign.PENDING.name;
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
    this.checkInstanceOf(value, Status, 'status');
    this._status = value;
  }

  /**
   * Determina si la entidad recibe fondos o no.
   */
  get receiveFunds() {
    return this.isActive;
  }
}

export default Campaign;