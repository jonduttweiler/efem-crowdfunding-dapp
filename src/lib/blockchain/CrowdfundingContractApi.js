import DAC from '../../models/DAC';
import Campaign from '../../models/Campaign';
import Milestone from '../../models/Milestone';
import Donation from '../../models/Donation';
import getNetwork from './getNetwork';
import IpfsService from '../../services/IpfsService';
import extraGas from './extraGas';
import { Observable } from 'rxjs'
import web3 from 'web3';
import BigNumber from 'bignumber.js';


//const getRevertReason = require('eth-revert-reason')

/**
 * API encargada de la interacción con el Crowdfunding Smart Contract.
 */
class CrowdfundingContractApi {

    constructor() { }


    async canPerformRole(address, role) {
        try {
            const crowdfunding = await this.getCrowdfunding();
            const hashedRole = web3.utils.keccak256(role);
            const response = await crowdfunding.canPerform(address, hashedRole, []);
            //console.log(address,role,response);
            return response;
        } catch (err) {
            console.log("Fail to invoke canPerform on smart contract:", err);
            return false;
        }
    }

    /**
     * Almacena una DAC en el smart contract
     * @param {} DAC
     * @param {*} onCreateTransaction 
     * @param {*} onConfirmation 
     * @param {*} onError
     */
    saveDAC(dac) {
        return new Observable(async subscriber => {
            try {
                const crowdfunding = await this.getCrowdfunding();

                // Se almacena en IPFS toda la información de la dac.
                dac.imageCid = await IpfsService.upload(dac.image);
                dac.imageUrl = await IpfsService.resolveUrl(dac.imageCid);
                dac.infoCid = await IpfsService.upload(dac.toIpfs());

                let thisApi = this;
                let clientId = dac.clientId;

                const promiEvent = crowdfunding.newDac(dac.infoCid, { from: dac.delegateAddress, $extraGas: extraGas() });

                promiEvent
                    .once('transactionHash', hash => {
                        console.log("La transacción ha sido creada. txHash:", hash);
                        dac.txHash = hash;
                        subscriber.next(dac);
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        console.log("DAC creation confimed", receipt);
                        let id = parseInt(receipt.events['NewDac'].returnValues.id);
                        thisApi._getDac(crowdfunding, id).then(dac => {
                            dac.clientId = clientId;
                            subscriber.next(dac);
                        });
                    })

                    .on('error', function (error) {
                        console.error(`Error procesando transacción de almacenamiento de dac.`, error);
                        subscriber.error(error);
                    });

            } catch (error) {
                console.log(error);
                subscriber.error(error);
            }
        });



    };

    /**
     * Obtiene la Dac a partir del ID especificado.
     * 
     * @param {*} pid de la Dac a obtener.
     * @returns Dac cuyo Id coincide con el especificado.
     */
    async getDAC(pid) {
        const crowdfunding = await this.getCrowdfunding();

        const { id, infoCid, donationIds, status, delegate } = await crowdfunding.getDac(pid);
        const { title, description, imageCid, communityUrl } = await IpfsService.downloadJson(infoCid);

        return new DAC({
            id: parseInt(id),
            title,
            description,
            imageCid,
            imageUrl: IpfsService.resolveUrl(imageCid),
            communityUrl,
            donationIds: donationIds.map(e => parseInt(e)),
            status: this.mapDACStatus(parseInt(status)),
            delegateAddress: delegate,
            commitTime: 0
        });
    }

    //get data of dac from blockchain and ipfs
    //Returns Promise<DAC>
    //Podriamos pasar esta funcion a otro archivo
    async _getDac(crowdfunding, pid) {
        const dacOnChain = await crowdfunding.getDac(pid);
        const {
            id,
            idIndex,
            infoCid,
            donationIds,
            delegate,
            campaignIds,
            budgetIds,
            status
        } = dacOnChain;

        const dacOnIPFS = await IpfsService.downloadJson(infoCid);
        const {
            title,
            description,
            communityUrl,
            imageCid,
            version
        } = dacOnIPFS;


        const imageUrl = IpfsService.resolveUrl(imageCid);

        const dac = new DAC({
            id: parseInt(id),
            title,
            description,
            imageCid,
            imageUrl,
            communityUrl,
            donationIds: donationIds.map(e => parseInt(e)),
            status: this.mapDACStatus(parseInt(status)),
            delegateAddress: delegate,
            commitTime: 0

        });

        return dac;
    }

