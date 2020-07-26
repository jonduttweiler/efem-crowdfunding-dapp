import { feathersClient } from '../lib/feathersClient';

import ErrorPopup from '../components/ErrorPopup';
import IpfsService from './IpfsService';

import { ALL_ROLES } from '../constants/Role';
import CrowdfundingContractApi from '../lib/blockchain/CrowdfundingContractApi';

const crowdfundingContractApi = new CrowdfundingContractApi();
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

  //Checks in the smart contract for which roles can peform a user
  //TODO: implement cache
  static async getRoles(address){

    const userRoles = [];

    for(const rol of ALL_ROLES){
      const canPerform = await crowdfundingContractApi.canPerformRole(address,rol);
      if(canPerform) {
        userRoles.push(rol);
      }
    }

    return userRoles;
  }


}

export default UserService;
