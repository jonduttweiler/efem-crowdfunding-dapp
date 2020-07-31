import BigNumber from 'bignumber.js';
import { getStartOfDayUTC, cleanIpfsPath } from 'lib/helpers';
import BasicModel from './BasicModel';
import MilestoneItemModel from './MilestoneItem';

/**
 * The DApp Milestone model
 */
export default class Milestone extends BasicModel {
  constructor(data = {}) {
    super(data);

    const {
      //maxAmount = '0',
      selectedFiatType = 'USD',
      //fiatAmount = new BigNumber('0'),
      //fiatAmountTarget = new BigNumber('0'),
      fiatAmountTarget,
      recipientAddress = '',
      status = Milestone.IN_PROGRESS,
      projectId = undefined,
      reviewerAddress = '',
      items = [],
      date = getStartOfDayUTC().subtract(1, 'd'),
      confirmations = 0,
      requiredConfirmations = 6,
      commitTime,
      campaignId,
      token,

      // transient
      campaign,
      owner,
      campaignReviewer,
      recipient,
      reviewer,
      mined = false,
      pluginAddress = '0x0000000000000000000000000000000000000000',
      conversionRateTimestamp,
      clientId,
      imageUrl,
      manager
    } = data;

    this.clientId = clientId || null;
    this._selectedFiatType = selectedFiatType;
    //this._maxAmount = utils.fromWei(maxAmount);
    //this._fiatAmount = new BigNumber(fiatAmount);
    this._fiatAmountTarget = fiatAmountTarget;
    this._recipientAddress = recipientAddress;
    this._status = status;
    this._projectId = projectId;
    this._reviewerAddress = reviewerAddress;
    this._items = items.map(i => new MilestoneItemModel(i));
    this._itemizeState = items && items.length > 0;
    this._date = getStartOfDayUTC(date);
    this._confirmations = confirmations;
    this._requiredConfirmations = requiredConfirmations;
    this._commitTime = commitTime;
    this._campaignId = campaignId;
    this._pluginAddress = pluginAddress;
    this._token = token;
    this._conversionRateTimestamp = conversionRateTimestamp;
    this.imageUrl = imageUrl;

    // transient
    this._campaign = campaign;
    this._owner = owner;
    this._campaignReviewer = campaignReviewer;
    this._recipient = recipient;
    this._reviewer = reviewer;
    this._mined = mined;

    // Nuevos
    //this.campaign = campaign;
    this.manager = manager;
  }

  toIpfs() {
    return {
      title: this._title,
      description: this._description,
      image: cleanIpfsPath(this._image),
      items: this._items.map(i => i.toIpfs()),
      conversionRateTimestamp: this._conversionRateTimestamp,
      //selectedFiatType: this._selectedFiatType,
      date: this._date,
      //fiatAmount: this._fiatAmount.toString(),
      fiatAmountTarget: this._fiatAmountTarget.toString(),
      conversionRate: this._conversionRate,
      version: 1,
    };
  }

  toFeathers() {
    return {
      title: this._title,
      description: this._description,
      image: cleanIpfsPath(this._image),
      ownerAddress: this._ownerAddress,
      reviewerAddress: this._reviewerAddress,
      recipientAddress: this._recipientAddress,
      campaignReviewerAddress: this._campaignReviewerAddress,
      campaignId: this._campaignId,
      status: this._status,
      selectedFiatType: this._selectedFiatType,
      date: this._date,
      //fiatAmount: this._fiatAmount.toString(),
      fiatAmountTarget: this._fiatAmountTarget.toString(),
      token: this._token,
    };
  }

  /**
    get & setters
  * */

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

  static get type() {
    return 'milestone';
  }

  // eslint-disable-next-line class-methods-use-this
  get type() {
    return Milestone.type;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this.checkType(value, ['string'], 'title');
    this._title = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this.checkType(value, ['string'], 'description');
    this._description = value;
  }

  get image() {
    return this._image;
  }

  set image(value) {
    this.checkType(value, ['string'], 'image');
    this._image = value;
  }

