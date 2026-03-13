import axios from "axios";
import BaseService from "./BaseService";

class PaymentService extends BaseService {
  static createCheckoutSession(params) {
    const headers = this.getHeaders();
    return axios.post(BaseService.getURL("payments/create-checkout-session"), params, headers);
  }
}

export default PaymentService;
