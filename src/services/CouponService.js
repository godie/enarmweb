import axios from "axios";
import BaseService from "./BaseService";

class CouponService extends BaseService {
  static getCoupons() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL("v2/coupons/me"), headers);
  }
}

export default CouponService;
