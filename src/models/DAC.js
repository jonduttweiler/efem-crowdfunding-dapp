import Entity from './Entity';

/**
 * The DApp DAC model
 */
class DAC extends Entity {

  constructor(data = {}) {
    super(data); 
  
    const {
      communityUrl = '',
      status = DAC.ACTIVE,
      delegateAddress = '',
      requiredConfirmations = '',
      commitTime = '',
    } = data;

    this._communityUrl = communityUrl;
    this._status = status;
    this._delegateAddress = delegateAddress;
    this._requiredConfirmations = requiredConfirmations;
    this._commitTime = data.commitTime ;
    this._delegateId = delegateAddress;

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
    return 'dac';
  }

  get type() {
    return DAC.type;
  }

  get isActive() {
    return this.status === DAC.ACTIVE;
  }

  get isPending() {
    return this.status === DAC.PENDING;
  }


  get communityUrl() {
    return this._communityUrl;
  }

  set communityUrl(value) {
    this.checkType(value, ['string'], 'communityUrl');
    this._communityUrl = value;
  }


  get delegateAddress() {
    return this._delegateAddress;
  }
  
  get delegateId() {
    return this._delegateId;
  }

  set delegateId(value) {
    this.checkType(value, ['number', 'string'], 'delegateId');
    this._delegateId = value;
  }

  get commitTime() {
    return this._commitTime;
  }

  set commitTime(value) {
    this.checkType(value, ['number'], 'commitTime');
    this._commitTime = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this.checkValue(value, [DAC.PENDING, DAC.ACTIVE, DAC.CANCELED], 'status');
    this._status = value;
    if (value === DAC.PENDING) this.myOrder = 1;
    else if (value === DAC.ACTIVE) this.myOrder = 2;
    else if (value === DAC.CANCELED) this.myOrder = 3;
    else this.myOrder = 4;
  }
}

export default DAC;
