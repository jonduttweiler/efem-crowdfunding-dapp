import DAC from '../../models/DAC';
import Campaign from '../../models/Campaign';
import getNetwork from './getNetwork';
import IpfsService from '../../services/IpfsService';
import extraGas from './extraGas';
import { Observable } from 'rxjs'
import web3 from 'web3';

/**
 * API encargada de la interacción con el Crowdfunding Smart Contract.
 */
class CrowdfundingContractApi {

    constructor() {

    }


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
    async saveDAC(dac,onCreateTransaction,onConfirmation,onError){
        const crowdfunding = await this.getCrowdfunding(); //Esto puede ponerse como variable de instancia??

        console.log("Saving dac on CrowdfundingContractApi");

        // Se almacena en IPFS toda la información de la dac.
        dac.image = await IpfsService.upload(dac.image);
        dac.imageUrl = await IpfsService.resolveUrl(dac.image);
        dac.infoCid = await IpfsService.upload(dac.toIpfs());
        console.log(dac.infoCid);
        console.log("owner:"+dac.owner.address)

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
                var crowdfunding = await this.getCrowdfunding();
                let ids = await crowdfunding.getCampaignIds();
                let campaigns = [];
                for (let i = 0; i < ids.length; i++) {
                    var campaignOnChain = await crowdfunding.getCampaign(ids[i]);
                    // Se obtiene la información de la Campaign desde IPFS.
                    var info = await IpfsService.downloadJson(campaignOnChain.infoCid);
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
     * Realiza el mapping de los estados de las dac en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la dac en el smart contract.
     * @returns estado de la dac en la dapp.
     */
    mapDACStatus(status) {
        switch(status){
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