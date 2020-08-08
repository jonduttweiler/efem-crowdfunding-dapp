import Model from './Model';
import { cleanIpfsPath } from '../lib/helpers';
import IpfsService from '../services/IpfsService';

/**
 * Base de DAC, Milestone y Campaign.
 */
class Entity extends Model {

  constructor({
    id,
    clientId,
    title = '',
    description = '',
    url = '',
    image = '',
    // TODO Configurar una imágen adecuada por defecto.
    imageCid = '/ipfs/QmVmEhSg7juZjL3MAdhTSfaK4Q4E8mBnSXhawPgfxD3Pcz',
    donationIds = [],
    createdAt,
  } = {}) {
    super();

    this._id = id;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
    this._title = title;
    this._description = description;
    this._url = url;
    this._image = image;
    this._imageCid = imageCid;
    this._donationIds = donationIds;
    this._createdAt = createdAt;
  }

  toIpfs() {
    return {
      title: this._title,
      description: this._description,
      url: this._url,
      imageCid: cleanIpfsPath(this._imageCid)
    };
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this.checkType(value, ['undefined', 'number'], 'id');
    this._id = value;
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this.checkType(value, ['undefined', 'string'], 'clientId');
    this._clientId = value;
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

  get url() {
    return this._url;
  }

  set url(value) {
    this.checkType(value, ['undefined', 'string'], 'url');
    this._url = value;
  }

  get image() {
    return this._image;
  }

  set image(value) {
    this.checkType(value, ['string'], 'image');
    this._image = value;
  }

  get imageCid() {
    return this._imageCid;
  }

  set imageCid(value) {
    this.checkType(value, ['string'], 'imageCid');
    this._imageCid = value;
  }

  /**
   * Obtiene la URL completa de la imagen.
   */
  get imageCidUrl() {
    return IpfsService.resolveUrl(this._imageCid)
  }

  get txHash() {
    return this._txHash;
  }

  set txHash(value) {
    this.checkType(value, ['undefined', 'string'], 'txHash');
    this._txHash = value;
  }

  get donationIds() {
    return this._donationIds;
  }

  set donationIds(value) {
    this._donationIds = value;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    this._createdAt = value;
  }

  /**
   * Obtiene la cantidad de donaciones a la entidad.
   */
  get donationsCount() {
    return this._donationIds.length;
  }
}

export default Entity;
