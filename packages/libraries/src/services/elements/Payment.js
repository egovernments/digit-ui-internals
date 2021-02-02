import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const PaymentService = {
  fetchBill: (tenantId, filters = {}) =>
    Request({
      url: Urls.payment.fetch_bill,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
    }),

  createReciept: (tenantId, details = {}) =>
    Request({
      url: Urls.payment.create_reciept,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId },
      data: { ...details },
    }),

  getReciept: (tenantId, businessservice, filters = {}) =>
    Request({
      url: businessservice ? `${Urls.payment.print_reciept}/${businessservice}/_search` : `${Urls.payment.print_reciept}/_search`,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
    }),

  generatePdf: (tenantId, data = {}) =>
    Request({
      url: Urls.payment.generate_pdf,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, key: "consolidatedreceipt" },
      data: data,
    }),

  printReciept: (tenantId, filters = {}) =>
    Request({
      url: Urls.payment.file_store,
      useCache: false,
      method: "GET",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
    }),

  createCitizenReciept: (tenantId, details = {}) =>
    Request({
      url: Urls.payment.create_citizen_reciept,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId },
      data: { ...details },
    }),

  updateCitizenReciept: (transactionId) =>
    Request({
      url: Urls.payment.update_citizen_reciept,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { transactionId },
    }),
};
