import { feathersClient } from '../lib/feathersClient';
import ErrorPopup from '../components/ErrorPopup';
import IpfsService from './IpfsService';
import WalletApi from '../lib/blockchain/WalletApi';
import CrowdfundingContractApi from '../lib/blockchain/CrowdfundingContractApi';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';

const walletApi = new WalletApi();
const crowdfundingContractApi = new CrowdfundingContractApi();


class UserService {

  loadUser(user) {

    return new Observable(async subscriber => {

      try {
        // Se carga la cuenta del usuario desde la wallet
        let address = await walletApi.getAccountAddress();
        user.address = address;
        subscriber.next(user);

        if (address) {

          // Se obtiene el balance del usuario.
          let balance = await walletApi.getBalance(address);
          user.balance = new BigNumber(balance);
          subscriber.next(user);

          feathersClient.service('/users').get(address).then(userdata => {
            const { name, email, avatar } = userdata;
            user.name = name;
            user.email = email;
            user.avatar = avatar;
            subscriber.next(user);
          });

          // Se cargan los roles del usuario desde el smart constract
          crowdfundingContractApi.getRoles(address).then(roles => {
            user.roles = roles;
            subscriber.next(user);
          });
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
    /*    try {
         user.profileHash = await IpfsService.upload(user.toIpfs());
       } catch (err) {
         ErrorPopup('Failed to upload profile to ipfs');
       }
       try {
         await feathersClient.service('/users').patch(user.address, user.toFeathers());
   
         afterSave();
       } catch (err) {
         console.error('Error creando perfil de usuario', err);
         ErrorPopup(
           'There has been a problem creating your user profile. Please refresh the page and try again.',
         );
       } */
  }

}

export default UserService;
