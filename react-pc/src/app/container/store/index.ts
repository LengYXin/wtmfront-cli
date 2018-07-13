import model from "./model";
class Store {
    constructor() {
        console.log("------Model", this.Model);
    }
    Model = new model();
}
export default new Store();