import { feathersClient } from '../lib/feathersClient';

import ErrorPopup from '../components/ErrorPopup';
import IpfsService from './IpfsService';

const users = feathersClient.service('users');

class UserService {

  loadUser(user) {

    return new Observable(subscriber => {

      try {

        // Se carga la cuenta del usuario desde la wallet
        const account = await walletApi.getAccount();
        user.account = account;
        subscriber.next(user);

        if (user.account.address) {

          // Se carga la información del usuario desde Feathers
          const info = await feathersApi.getUserInfo(user.account.address);
          user.name = info.name;
          user.email = info.email;
          // . . .
          subscriber.next(user);

          // Se cargan los roles del usuario desde el smart constract
          const roles = await crowdfundingContractApi.getRoles(user.account.address);
          user.roles = roles;
          subscriber.next(user);
        }

      } catch (e) {
        subscriber.error(e);
      }
    });
  }

  /**
   * Save new user profile to the blockchain or update existing one in feathers
   *
   * @param user        User object to be saved
   * @param afterSave   Callback to be triggered after the user is saved in feathers
   */
  static async save(user, afterSave = () => { }) {
    try {
      user.profileHash = await IpfsService.upload(user.toIpfs());
    } catch (err) {
      ErrorPopup('Failed to upload profile to ipfs');
    }
    try {
      await users.patch(user.address, user.toFeathers());

      afterSave();
    } catch (err) {
      console.error('Error creando perfil de usuario', err);
      ErrorPopup(
        'There has been a problem creating your user profile. Please refresh the page and try again.',
      );
    }
  }

}

export default UserService;
