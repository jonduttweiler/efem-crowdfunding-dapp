/**
 * Cache encargada de mantener los datos de la campaign
 * localmente en la dapp.
 */
class CampaignCache {

    constructor() {
        this.campaigns = null;
        this.total = 0;
    }

    getById(id) {
        for (let i = 0; i < this.campaigns.length; i++) {
            const campaign = this.campaigns[i];
            if(campaign.id = id) {
                return campaign;
            }            
        }
    }

    getData() {
        if (this.campaigns == null) {
            return null;
        } else {
            return {
                campaigns: this.campaigns,
                total: this.total
            };
        }
    }

    setData(campaigns, total) {
        this.campaigns = campaigns;
        this.total = total;
    }

    save(campaign) {
        this.campaigns.push(campaign);
        this.total++;
    }

    updateByTxHash(campaign) {
        for (let i = 0; i < this.campaigns.length; i++) {
            const c = this.campaigns[i];
            if(c.txHash = campaign.txHash) {
                this.campaigns[i] = campaign;
                break;
            }            
        }
    }
}

export default CampaignCache;