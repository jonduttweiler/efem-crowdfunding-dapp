import Model from './Model';
import { cleanIpfsPath } from '../lib/helpers';
import BigNumber from 'bignumber.js';

import {
  CREATE_DAC_ROLE,
  CREATE_CAMPAIGN_ROLE,
  CREATE_MILESTONE_ROLE,
  REVIEW_CAMPAIGN_ROLE,
  REVIEW_MILESTONE_ROLE
} from '../constants/Role';

/**
 * Modelo de User en Dapp.
 *
 * @attribute address       Ethereum address of the user
 * @attribute balance       Balance de la cuenta del usuario medida en Wei.
 * @attribute avatar        URL to user avatar
 * @attribute commitTime
 * @attribute email         Email address of the user
 * @attribute giverId       Giver ID used for querying donations
 * @attribute linkedin      Link to the linkedin profile
 * @attribute name          Name of the user
 * @attribute url           Url attached to LiquidPledging admin
 * @attribute authenticated If the user is authenticated w/ feathers
 */
class User extends Model {

  constructor(data = {}) {
    super(data);

    const {
      address = '',
      name = '',
      avatar = '',
      email = '',
      giverId,
      linkedin,
      url,
      roles = [],
      balance = new BigNumber(0),
      authenticated = false,
      registered = false, //exists on mongodb?
    } = data;

    if (data) {
      this._address = address;
      this._name = name;
      this._avatar = avatar;
      this._email = email;
      this._giverId = giverId;
      this._linkedin = linkedin;
      this._url = url;
      this._roles = roles;
      this._balance = balance;
      this._authenticated = authenticated;
      this._registered = registered;
    }
  }

  toIpfs() {
    return {
      name: this._name,
      email: this._email,
      linkedin: this._linkedin,
      avatar: cleanIpfsPath(this._avatar),
      version: 1,
    };
  }

  toFeathers(txHash) {
    const user = {
      name: this._name,
      email: this._email,
      linkedin: this._linkedin,
      avatar: cleanIpfsPath(this._avatar),
    };
    if (this._giverId === undefined && txHash) {
      // set to 0 so we don't attempt to create multiple givers in lp for the same user
      user._giverId = 0;
      user._txHash = txHash;
    }
    return user;
  }

  // eslint-disable-next-line class-methods-use-this
  get type() {
    return 'giver';
  }

  get id() {
    return this._address;
  }

  get address() {
    return this._address;
  }

  set address(value) {
    this.checkType(value, ['undefined', 'string'], 'address');
    this._address = value;
  }

  get avatar() {
    return this._avatar;
  }

  set avatar(value) {
    this.checkType(value, ['undefined', 'string'], 'avatar');
    this._avatar = value;
  }

  set newAvatar(value) {
    this.checkType(value, ['string'], 'newAvatar');
    this._newAvatar = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this.checkType(value, ['undefined', 'string'], 'email');
    this._email = value;
  }

  get giverId() {
    return this._giverId;
  }

  set giverId(value) {
    this.checkType(value, ['undefined', 'number'], 'giverId');
    this._giverId = value;
  }

  get linkedin() {
    return this._linkedin;
  }

  set linkedin(value) {
    this.checkType(value, ['undefined', 'string'], 'linkedin');
    this._linkedin = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this.checkType(value, ['undefined', 'string'], 'name');
    this._name = value;
  }

  get url() {
    return this._url;
  }

  set url(value) {
    this.checkType(value, ['undefined', 'string'], 'url');
    this._url = value;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(value) {
    this.checkType(value, ['undefined', 'string'], 'updatedAt');
    this._updatedAt = value;
  }

  get authenticated() {
    return this._authenticated;
  }

  set authenticated(value) {
    this.checkType(value, ['boolean'], 'authenticated');
    this._authenticated = value;
  }

  get registered() {
    return this._registered;
  }

  set registered(value) {
    this.checkType(value, ['boolean'], 'registered');
    this._registered = value;
  }
  get roles() {
    return this._roles;
  }

  set roles(value) {
    this._roles = value;
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this.checkInstanceOf(value, BigNumber, 'balance');
    this._balance = value;
  }

  isDelegate() {
    return this.roles.includes(CREATE_DAC_ROLE);
  }
  isCampaignManager() {
    return this.roles.includes(CREATE_CAMPAIGN_ROLE);
  }
  isMilestoneManager() {
    return this.roles.includes(CREATE_MILESTONE_ROLE);
  }
  isCampaignReviewer() {
    return this.roles.includes(REVIEW_CAMPAIGN_ROLE);
  }
  isMilestoneReviewer() {
    return this.roles.includes(REVIEW_MILESTONE_ROLE);
  }
}

export default User;
