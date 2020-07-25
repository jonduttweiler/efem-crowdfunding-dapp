/**
 * Cache encargada de mantener los datos de la Dac
 * localmente en la dapp.
 */
class DacCache {

    constructor() {
        this.dacs = [];
    }

    getById(id) {
        return this.dacs.find(dac => dac.id === id);
    }

    getData() {
        return this.dacs;
    }

    setData(dacs) {
        this.dacs = dacs;
    }

    save(dac) {
        this.dacs.push(dac);
    }

    updateByTxHash(dac) {
        const idx = this.dacs.findIndex(d => d.txHash === dac.txHash);
        if (idx >= 0) {
            return this.dacs[idx];
        }
    }
}

export default DacCache;