export class CreditInformation {
  SerialNo: number;
  CrAccountOrChallanNo: string;
  CrAmount: number;
  TranMode: string;
  Onbehalf: string;

  constructor(data: Partial<CreditInformation>) {
    this.SerialNo = data.SerialNo || 0;
    this.CrAccountOrChallanNo = data.CrAccountOrChallanNo || '';
    this.CrAmount = data.CrAmount || 0;
    this.TranMode = data.TranMode || '';
    this.Onbehalf = data.Onbehalf || '';
  }
}

export class PaymentRequestData {
  OrgCode: string;
  CampusCode: string;
  StudentCode: string;
  InvoiceNo: string;
  InvoiceDate: string;
  RequestTotalAmount: number;
  CustomerName: string;
  CustomerContactNo: string;
  CustomerAddress: string;
  Email: string;
  ResponseUrl: string;
  AllowDuplicateInvoiceNoDate: string;
  CreditInformations: CreditInformation[];

  constructor(data: Partial<PaymentRequestData>) {
    this.OrgCode = data.OrgCode || '';
    this.CampusCode = data.CampusCode || '';
    this.StudentCode = data.StudentCode || '';
    this.InvoiceNo = data.InvoiceNo || '';
    this.InvoiceDate = data.InvoiceDate || '';
    this.RequestTotalAmount = data.RequestTotalAmount || 0;
    this.CustomerName = data.CustomerName || '';
    this.CustomerContactNo = data.CustomerContactNo || '';
    this.CustomerAddress = data.CustomerAddress || '';
    this.Email = data.Email || '';
    this.ResponseUrl = data.ResponseUrl || '';
    this.AllowDuplicateInvoiceNoDate = data.AllowDuplicateInvoiceNoDate || 'N';

    // Map CreditInformations to CreditInformation class
    this.CreditInformations = (data.CreditInformations || []).map(
      ci => new CreditInformation(ci)
    );
  }
} // <-- This closing brace was missing
