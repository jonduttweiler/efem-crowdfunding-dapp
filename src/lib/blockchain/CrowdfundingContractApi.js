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

/**
 * API encargada de la interacción con el Crowdfunding Smart Contract.
 */
class CrowdfundingContractApi {

    constructor() { }

    async canPerformRole(address, role) {
        try {
            const crowdfunding = await this.getCrowdfunding();
            const hashedRole = web3.utils.keccak256(role);
            return await crowdfunding.canPerform(address, hashedRole, []);;
        } catch (err) {
            console.log("Fail to invoke canPerform on smart contract");
            console.log(err);
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
    async saveDAC(dac, onCreateTransaction, onConfirmation, onError) {
        const crowdfunding = await this.getCrowdfunding(); //Esto puede ponerse como variable de instancia??

        console.log("Saving dac on CrowdfundingContractApi");

        // Se almacena en IPFS toda la información de la dac.
        dac.image = await IpfsService.upload(dac.image);
        dac.imageUrl = await IpfsService.resolveUrl(dac.image);
        dac.infoCid = await IpfsService.upload(dac.toIpfs());
        console.log(dac.infoCid);
        console.log("owner:" + dac.owner.address)

        const promiEvent = crowdfunding.newDac(dac.infoCid, { from: dac.owner.address, $extraGas: extraGas() });

        promiEvent
            .once('transactionHash', function (hash) {
                dac.txHash = hash;
                onCreateTransaction(dac);
            })
            .once('confirmation', function (confNumber, receipt) {
                onConfirmation(dac);
            })
            .on('error', function (error) {
                console.error(`Error procesando transacción en Smart Contract`, error);
                console.log(error);
                onError(error);
            });
    }

    /**
     * Obtiene la Dac a partir del ID especificado.
     * 
     * @param {*} id de la Dac a obtener.
     * @returns Dac cuyo Id coincide con el especificado.
     */
    async getDAC(id) {
        const crowdfunding = await this.getCrowdfunding();
        const dacOnChain = await crowdfunding.getDac(id);
        // Se obtiene la información de la Dac desde IPFS.
        const { id: _id, infoCid, status, delegate } = dacOnChain;
        const { title, description, image, communityUrl } = await IpfsService.downloadJson(infoCid);

        return new DAC({
            _id,
            title,
            description,
            image,
            imageUrl: IpfsService.resolveUrl(image),
            communityUrl,
            status: this.mapDACStatus(status),
            ownerAddress: delegate,
            commitTime: 0
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
        const { id, infoCid, status, manager, reviewer } = campaingOnChain;
        const { title, description, imageCid, url } = await IpfsService.downloadJson(infoCid);

        return new Campaign({
            id: id,
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,            
            managerAddress: manager,
            reviewerAddress: reviewer,
            status: this.mapCampaingStatus(status)
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

                // Temporal hasta que exista la DAC previamente.
                let receipt = await crowdfunding.newDac(campaign.infoCid,
                  {
                    from: campaign.managerAddress,
                    $extraGas: extraGas()
                  });
                // Temporal hasta que exista la DAC previamente.

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
                        campaign.id = receipt.events['NewCampaign'].returnValues.id;
                        campaign.status = Campaign.ACTIVE;
                        subscriber.next(campaign);
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
        const { id, campaignId, infoCid, fiatAmountTarget, status, manager, reviewer, recipient, campaignReviewer } = milestoneOnChain;
        const { title, description, imageCid, url } = await IpfsService.downloadJson(infoCid);

        return new Milestone({
            id: id,
            campaignId: campaignId,
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,
            fiatAmountTarget: new BigNumber(fiatAmountTarget),
            managerAddress: manager,
            reviewerAddress: reviewer,
            campaignReviewerAddress: campaignReviewer,
            recipientAddress: recipient,           
            status: this.mapMilestoneStatus(status)
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
                        milestone.id = receipt.events['NewMilestone'].returnValues.id;
                        milestone.status = Milestone.ACTIVE;
                        subscriber.next(milestone);
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
     * Obtiene la Donación a partir del ID especificado.
     * 
     * @param donationId de la Donación a obtener.
     * @returns Donación cuyo Id coincide con el especificado.
     */
    async getDonation(donationId) {
        const crowdfunding = await this.getCrowdfunding();
        const donationOnChain = await crowdfunding.getDonation(donationId);
        // Se obtiene la información de la Donación desde IPFS.
        const { id, giver, token, amount, amountRemainding, entityId, budgetId, status } = donationOnChain;

        return new Donation({
            id: id,
            giverAddress: giver,
            tokenAddress: token,
            amount: amount,
            amountRemainding: amountRemainding,
            entityId: entityId,
            budgetId: budgetId,
            status: this.mapDonationStatus(status)
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
                        donation.id = receipt.events['NewDonation'].returnValues.id;
                        donation.status = Donation.AVAILABLE;
                        subscriber.next(donation);
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
     * Realiza el mapping de los estados de las dac en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la dac en el smart contract.
     * @returns estado de la dac en la dapp.
     */
    mapDACStatus(status) {
        switch (status) {
            case 0: return DAC.ACTIVE;
            case 1: return DAC.CANCELED;
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
        if (status == 0) {
            return Campaign.ACTIVE;
        }
        if (status == 1) {
            return Campaign.CANCELED;
        }
        return Campaign.CANCELED;
    }

    /**
     * Realiza el mapping de los estados del milestone en el
     * smart contract con los estados en la dapp.
     * 
     * @param status del milestone en el smart contract.
     * @returns estado del milestone en la dapp.
     */
    mapMilestoneStatus(status) {
        if (status == 0) {
            return Milestone.ACTIVE;
        }
        if (status == 1) {
            return Milestone.CANCELED;
        }
        return Milestone.IN_PROGRESS;
    }

    /**
     * Realiza el mapping de los estados de las donación en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la donación en el smart contract.
     * @returns estado de la donación en la dapp.
     */
    mapDonationStatus(status) {
        if (status == 0) {
            return Donation.AVAILABLE;
        }
        return Donation.CANCELED;
    }


    async getCrowdfunding() {
        const network = await getNetwork();
        const { crowdfunding } = network;
        return crowdfunding;
    }
}

export default CrowdfundingContractApi;