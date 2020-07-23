import Campaign from '../models/Campaign';
import getNetwork from '../lib/blockchain/getNetwork';
import IPFSService from '../services/IPFSService';
import { cleanIpfsPath } from '../lib/helpers';
import extraGas from '../lib/blockchain/extraGas';

class CrowdfundingBlockchain {

    constructor() {
        // Los datos no están cacheados, por lo se utiliza el API.

    }

    async getCampaigns() {
        const network = await getNetwork();
        const { crowdfunding } = network;
        let ids = await crowdfunding.getCampaignIds();
        let campaigns = [];
        for (let i = 0; i < ids.length; i++) {
            var campaignOnChain = await crowdfunding.getCampaign(ids[i]);
            console.log(campaignOnChain);
            var info = await IPFSService.download(campaignOnChain.infoCid);
            campaigns.push(new Campaign({
                _id: campaignOnChain.id,
                title: info.title,
                description: info.description,
                image: info.image,
                imageUrl: IPFSService.resolveUrl(info.image),
                communityUrl: info.communityUrl,
                status: this.mapCampaingStatus(campaignOnChain.status),
                reviewerAddress: campaignOnChain.reviewer,
                ownerAddress: campaignOnChain.manager,
                commitTime: 0
            }));
        }
        console.log(campaigns);
        return campaigns;
    }

    async saveCampaign(campaign, onSave, onConfirmation, onError) {
        console.log(campaign.image);
        let imageCid = await IPFSService.upload(campaign.image);
        // Save the new image address and mark it as old
        campaign.image = imageCid;
        campaign.imageUrl = IPFSService.resolveUrl(imageCid);
        //campaign.newImage = false;
        // Se sube en IPFS un JSON con la información de la Campaign.
        let infoCid = await IPFSService.upload(campaign.toIpfs());
        campaign.infoCid = infoCid;

        try {
            const network = await getNetwork();
            const { crowdfunding } = network;

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
                    //txHash = hash;
                    //if (campaign.id) await campaigns.patch(campaign.id, campaign.toFeathers(txHash));
                    //else id = (await campaigns.create(campaign.toFeathers(txHash)))._id;
                    //afterSave(null, !campaign.projectId, `${etherScanUrl}tx/${txHash}`);
                    // will be fired once the receipt is mined
                    campaign.txHash = hash;
                    //campaignCache.save(campaign);
                    onSave(campaign);
                })
                .once('confirmation', function (confNumber, receipt) {
                    onConfirmation(campaign);
                })
                .on('error', function (error) {
                    console.error(`Error procesando transacción de guardado de campaign`, error);
                    onError(error);
                });
        } catch (error) {
            console.error(`Error guardando campaign`, error);
            onError(error);
        }
    }

    mapCampaingStatus(status) {
        if (status == 0) {
            return Campaign.ACTIVE;
        }
        return Campaign.CANCELED;
    }

    setData(campaigns, total) {
        this.campaigns = campaigns;
        this.total = total;
    }

    save(campaign) {
        this.campaigns.push(campaign);
        this.total++;
    }
}

export default CrowdfundingBlockchain;