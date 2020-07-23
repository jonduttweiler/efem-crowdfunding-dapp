import config from '../configuration';
import ImageTools from '../lib/ImageResizer';

const isIPFS = require('is-ipfs');
const rp = require('request-promise');
const url = require('url');

class IpfsService {
  /**
   * Upload a json object or Blob to ipfs
   *
   * @param {object|Blob|string} obj Object/Blob to upload to ipfsGateway. The only valid string is a base64 encoded image.
   */
  static upload(obj) {
    const { ipfsGateway } = config;
    if (!ipfsGateway || ipfsGateway === '') {
      console.log('not uploading to ipfs. missing ipfsGateway url');
      return Promise.resolve();
    }

    let body;
    if (typeof obj === 'string') {
      if (!ImageTools.isImage(obj)) {
        throw new Error('Cant upload string to ipfs');
      }
      body = ImageTools.toBlob(obj);
    } else {
      body =
        obj instanceof Blob ? obj : new Blob([JSON.stringify(obj)], { type: 'application/json' });
    }

    return fetch(`${ipfsGateway}`, {
      method: 'POST',
      body,
    }).then(res => {
      if (res.ok) return `/ipfs/${res.headers.get('Ipfs-Hash')}`;
      throw new Error('IPFS upload unsuccessful', res);
    });
  }

  static resolveUrl(path) {
    const { ipfsGateway } = config;
    if (!isIPFS.path(path)) throw new Error(`${path} is not a valid ipfs path`);
    return url.resolve(ipfsGateway, path);
  }
  
  static download(path) {
    const { ipfsGateway } = config;
    if (!isIPFS.path(path)) throw new Error(`${path} is not a valid ipfs path`);
    return rp({
      uri: url.resolve(ipfsGateway, path),
      json: true,
    });
  }
}

export default IpfsService;
