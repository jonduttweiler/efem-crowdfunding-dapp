import { feathersClient } from '../lib/feathersClient';
import ErrorPopup from '../components/ErrorPopup';
import ipfsService from '../ipfs/IpfsService';
import walletApi from '../lib/blockchain/WalletApi';
import crowdfundingContractApi from '../lib/blockchain/CrowdfundingContractApi';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import User from '../models/User';
import { ALL_ROLES } from '../constants/Role';

class UserService {

  loadCurrentUser(currentUser) {

    return new Observable(async subscriber => {

      try {

        // Se carga la cuenta del usuario desde la wallet
        let address = await walletApi.getAccountAddress();
        currentUser.address = address;
        subscriber.next(currentUser);

        if (address) {
          // Se obtiene el balance del usuario.
          let balance = await walletApi.getBalance(address);
          currentUser.balance = new BigNumber(balance);
          subscriber.next(currentUser);

          feathersClient.service('/users').get(address).then(data => {
            const { name, email, avatar, url } = data;
            currentUser.registered = true;
            currentUser.name = name;
            currentUser.email = email;
            currentUser.avatar = avatar;
            currentUser.url = url;
            subscriber.next(currentUser);
          }).catch(err => {
            console.error('Error obteniendo datos del usuario desde Feathers.', err);
            if (err.code === 404) {
              currentUser.registered = false;
              subscriber.next(currentUser);
              return;
            }
          });

          // Se cargan los roles del usuario desde el smart constract
          getRoles(address).then(roles => {
            currentUser.roles = roles;
            subscriber.next(currentUser);
          });

          authenticateFeathers(currentUser).then(authenticated => {
            currentUser.authenticated = authenticated;
            subscriber.next(currentUser);
          });
        }
      } catch (err) {
        console.error('Error obteniendo datos del usuario.', err);
        subscriber.error(err);
      }
    });
  }

  /**
   * Save new user profile to the blockchain or update existing one in feathers
   * Al usuario lo está guardando en mongodb con feathers, no en la blockchain!
   * Lo bueno con ipfs es que podriamos guardar mas datos
   *
   * @param user        User object to be saved
   * @param afterSave   Callback to be triggered after the user is saved in feathers
   */
  save(user) {
    return new Observable(async subscriber => {
      await this._updateAvatar(user);

      try {
        await _uploadUserToIPFS(user);

        await feathersClient.service('/users').patch(user.address, user.toFeathers());
        user.isRegistered = true;

        subscriber.next(user);

      } catch (err) {
        err.userMsg = 'There has been a problem creating your user profile. Please refresh the page and try again.';
        subscriber.error(err);
      }
    });
  }

  getUsersRoles() {
    return new Observable(async subscriber => {
      const users = await getUsersWithRoles();
      subscriber.next(users);
    })
  }

  async _updateAvatar(user) {
    if (user._newAvatar) {
      try {
        const avatarUrl = await ipfsService.upload(user._newAvatar);
        user.avatar = ipfsService.resolveUrl(avatarUrl);
        delete user._newAvatar;
      } catch (err) {
        ErrorPopup('Failed to upload avatar', err);
      }
    }
  }
}

async function authenticateFeathers(user) {
  let authenticated = false;
  if (user) {
    const token = await feathersClient.passport.getJWT();

    if (token) {
      const { userId } = await feathersClient.passport.verifyJWT(token);

      if (user.address === userId) {
        await feathersClient.authenticate(); // authenticate the socket connection
        authenticated = true;
      } else {
        await feathersClient.logout();
      }
    }
  }
  return authenticated;
}

async function _uploadUserToIPFS(user) {
  try {
    user.profileHash = await ipfsService.upload(user.toIpfs());
  } catch (err) {
    ErrorPopup('Failed to upload profile to ipfs');
  }
}

export async function getUser(address) {
  const userdata = await feathersClient.service('/users').get(address);
  return new User({ ...userdata });
}

async function getRoles(address) {
  try {
    const userRoles = [];
    for (const rol of ALL_ROLES) {
      const canPerform = await crowdfundingContractApi.canPerformRole(address, rol);
      if (canPerform) userRoles.push(rol);
    }
    return userRoles;

  } catch (err) {
    console.log(err)
  }
}

export async function getUsersWithRoles() {
  const usersWithRoles = [];
  const { data: users } = await feathersClient.service("users").find();
  for (const user of users) {
    const roles = await getRoles(user.address);
    usersWithRoles.push(new User({ ...user, roles }));
  }
  return usersWithRoles;
}


const pause = (ms = 3000) => {
  return new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), ms)
  });
}








export default UserService;
