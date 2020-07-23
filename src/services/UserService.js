import { feathersClient } from '../lib/feathersClient';

import ErrorPopup from '../components/ErrorPopup';
import IpfsService from './IpfsService';

const users = feathersClient.service('users');

class UserService {
  /**
   * Save new user profile to the blockchain or update existing one in feathers
   *
   * @param user        User object to be saved
   * @param afterSave   Callback to be triggered after the user is saved in feathers
   */
  static async save(user, afterSave = () => {}) {
    try {
      user.profileHash = await IpfsService.upload(user.toIpfs());
    } catch (err) {
      ErrorPopup('Failed to upload profile to ipfs');
    }
    try {
      await users.patch(user.address, user.toFeathers());

      afterSave();
    } catch (err) {
      ErrorPopup(
        'There has been a problem creating your user profile. Please refresh the page and try again.',
      );
    }
  }
}

export default UserService;
