/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 05:01:09
 * @modify date 2018-09-10 05:01:09
 * @desc [description]
*/
import swaggerDoc from "./swaggerDoc";
import decompose from "./decompose";

class Store {
    constructor() {
    }
    swaggerDoc = new swaggerDoc();
    decompose = new decompose(this.swaggerDoc);
}
export default new Store();