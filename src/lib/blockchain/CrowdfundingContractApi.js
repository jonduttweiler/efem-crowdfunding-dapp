import DAC from '../../models/DAC';
import Campaign from '../../models/Campaign';
import Milestone from '../../models/Milestone';
import Activity from '../../models/Activity';
import Donation from '../../models/Donation';
import getNetwork from './getNetwork';
import extraGas from './extraGas';
import { Observable } from 'rxjs'
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import messageUtils from '../../redux/utils/messageUtils'
import transactionUtils from '../../redux/utils/transactionUtils'
import entityUtils from '../../redux/utils/entityUtils'
import dacIpfsConnector from '../../ipfs/DacIpfsConnector'
import campaignIpfsConnector from '../../ipfs/CampaignIpfsConnector'
import milestoneIpfsConnector from '../../ipfs/MilestoneIpfsConnector'
import activityIpfsConnector from '../../ipfs/ActivityIpfsConnector'
import ExchangeRate from '../../models/ExchangeRate';
import getWeb3 from './getWeb3';
import Transaction from 'models/Transaction';

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
     * 
     * @param dac
     */
    saveDAC(dac) {
        return new Observable(async subscriber => {
            try {

                console.log('alta dac', dac);

                const crowdfunding = await this.getCrowdfunding();

                // Se almacena en IPFS toda la información de la Dac.
                let infoCid = await dacIpfsConnector.upload(dac);

                let thisApi = this;
                let clientId = dac.clientId;

                const promiEvent = crowdfunding.newDac(infoCid, {
                    from: dac.delegateAddress,
                    $extraGas: extraGas()
                });

                promiEvent
                    .once('transactionHash', hash => {
                        dac.txHash = hash;
                        subscriber.next(dac);
                        messageUtils.addMessageInfo({ text: 'Se inició la transacción para crear la DAC' });
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        let id = parseInt(receipt.events['NewDac'].returnValues.id);
                        thisApi.getDacById(id).then(dac => {
                            dac.clientId = clientId;
                            subscriber.next(dac);
                            messageUtils.addMessageSuccess({
                                title: 'Felicitaciones!',
                                text: `La DAC ${dac.title} ha sido confirmada`
                            });
                        });
                    })

                    .on('error', function (error) {
                        error.dac = dac;
                        console.error(`Error procesando transacción de almacenamiento de dac.`, error);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error creando la DAC ${dac.title}`,
                            error: error
                        });
                    });

            } catch (error) {
                error.dac = dac;
                console.log(error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error creando la DAC ${dac.title}`,
                    error: error
                });
            }
        });
    };

    /**
     * Obtiene la Dac a partir del ID especificado.
     * 
     * @param {*} pid de la Dac a obtener.
     * @returns Dac cuyo Id coincide con el especificado.
     */
    async getDacById(dacId) {
        const crowdfunding = await this.getCrowdfunding();
        const { id, infoCid, donationIds, campaignIds, budgetDonationIds, users, status } = await crowdfunding.getDac(dacId);
        // Se obtiene la información de la Dac desde IPFS.
        const dacOnIpfs = await dacIpfsConnector.download(infoCid);
        const { title, description, imageCid, url } = dacOnIpfs;
        return new DAC({
            id: parseInt(id),
            title,
            description,
            imageCid,
            url,
            campaignIds: campaignIds.map(e => parseInt(e)),
            donationIds: donationIds.map(e => parseInt(e)),
            budgetDonationIds: budgetDonationIds.map(e => parseInt(e)),
            status: this.mapDACStatus(parseInt(status)),
            delegateAddress: users[0],
            commitTime: 0
        });
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
                        const dac = await this.getDacById(ids[i]);
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
     * Obtiene la Dac desde el Smart Contract.
     */
    getDac(id) {
        return new Observable(async subscriber => {
            try {
                const dac = await this.getDacById(id);
                subscriber.next(dac);
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
                    let campaign = await this.getCampaignById(ids[i]);
                    campaigns.push(campaign);
                }
                subscriber.next(campaigns);
            } catch (error) {
                console.log('Error obtiendo Campaigns', error);
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Campaign desde el Smart Contract.
     */
    getCampaign(id) {
        return new Observable(async subscriber => {
            try {
                let campaign = await this.getCampaignById(id);
                subscriber.next(campaign);
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
    async getCampaignById(campaignId) {
        const crowdfunding = await this.getCrowdfunding();
        const campaingOnChain = await crowdfunding.getCampaign(campaignId);
        // Se obtiene la información de la Campaign desde IPFS.
        const { id, infoCid, dacIds, milestoneIds, donationIds, budgetDonationIds, users, status } = campaingOnChain;
        // Se obtiene la información de la Campaign desde IPFS.
        const campaignOnIpfs = await campaignIpfsConnector.download(infoCid);
        const { title, description, imageCid, url } = campaignOnIpfs;

        return new Campaign({
            id: parseInt(id),
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,
            dacIds: dacIds.map(e => parseInt(e)),
            milestoneIds: milestoneIds.map(e => parseInt(e)),
            donationIds: donationIds.map(e => parseInt(e)),
            budgetDonationIds: budgetDonationIds.map(e => parseInt(e)),
            managerAddress: users[0],
            reviewerAddress: users[1],
            status: this.mapCampaignStatus(parseInt(status))
        });
    }

    /**
     * Almacena una Campaing en el Smart Contarct.
     * 
     * @param campaign a almacenar.
     */
    saveCampaign2(campaign) {

        return new Observable(async subscriber => {

            try {
                const dacId = 1; //preguntar a Mauri que vamos a hacer con esto, esto existe?
                const crowdfunding = await this.getCrowdfunding();
                const campaignId = campaign.id || 0; //zero is for new campaigns;
                const isUpdating = campaignId > 0;

                //cannot upload string to ipfs
                console.log("%csaveCampaign", "color:cyan", campaign)

                // Se almacena en IPFS toda la información de la Campaign.
                let infoCid = await campaignIpfsConnector.upload(campaign);
                campaign.infoCid = infoCid;

                const clientId = campaign.clientId;

                const promiEvent = crowdfunding.saveCampaign(
                    campaign.infoCid,
                    dacId,
                    campaign.reviewerAddress,
                    campaignId,
                    {
                        from: campaign.managerAddress,
                        $extraGas: extraGas()
                    });

                promiEvent.once('transactionHash', (hash) => { // La transacción ha sido creada.
                    campaign.txHash = hash;
                    subscriber.next(campaign);
                    messageUtils.addMessageInfo({ text: 'Se inició la transacción para crear la campaign' });
                })
                    .once('confirmation', (confNumber, receipt) => {
                        // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                        // TODO Aquí debería gregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                        const idFromEvent = parseInt(receipt.events['SaveCampaign'].returnValues.id);

                        this.getCampaignById(idFromEvent).then(campaign => {
                            campaign.clientId = clientId;
                            subscriber.next(campaign);
                            messageUtils.addMessageSuccess({
                                title: 'Felicitaciones!',
                                text: `La campaign ${campaign.title} ha sido ${isUpdating ? "actualizada" : "confirmada"}`
                            });
                        });
                    })
                    .on('error', function (error) {
                        error.campaign = campaign;
                        console.error(`Error procesando transacción de almacenamiento de campaign.`, error);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error creando la campaign ${campaign.title}`,
                            error: error
                        });
                    });
            } catch (error) {
                error.campaign = campaign;
                console.error(`Error almacenando campaign`, error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error creando la campaign ${campaign.title}`,
                    error: error
                });
            }
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

                const web3 = await getWeb3();

                const dacId = 1; //preguntar a Mauri que vamos a hacer con esto, esto existe?
                const crowdfunding = await this.getCrowdfundingRaw();
                const campaignId = campaign.id || 0; //zero is for new campaigns;
                const isUpdating = campaignId > 0;

                //cannot upload string to ipfs
                console.log("%csaveCampaign", "color:cyan", campaign)

                // Se almacena en IPFS toda la información de la Campaign.
                let infoCid = await campaignIpfsConnector.upload(campaign);
                campaign.infoCid = infoCid;

                const clientId = campaign.clientId;

                const method = crowdfunding.methods.saveCampaign(
                        campaign.infoCid,
                        dacId,
                        campaign.reviewerAddress,
                        campaignId);                

                const gasEstimated = await method.estimateGas({
                    from: campaign.managerAddress,
                });
                const gasPrice = await this.getGasPrice();

                let transaction = transactionUtils.addTransaction({
                    gasEstimated: new BigNumber(gasEstimated),
                    gasPrice: new BigNumber(gasPrice),
                    createdTitleKey: 'transactionCreatedTitleCreateCampaign',
                    createdSubtitleKey: 'transactionCreatedSubtitleCreateCampaign',
                    submittedTitleKey: 'transactionPendingTitleCreateCampaign'
                });

                const promiEvent = method.send({
                    from: campaign.managerAddress,
                });

                promiEvent
                    .once('transactionHash', (hash) => { // La transacción ha sido creada.

                        transaction.submitted(hash);
                        transactionUtils.updateTransaction(transaction);

                        campaign.txHash = hash;
                        subscriber.next(campaign);
                    })
                    .once('confirmation', (confNumber, receipt) => {

                        transaction.confirmed();
                        transactionUtils.updateTransaction(transaction);

                        // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                        // TODO Aquí debería gregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                        const idFromEvent = parseInt(receipt.events['SaveCampaign'].returnValues.id);

                        this.getCampaignById(idFromEvent).then(campaign => {
                            campaign.clientId = clientId;
                            subscriber.next(campaign);
                            messageUtils.addMessageSuccess({
                                title: 'Felicitaciones!',
                                text: `La campaign ${campaign.title} ha sido ${isUpdating ? "actualizada" : "confirmada"}`
                            });
                        });
                    })
                    .on('error', function (error) {

                        transaction.rejected();
                        transactionUtils.updateTransaction(transaction);

                        error.campaign = campaign;
                        console.error(`Error procesando transacción de almacenamiento de campaign.`, error);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error creando la campaign ${campaign.title}`,
                            error: error
                        });
                    });
            } catch (error) {
                error.campaign = campaign;
                console.error(`Error almacenando campaign`, error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error creando la campaign ${campaign.title}`,
                    error: error
                });
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
                    let milestone = await this.getMilestoneById(ids[i]);
                    milestones.push(milestone);
                }
                subscriber.next(milestones);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene el Milestone desde el Smart Contract.
     */
    getMilestone(id) {
        return new Observable(async subscriber => {
            try {
                let milestone = await this.getMilestoneById(id);
                subscriber.next(milestone);
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
    async getMilestoneById(milestoneId) {
        const crowdfunding = await this.getCrowdfunding();
        const milestoneOnChain = await crowdfunding.getMilestone(milestoneId);
        const { id, campaignId, infoCid, fiatAmountTarget, users, activityIds, donationIds, budgetDonationIds, status } = milestoneOnChain;
        // Se obtiene la información del Milestone desde IPFS.
        const milestoneOnIpfs = await milestoneIpfsConnector.download(infoCid);
        const { title, description, imageCid, url } = milestoneOnIpfs;

        return new Milestone({
            id: parseInt(id),
            campaignId: parseInt(campaignId),
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,
            fiatAmountTarget: new BigNumber(fiatAmountTarget),
            activityIds: activityIds.map(e => parseInt(e)),
            donationIds: donationIds.map(e => parseInt(e)),
            budgetDonationIds: budgetDonationIds.map(e => parseInt(e)),
            managerAddress: users[0],
            reviewerAddress: users[1],
            campaignReviewerAddress: users[2],
            recipientAddress: users[3],
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

                // Se almacena en IPFS toda la información del Milestone.
                let infoCid = await milestoneIpfsConnector.upload(milestone);

                let thisApi = this;
                let clientId = milestone.clientId;

                let promiEvent = crowdfunding.newMilestone(
                    infoCid,
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
                        messageUtils.addMessageInfo({ text: 'Se inició la transacción para crear el milestone' });
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let id = parseInt(receipt.events['NewMilestone'].returnValues.id);
                        thisApi.getMilestoneById(id).then(milestone => {
                            milestone.clientId = clientId;
                            subscriber.next(milestone);
                            messageUtils.addMessageSuccess({
                                title: 'Felicitaciones!',
                                text: `El milestone ${milestone.title} ha sido confirmado`
                            });
                        });
                    })
                    .on('error', function (error) {
                        error.milestone = milestone;
                        console.error(`Error procesando transacción de almacenamiento de milestone.`, error);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error creando el milestone ${milestone.title}`,
                            error: error
                        });
                    });
            } catch (error) {
                error.milestone = milestone;
                console.error(`Error almacenando milestone`, error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error creando el milestone ${milestone.title}`,
                    error: error
                });
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
                    let donation = await this.getDonationById(ids[i]);
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
                    let donation = await this.getDonationById(ids[i]);
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
    async getDonationById(donationId) {
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
            budgetEntityId,
            status } = donationOnChain;

        return new Donation({
            id: parseInt(id),
            giverAddress: giver,
            tokenAddress: token,
            amount: new BigNumber(amount),
            amountRemainding: new BigNumber(amountRemainding),
            createdAt: createdAt,
            entityId: parseInt(entityId),
            budgetEntityId: parseInt(budgetEntityId),
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
                        messageUtils.addMessageInfo({ text: 'Se inició la transacción para crear la donación' });
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let id = parseInt(receipt.events['NewDonation'].returnValues.id);
                        thisApi.getDonationById(id).then(donation => {
                            donation.clientId = clientId;
                            subscriber.next(donation);
                            messageUtils.addMessageSuccess({
                                title: 'Gracias por tu ayuda!',
                                text: `La donación ha sido confirmada`
                            });
                        });
                        entityUtils.refreshEntity(donation.entityId);
                    })
                    .on('error', function (error) {
                        error.donation = donation;
                        console.error(`Error procesando transacción de almacenamiento de donación.`, error);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error creando la donación`,
                            error: error
                        });
                    });
            } catch (error) {
                error.donation = donation;
                console.error(`Error almacenando donación`, error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error creando la donación`,
                    error: error
                });
            }
        });
    }

    /**
     * Transfiere las donaciones en el Smart Contarct.
     * 
     * @param userAddress Dirección del usuario que realiza la transferencia.
     * @param entityIdFrom ID de la entidad desde donde se transfieren las donaciones.
     * @param entityIdTo ID de la entidad hacia donde se transfieren las donaciones.
     * @param donationIds IDs de las donaciones a transferir.
     */
    transferDonations(userAddress, entityIdFrom, entityIdTo, donationIds) {

        return new Observable(async subscriber => {

            try {
                let crowdfunding = await this.getCrowdfunding();

                let thisApi = this;

                let promiEvent = crowdfunding.transfer(
                    entityIdFrom,
                    entityIdTo,
                    donationIds,
                    {
                        from: userAddress,
                        $extraGas: extraGas()
                    });

                promiEvent
                    .once('transactionHash', function (hash) {
                        // La transacción ha sido creada.
                        //subscriber.next();
                        messageUtils.addMessageInfo({ text: 'Se inició la transacción para crear realizar la transferencia.' });
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        subscriber.next(donationIds);
                        messageUtils.addMessageSuccess({
                            title: 'Felicitaciones!',
                            text: `La transferencia ha sido confirmada`
                        });
                        entityUtils.refreshEntity(entityIdFrom);
                        entityUtils.refreshEntity(entityIdTo);
                    })
                    .on('error', function (error) {
                        //error.donation = donation;
                        console.error(`Error procesando transacción de transferencia de donaciones.`, error);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error transfiriendo las donaciones`,
                            error: error
                        });
                    });
            } catch (error) {
                //error.donation = donation;
                console.error(`Error realizando transferencia de donaciones`, error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error transfiriendo las donaciones`,
                    error: error
                });
            }
        });
    }

    /**
     * Marca como completado un Milestone en el Smart Contarct.
     * 
     * @param milestone a marcar como completado.
     */
    milestoneComplete(milestone, activity) {

        return new Observable(async subscriber => {

            try {
                let crowdfunding = await this.getCrowdfunding();

                // Se almacena en IPFS toda la información del Activity.
                let activityInfoCid = await activityIpfsConnector.upload(activity);

                let thisApi = this;
                let clientId = milestone.clientId;

                let promiEvent = crowdfunding.milestoneComplete(
                    milestone.id,
                    activityInfoCid,
                    {
                        from: activity.userAddress,
                        $extraGas: extraGas()
                    });

                promiEvent
                    .once('transactionHash', function (hash) {
                        // La transacción ha sido creada.
                        milestone.txHash = hash;
                        subscriber.next(milestone);
                        messageUtils.addMessageInfo({ text: 'Se inició la transacción para completar el milestone' });
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let milestoneId = parseInt(receipt.events['MilestoneComplete'].returnValues.milestoneId);
                        thisApi.getMilestoneById(milestoneId).then(milestone => {
                            milestone.clientId = clientId;
                            subscriber.next(milestone);
                            messageUtils.addMessageSuccess({
                                title: 'Felicitaciones!',
                                text: `El milestone ${milestone.title} ha sido completado`
                            });
                        });
                    })
                    .on('error', function (error) {
                        error.milestone = milestone;
                        console.error(`Error procesando transacción para completar el milestone.`, error);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error completando el milestone ${milestone.title}`,
                            error: error
                        });
                    });
            } catch (error) {
                error.milestone = milestone;
                console.error(`Error completando milestone`, error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error completando el milestone ${milestone.title}`,
                    error: error
                });
            }
        });
    }

    /**
     * Revisa el milestone para marcarlo como aprobado o no en el Smart Contarct.
     * 
     * @param milestone a revisar.
     */
    milestoneReview(milestone, activity) {

        return new Observable(async subscriber => {
            console.log('activity.isApprove', activity.isApprove);
            console.log('activity', activity);
            try {
                let crowdfunding = await this.getCrowdfunding();

                // Se almacena en IPFS toda la información del Activity.
                let activityInfoCid = await activityIpfsConnector.upload(activity);

                let thisApi = this;
                let clientId = milestone.clientId;

                let promiEvent = crowdfunding.milestoneReview(
                    milestone.id,
                    activity.isApprove,
                    activityInfoCid,
                    {
                        from: activity.userAddress,
                        $extraGas: extraGas()
                    });

                promiEvent
                    .once('transactionHash', function (hash) {
                        // La transacción ha sido creada.
                        milestone.txHash = hash;
                        subscriber.next(milestone);
                        let text = activity.isApprove ?
                            'Se inició la transacción para aprobar el milestone' :
                            'Se inició la transacción para rechazar el milestone';
                        messageUtils.addMessageInfo({ text: text });
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let milestoneId;
                        if (activity.isApprove) {
                            milestoneId = parseInt(receipt.events['MilestoneApprove'].returnValues.milestoneId);
                        } else {
                            milestoneId = parseInt(receipt.events['MilestoneReject'].returnValues.milestoneId);
                        }
                        thisApi.getMilestoneById(milestoneId).then(milestone => {
                            milestone.clientId = clientId;
                            subscriber.next(milestone);
                            if (activity.isApprove) {
                                messageUtils.addMessageSuccess({
                                    title: 'Felicitaciones!',
                                    text: `El milestone ${milestone.title} ha sido aprobado`
                                });
                            } else {
                                messageUtils.addMessageSuccess({
                                    title: 'Qué pena!',
                                    text: `El milestone ${milestone.title} ha sido rechazado`
                                });
                            }
                        });
                    })
                    .on('error', function (error) {
                        error.milestone = milestone;
                        console.error(`Error procesando transacción para revisión el milestone.`, error);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error revisando el milestone ${milestone.title}`,
                            error: error
                        });
                    });
            } catch (error) {
                error.milestone = milestone;
                console.error(`Error revisando milestone`, error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error revisando el milestone ${milestone.title}`,
                    error: error
                });
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

                let promiEvent = crowdfunding.milestoneWithdraw(
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
                        messageUtils.addMessageInfo({ text: 'Se inició la transacción para retirar los fondos del milestone' });
                    })
                    .once('confirmation', function (confNumber, receipt) {
                        // La transacción ha sido incluida en un bloque
                        // sin bloques de confirmación (once).
                        // TODO Aquí debería agregarse lógica para esperar
                        // un número determinado de bloques confirmados (on, confNumber).
                        let milestoneId = parseInt(receipt.events['MilestoneWithdraw'].returnValues.milestoneId);
                        thisApi.getMilestoneById(milestoneId).then(milestone => {
                            milestone.clientId = clientId;
                            subscriber.next(milestone);
                            messageUtils.addMessageSuccess({
                                title: 'Felicitaciones!',
                                text: `Los fondos del milestone ${milestone.title} han sido retirados`
                            });
                        });
                    })
                    .on('error', function (error) {
                        error.milestone = milestone;
                        console.error(`Error procesando transacción de retiro de fondos de milestone.`, error);
                        //let reason = await getRevertReason(milestone.txHash); // 'I accidentally killed it.'
                        //console.log(reason);
                        subscriber.error(error);
                        messageUtils.addMessageError({
                            text: `Se produjo un error retirando los fondos del milestone ${milestone.title}`,
                            error: error
                        });
                    })/*.catch(revertReason => {
                        console.log('revertReason', revertReason);
                    })*/;
            } catch (error) {
                error.milestone = milestone;
                console.error(`Error retirando fondos de milestone`, error);
                subscriber.error(error);
                messageUtils.addMessageError({
                    text: `Se produjo un error retirando los fondos del milestone ${milestone.title}`,
                    error: error
                });
            }
        });
    }

    /**
     * Obtiene todas las Activities desde el Smart Contract que coinciden con los
     * IDs especificados.
     * 
     * @param ids IDs de las activities a obtener.
     */
    getActivitiesByIds(ids) {
        return new Observable(async subscriber => {
            try {
                let activities = [];
                for (let i = 0; i < ids.length; i++) {
                    let activity = await this.getActivityById(ids[i]);
                    activities.push(activity);
                }
                subscriber.next(activities);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Activity a partir del ID especificado.
     * 
     * @param activityId de la Activity a obtener.
     * @returns Activity cuyo Id coincide con el especificado.
     */
    async getActivityById(activityId) {
        const crowdfunding = await this.getCrowdfunding();
        const activityOnChain = await crowdfunding.getActivity(activityId);
        console.log('activityOnChain', activityOnChain);
        const { id, infoCid, user, createdAt, milestoneId } = activityOnChain;
        // Se obtiene la información del Activity desde IPFS.
        const activityOnIpfs = await activityIpfsConnector.download(infoCid);
        const { action, message, items } = activityOnIpfs;
        return new Activity({
            id: parseInt(id),
            userAddress: user,
            createdAt: createdAt,
            milestoneId: parseInt(milestoneId),
            action: action,
            message: message,
            items: items
        });
    }

    /**
     * Obtiene todas los tipos de cambios de token.
     */
    getExchangeRates() {
        return new Observable(async subscriber => {
            try {

                // TODO Obtener los Exchage Rates desde el smart contract.
                let exchangeRates = [];

                // RBTC
                let exchangeRate = new ExchangeRate({
                    tokenAddress: '0x0000000000000000000000000000000000000000',
                    rate: new BigNumber(100000000000000),
                    date: Date.now()
                });

                exchangeRates.push(exchangeRate);

                subscriber.next(exchangeRates);
            } catch (error) {
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
    mapCampaignStatus(status) {
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

    async getGasPrice() {
        //const gasPrice = await web3.eth.getGasPrice();
        //return new BigNumber(parseInt(gasPrice));
        return new BigNumber(10000000000000);
    }

    async getCrowdfunding() {
        const network = await getNetwork();
        const { crowdfunding } = network;
        return crowdfunding;
    }

    async getCrowdfundingRaw() {
        const network = await getNetwork();
        const { crowdfundingRaw } = network;
        return crowdfundingRaw;
    }
}

export default new CrowdfundingContractApi();