  /*get maxAmount() {
    // max amount is not stored in wei
    if (this.itemizeState) {
      return this.items
        .reduce(
          (accumulator, item) => accumulator.plus(new BigNumber(utils.fromWei(item.wei))),
          new BigNumber(0),
        )
        .toFixed();
    }

    return this._maxAmount;
  }*/

  /*set maxAmount(value) {
    this.checkType(value, ['string'], 'maxAmount');
    this._maxAmount = value;
  }*/

  get selectedFiatType() {
    return this._selectedFiatType;
  }

  set selectedFiatType(value) {
    this.checkType(value, ['string'], 'selectedFiatType');
    this._selectedFiatType = value;
  }

  get token() {
    return this._token;
  }

  set token(value) {
    this.checkType(value, ['object'], 'token');
    this._token = value;
  }

  get fiatAmountTarget() {
    return this._fiatAmountTarget;
  }

  set fiatAmountTarget(value) {
    this.checkInstanceOf(value, BigNumber, 'fiatAmountTarget');
    this._fiatAmountTarget = value;
  }

  /*get fiatAmount() {
    return this._fiatAmount;
  }

  set fiatAmount(value) {
    this.checkInstanceOf(value, BigNumber, 'fiatAmount');
    this._fiatAmount = value;
  }*/

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

  get campaignTitle() {
    return this._campaignTitle;
  }

  set campaignTitle(value) {
    this.checkType(value, ['string'], 'campaignTitle');
    this._campaignTitle = value;
  }

  get projectId() {
    return this._projectId;
  }

  set projectId(value) {
    this.checkType(value, ['string'], 'projectId');
    this._projectId = value;
  }

  get reviewerAddress() {
    return this._reviewerAddress;
  }

  set reviewerAddress(value) {
    this.checkType(value, ['string'], 'reviewerAddress');
    this._reviewerAddress = value;
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

  get confirmations() {
    return this._confirmations;
  }

  set confirmations(value) {
    this.checkType(value, ['number'], 'confirmations');
    this._confirmations = value;
  }

  get requiredConfirmations() {
    return this._requiredConfirmations;
  }

  set requiredConfirmations(value) {
    this.checkType(value, ['number'], 'requiredConfirmations');
    this._requiredConfirmations = value;
  }

  get commitTime() {
    return this._commitTime;
  }

  set commitTime(value) {
    this.checkType(value, ['number'], 'commitTime');
    this._commitTime = value;
  }

  get currentBalance() {
    if (Array.isArray(this._donationCounters) && this._donationCounters.length > 0) {
      return this._donationCounters[0].currentBalance;
    }
    return new BigNumber('0');
  }

  get mined() {
    return this._mined;
  }

  set mined(value) {
    this.checkType(value, ['boolean'], 'mined');
    this._mined = value;
  }

  get pluginAddress() {
    return this._pluginAddress;
  }

  set pluginAddress(value) {
    this.checkType(value, ['string'], 'pluginAddress');
    this._pluginAddress = value;
  }

  // transient
  get campaign() {
    return this._campaign;
  }

  get owner() {
    return this._owner;
  }

  get reviewer() {
    return this._reviewer;
  }

  get campaignReviewer() {
    return this._campaignReviewer;
  }

  get recipient() {
    return this._recipient;
  }

  set campaignId(value) {
    this.checkType(value, ['string'], 'campaignId');
    this._campaignId = value;
  }

  get campaignId() {
    return this._campaignId;
  }

  /*getCampaignId() {
    return this._campaignId;
  }*/

  set conversionRateTimestamp(value) {
    this._conversionRateTimestamp = value;
  }

  get conversionRateTimestamp() {
    return this._conversionRateTimestamp;
  }

  set conversionRate(value) {
    this.checkType(value, ['number'], 'conversionRate');
    this._conversionRate = value;
  }

  get conversionRate() {
    return this._conversionRate;
  }

  set campaignReviewerAddress(value) {
    this.checkType(value, ['string'], 'campaignReviewerAddress');
    this._campaignReviewerAddress = value;
  }

  get campaignReviewerAddress() {
    return this._campaignReviewerAddress;
  }
}
