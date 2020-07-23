import Campaign from '../models/Campaign';

class CampaignCache {

    constructor() {
        this.campaigns = null;
        this.total = 0;
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
}

export default CampaignCache;