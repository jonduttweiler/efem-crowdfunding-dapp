import Campaign from '../../models/Campaign';
import getNetwork from './getNetwork';
import IpfsService from '../../services/IpfsService';
import extraGas from './extraGas';
import { Observable } from 'rxjs'

/**
 * API encargada de la interacción con el Crowdfunding Smart Contract.
 */
class CrowdfundingContractApi {

    constructor() {

    }

    /**
     * Obtiene todas las Campaigns desde el Smart Contract.
     */
    getCampaigns() {
        return new Observable(async subscriber => {
            try {
                var crowdfunding = await this.getCrowdfunding();
                let ids = await crowdfunding.getCampaignIds();
                let campaigns = [];
                for (let i = 0; i < ids.length; i++) {
                    var campaignOnChain = await crowdfunding.getCampaign(ids[i]);
                    // Se obtiene la información de la Campaign desde IPFS.
                    var info = await IpfsService.download(campaignOnChain.infoCid);
                    campaigns.push(new Campaign({
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
                    }));
                }
                subscriber.next(campaigns);
            } catch (error) {
                subscriber.error(error);
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