    /**
     * Obtiene todas las Dacs desde el Smart Contract.
     */
    getDacs() {
        return new Observable(async subscriber => {
            try {
                const crowdfunding = await this.getCrowdfunding();
                const ids = await crowdfunding.getDacIds();
                const dacs = [];

                if (ids.length > 0) {
                    for (let i = 0; i < ids.length; i++) {
                        const dac = await this._getDac(crowdfunding, ids[i]);
                        dacs.push(dac);
                    }

                    subscriber.next(dacs);
                } else {
                    subscriber.next([]);
                }
            } catch (error) {
                subscriber.error(error);
            }
        });
    }


    /**
     * Obtiene todas las Campaigns desde el Smart Contract.
     */
    getCampaigns() {
        return new Observable(async subscriber => {
            try {
                let crowdfunding = await this.getCrowdfunding();
                let ids = await crowdfunding.getCampaignIds();
                let campaigns = [];
                for (let i = 0; i < ids.length; i++) {
                    let campaign = await this.getCampaign(ids[i]);
                    campaigns.push(campaign);
                }
                subscriber.next(campaigns);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Campaign a partir del ID especificado.
     * 
     * @param campaignId de la Campaign a obtener.
     * @returns Campaign cuyo Id coincide con el especificado.
     */
    async getCampaign(campaignId) {
        const crowdfunding = await this.getCrowdfunding();
        const campaingOnChain = await crowdfunding.getCampaign(campaignId);
        // Se obtiene la información de la Campaign desde IPFS.
        const { id, infoCid, dacIds, donationIds, status, manager, reviewer } = campaingOnChain;
        const { title, description, imageCid, url } = await IpfsService.downloadJson(infoCid);

        return new Campaign({
            id: parseInt(id),
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,
            dacIds: dacIds.map(e => parseInt(e)),
            donationIds: donationIds.map(e => parseInt(e)),
            managerAddress: manager,
            reviewerAddress: reviewer,
            status: this.mapCampaingStatus(parseInt(status))
        });
    }

    /**
     * Almacena una Campaing en el Smart Contarct.
     * 
     * @param campaign a almacenar.
     */
    saveCampaign(campaign) {

        return new Observable(async subscriber => {

            try {
                let crowdfunding = await this.getCrowdfunding();

                // Se almacena en IPFS la imagen de la Campaign.
                let imageCid = await IpfsService.upload(campaign.image);
                campaign.imageCid = imageCid;

                // Se almacena en IPFS toda la información de la Campaign.
                let infoCid = await IpfsService.upload(campaign.toIpfs());
                campaign.infoCid = infoCid;

                let thisApi = this;
                let clientId = campaign.clientId;

                let promiEvent = crowdfunding.newCampaign(
                    campaign.infoCid,
                    //campaign.dacId,
                    1,
                    //campaign.reviewerAddress,
                    campaign.managerAddress,
                    {
                        from: campaign.managerAddress,
                        $extraGas: extraGas()
                    });

                promiEvent
                    .once('transactionHash', function (hash) {
                        // La transacción ha sido creada.
                        campaign.txHash = hash;
                        subscriber.next(campaign);
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería gregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let id = parseInt(receipt.events['NewCampaign'].returnValues.id);
                        thisApi.getCampaign(id).then(campaign => {
                            campaign.clientId = clientId;
                            subscriber.next(campaign);
                        });
                    })
                    .on('error', function (error) {
                        console.error(`Error procesando transacción de almacenamiento de campaign.`, error);
                        subscriber.error(error);
                    });
            } catch (error) {
                console.error(`Error almacenando campaign`, error);
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene todos los Milestones desde el Smart Contract.
     */
    getMilestones() {
        return new Observable(async subscriber => {
            try {
                let crowdfunding = await this.getCrowdfunding();
                let ids = await crowdfunding.getMilestoneIds();
                let milestones = [];
                for (let i = 0; i < ids.length; i++) {
                    let milestone = await this.getMilestone(ids[i]);
                    milestones.push(milestone);
                }
                subscriber.next(milestones);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene el Milestone a partir del ID especificado.
     * 
     * @param id del Milestone a obtener.
     * @returns Milestone cuyo Id coincide con el especificado.
     */
    async getMilestone(milestoneId) {
        const crowdfunding = await this.getCrowdfunding();
        const milestoneOnChain = await crowdfunding.getMilestone(milestoneId);
        // Se obtiene la información del Milestone desde IPFS.
        const { id, campaignId, infoCid, fiatAmountTarget, donationIds, status, manager, reviewer, recipient, campaignReviewer } = milestoneOnChain;
        const { title, description, imageCid, url } = await IpfsService.downloadJson(infoCid);

        return new Milestone({
            id: parseInt(id),
            campaignId: parseInt(campaignId),
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,
            fiatAmountTarget: new BigNumber(fiatAmountTarget),
            donationIds: donationIds.map(e => parseInt(e)),
            managerAddress: manager,
            reviewerAddress: reviewer,
            campaignReviewerAddress: campaignReviewer,
            recipientAddress: recipient,
            status: this.mapMilestoneStatus(parseInt(status))
        });
    }

    /**
     * Almacena un Milestone en el Smart Contarct.
     * 
     * @param milestone a almacenar.
     */
    saveMilestone(milestone) {

        return new Observable(async subscriber => {

            try {
                let crowdfunding = await this.getCrowdfunding();

                // Se almacena en IPFS la imagen del Milestone.
                let imageCid = await IpfsService.upload(milestone.image);
                milestone.imageCid = imageCid;

                // Se almacena en IPFS toda la información del Milestone.
                let infoCid = await IpfsService.upload(milestone.toIpfs());
                milestone.infoCid = infoCid;

                let thisApi = this;
                let clientId = milestone.clientId;

                let promiEvent = crowdfunding.newMilestone(
                    milestone.infoCid,
                    milestone.campaignId,
                    milestone.fiatAmountTarget,
                    milestone.reviewerAddress,
                    milestone.recipientAddress,
                    milestone.campaignReviewerAddress,
                    {
                        from: milestone.managerAddress,
                        $extraGas: extraGas()
                    });

                promiEvent
                    .once('transactionHash', function (hash) {
                        // La transacción ha sido creada.
                        milestone.txHash = hash;
                        subscriber.next(milestone);
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let id = parseInt(receipt.events['NewMilestone'].returnValues.id);
                        thisApi.getMilestone(id).then(milestone => {
                            milestone.clientId = clientId;
                            subscriber.next(milestone);
                        });
                    })
                    .on('error', function (error) {
                        console.error(`Error procesando transacción de almacenamiento de milestone.`, error);
                        subscriber.error(error);
                    });
            } catch (error) {
                console.error(`Error almacenando milestone`, error);
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene todas las Donaciones desde el Smart Contract.
     */
    getDonations() {
        return new Observable(async subscriber => {
            try {
                let crowdfunding = await this.getCrowdfunding();
                let ids = await crowdfunding.getDonationIds();
                let donations = [];
                for (let i = 0; i < ids.length; i++) {
                    let donation = await this.getDonation(ids[i]);
                    donations.push(donation);
                }
                subscriber.next(donations);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene todas las Donaciones desde el Smart Contract que coinciden con los
     * IDs especificados.
     * 
     * @param ids IDs de las donaciones a obtener.
     */
    getDonationsByIds(ids) {
        return new Observable(async subscriber => {
            try {
                let donations = [];
                for (let i = 0; i < ids.length; i++) {
                    let donation = await this.getDonation(ids[i]);
                    donations.push(donation);
                }
                subscriber.next(donations);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Donación a partir del ID especificado.
     * 
     * @param donationId de la Donación a obtener.
     * @returns Donación cuyo Id coincide con el especificado.
     */
    async getDonation(donationId) {
        const crowdfunding = await this.getCrowdfunding();
        const donationOnChain = await crowdfunding.getDonation(donationId);
        // Se obtiene la información de la Donación desde IPFS.
        const { id,
            giver,
            token,
            amount,
            amountRemainding,
            createdAt,
            entityId,
            budgetId,
            status } = donationOnChain;

        return new Donation({
            id: parseInt(id),
            giverAddress: giver,
            tokenAddress: token,
            amount: new BigNumber(amount),
            amountRemainding: new BigNumber(amountRemainding),
            createdAt: createdAt,
            entityId: parseInt(entityId),
            budgetId: parseInt(budgetId),
            status: this.mapDonationStatus(parseInt(status))
        });
    }

    /**
     * Almacena una Donacón en el Smart Contarct.
     * 
     * @param donation a almacenar.
     */
    saveDonation(donation) {

        return new Observable(async subscriber => {

            try {
                let crowdfunding = await this.getCrowdfunding();

                let thisApi = this;
                let clientId = donation.clientId;

                let promiEvent = crowdfunding.donate(
                    donation.entityId,
                    donation.tokenAddress,
                    donation.amount,
                    {
                        from: donation.giverAddress,
                        value: donation.amount,
                        $extraGas: extraGas()
                    });

                promiEvent
                    .once('transactionHash', function (hash) {
                        // La transacción ha sido creada.
                        donation.txHash = hash;
                        subscriber.next(donation);
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let id = parseInt(receipt.events['NewDonation'].returnValues.id);
                        thisApi.getDonation(id).then(donation => {
                            donation.clientId = clientId;
                            subscriber.next(donation);
                        });
                    })
                    .on('error', function (error) {
                        console.error(`Error procesando transacción de almacenamiento de donación.`, error);
                        subscriber.error(error);
                    });
            } catch (error) {
                console.error(`Error almacenando donación`, error);
                subscriber.error(error);
            }
        });
    }

    /**
     * Retiro de fondos de un milestone.
     * 
     * @param milestone desde el cual se retiran los fondos.
     */
    milestoneWithdraw(milestone) {

        return new Observable(async subscriber => {

            try {
                let crowdfunding = await this.getCrowdfunding();

                let thisApi = this;
                let clientId = milestone.clientId;

                let promiEvent = crowdfunding.withdraw(
                    milestone.id,
                    {
                        from: milestone.recipientAddress,
                        $extraGas: extraGas()
                    });

                promiEvent
                    .once('transactionHash', function (hash) {
                        // La transacción ha sido creada.
                        milestone.txHash = hash;
                        subscriber.next(milestone);
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let milestoneId = parseInt(receipt.events['Withdraw'].returnValues.milestoneId);
                        thisApi.getMilestone(milestoneId).then(milestone => {
                            milestone.clientId = clientId;
                            subscriber.next(milestone);
                        });
                    })
                    .on('error', function (error) {
                        console.error(`Error procesando transacción de retiro de fondos de milestone.`, error);
                        //let reason = await getRevertReason(milestone.txHash); // 'I accidentally killed it.'
                        //console.log(reason);
                        subscriber.error(error);
                    })/*.catch(revertReason => {
                        console.log('revertReason', revertReason);
                    })*/;
            } catch (error) {
                console.error(`Error retirando fondos de milestone`, error);
                subscriber.error(error);
            }
        });
    }

    /**
     * Realiza el mapping de los estados de las dac en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la dac en el smart contract.
     * @returns estado de la dac en la dapp.
     */
    mapDACStatus(status) {
        switch (status) {
            case 0: return DAC.ACTIVE;
            case 1: return DAC.CANCELLED;
        }
    }

    /**
     * Realiza el mapping de los estados de las campaign en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la campaign en el smart contract.
     * @returns estado de la campaign en la dapp.
     */
    mapCampaingStatus(status) {
        switch (status) {
            case 0: return Campaign.ACTIVE;
            case 1: return Campaign.CANCELLED;
        }
    }

    /**
     * Realiza el mapping de los estados del milestone en el
     * smart contract con los estados en la dapp.
     * 
     * @param status del milestone en el smart contract.
     * @returns estado del milestone en la dapp.
     */
    mapMilestoneStatus(status) {
        switch (status) {
            case 0: return Milestone.ACTIVE;
            case 1: return Milestone.CANCELLED;
            case 2: return Milestone.COMPLETED;
            case 3: return Milestone.APPROVED;
            case 4: return Milestone.REJECTED;
            case 5: return Milestone.PAID;
        }
    }

    /**
     * Realiza el mapping de los estados de las donación en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la donación en el smart contract.
     * @returns estado de la donación en la dapp.
     */
    mapDonationStatus(status) {
        switch (status) {
            case 0: return Donation.AVAILABLE;
            case 1: return Donation.SPENT;
            case 2: return Donation.RETURNED;
        }
    }


    async getCrowdfunding() {
        const network = await getNetwork();
        const { crowdfunding } = network;
        return crowdfunding;
    }
}

export default CrowdfundingContractApi;