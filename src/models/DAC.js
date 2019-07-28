/* eslint-disable import/no-cycle */
import BasicModel from './BasicModel';
import DACService from '../services/DACService';
import IPFSService from '../services/IPFSService';
import ErrorPopup from '../components/ErrorPopup';
import { cleanIpfsPath } from '../lib/helpers';

/**
 * The DApp DAC model
 */
class DAC extends BasicModel {
  static get CANCELED() {
    return 'Canceled';
  }

  static get ACTIVE() {
    return 'Active';
  }

  static get type() {
    return 'dac';
  }

  // eslint-disable-next-line class-methods-use-this
  get type() {
    return DAC.type;
  }

  constructor(data) {
    super(data);

    this.communityUrl = data.communityUrl || '';
    this.status = data.status || DAC.Active;
    this.ownerAddress = data.ownerAddress;
    this.requiredConfirmations = data.requiredConfirmations;
    this.commitTime = data.commitTime || 0;
  }

  toIpfs() {
    return {
      title: this.title,
      description: this.description,
      communityUrl: this.communityUrl,
      image: cleanIpfsPath(this.image),
      version: 1,
    };
  }

  toFeathers(txHash) {
    const dac = {
      title: this.title,
      description: this.description,
      communityUrl: this.communityUrl,
      image: cleanIpfsPath(this.image),
      totalDonated: this.totalDonated,
      donationCount: this.donationCount,
    };
    return dac;
  }

  save(afterSave) {
    if (this.newImage) {
      IPFSService.upload(this.image)
        .then(hash => {
          // Save the new image address and mark it as old
          this.image = hash;
          this.newImage = false;
        })
        .catch(err => ErrorPopup('Failed to upload image', err))
        .finally(() => DACService.save(this, this.owner.address, afterSave));
    } else {
      DACService.save(this, this.owner.address, afterSave);
    }
  }

  get communityUrl() {
    return this.myCommunityUrl;
  }

  set communityUrl(value) {
    this.checkType(value, ['string'], 'communityUrl');
    this.myCommunityUrl = value;
  }

  get delegateId() {
    return this.myDelegateId;
  }

  set delegateId(value) {
    this.checkType(value, ['number', 'string'], 'delegateId');
    this.myDelegateId = value;
  }

  get commitTime() {
    return this.myCommitTime;
  }

  set commitTime(value) {
    this.checkType(value, ['number'], 'commitTime');
    this.myCommitTime = value;
  }

  get status() {
    return this.myStatus;
  }

  set status(value) {
    this.checkValue(value, [DAC.PENDING, DAC.ACTIVE, DAC.CANCELED], 'status');
    this.myStatus = value;
    if (value === DAC.PENDING) this.myOrder = 1;
    else if (value === DAC.ACTIVE) this.myOrder = 2;
    else if (value === DAC.CANCELED) this.myOrder = 3;
    else this.myOrder = 4;
  }
}

export default DAC;
