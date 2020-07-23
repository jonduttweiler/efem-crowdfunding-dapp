import Campaign from '../../models/Campaign';
import getNetwork from './getNetwork';
import IpfsService from '../../services/IpfsService';
import { cleanIpfsPath } from '../helpers';
import extraGas from './extraGas';

/**
 * API encargada de la interacción con el Crowdfunding Smart Contract.
 */
class CrowdfundingContractApi {

    constructor() {

    }

    /**
     * Obtiene la Campaign a partir del ID especificado.
     * 
     * @param {*} id de la campaign a obtener.
     * @returns campaign cuyo Id coincide con el especificado.
     */
    async getCampaign(id) {
        var crowdfunding = await this.getCrowdfunding();
        var campaignOnChain = await crowdfunding.getCampaign(id);
        // Se obtiene la información de la Campaign desde IPFS.
        var info = await IpfsService.download(campaignOnChain.infoCid);
        return new Campaign({
            _id: campaignOnChain.id,
            title: info.title,
            description: info.description,
            image: info.image,
            imageUrl: IpfsService.resolveUrl(info.image),
            communityUrl: info.communityUrl,
            status: this.mapCampaingStatus(campaignOnChain.status),
            reviewerAddress: campaignOnChain.reviewer,
            ownerAddress: campaignOnChain.manager,
            commitTime: 0
        });
    }

    /**
     * Obtiene todas las Campaigns desde el Smart Contract.
     */
    async getCampaigns() {
        var crowdfunding = await this.getCrowdfunding();
        let ids = await crowdfunding.getCampaignIds();
        let campaigns = [];
        for (let i = 0; i < ids.length; i++) {
            var campaign = await this.getCampaign(ids[i]);
            campaigns.push(campaign);
        }
        return campaigns;
    }

    /**
     * Almacena una Campaing en el Smart Contarct.
     * 
     * @param {*} campaign a almacenar.
     * @param {*} onCreateTransaction callback invocado tras la creación de transacción.
     * @param {*} onConfirmation callback invocado tras la confirmación de la transacción.
     * @param {*} onError  callback invocado por la ocurrencia de un error.
     */
    async saveCampaign(campaign, onCreateTransaction, onConfirmation, onError) {
        try {
            var crowdfunding = await this.getCrowdfunding();

            // Se almacena en IPFS la imagen de la Campaign.
            let imageCid = await IpfsService.upload(campaign.image);
            campaign.image = imageCid;
            campaign.imageUrl = IpfsService.resolveUrl(imageCid);

            // Se almacena en IPFS toda la información de la Campaign.
            let infoCid = await IpfsService.upload(campaign.toIpfs());
            campaign.infoCid = infoCid;

            // Temporal hasta que exista la DAC previamente.
            /*let receipt = await crowdfunding.newDac(campaign.infoCid,
              {
                from: campaign.owner.address,
                $extraGas: extraGas()
              });*/
            // Temporal hasta que exista la DAC previamente.

            let promiEvent = crowdfunding.newCampaign(
                campaign.infoCid,
                //campaign.dacId,
                1,
                campaign.reviewerAddress,
                {
                    from: campaign.owner.address,
                    $extraGas: extraGas()
                });

            promiEvent
                .once('transactionHash', function (hash) {
                    campaign.txHash = hash;
                    onCreateTransaction(campaign);
                })
                .once('confirmation', function (confNumber, receipt) {
                    onConfirmation(campaign);
                })
                .on('error', function (error) {
                    console.error(`Error procesando transacción en Smart Contract`, error);
                    onError(error);
                });

        } catch (error) {
            console.error(`Error guardando campaign`, error);
            onError(error);
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
        } else if (status == 1) {
            return Campaign.CANCELED;
        } else {
            return Campaign.FINISHED;
        }
    }

    async getCrowdfunding() {
        const network = await getNetwork();
        const { crowdfunding } = network;
        return crowdfunding;
    }
}

export default CrowdfundingContractApi;