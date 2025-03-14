export async function BulkMI(
  request: IBulkMIRequest
): Promise<IBulkMIResponse> {
  let url = "/m3api-rest/v2/execute?";
  const params = new URLSearchParams();
  params.append("format", "COMPACT");
  if (request.cono) {
    params.append("cono", request.cono.toString());
  }
  if (request.divi) {
    params.append("divi", request.divi);
  }
  if (request.maxReturnedRecords) {
    params.append("maxrecs", request.maxReturnedRecords?.toString() ?? "0");
  }
  if (request.extendedResult) {
    params.append("extendedresult", request.extendedResult ? "true" : "false");
  }

  // only send in params, not in body
  delete request.extendedResult;

  const resp = await fetch(url + params.toString(), {
    
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await resp.json()
  if (data.wasTerminated || data.nrOfFailedTransactions) {
    throw data
  }
  return data;
}

export interface IBulkMIRequest {
  program: string;
  cono?: number;
  divi?: string;
  lanc?: string;
  locale?: string;
  timeZone?: string;
  dateFormat?: string;
  excludeEmptyValues?: boolean;
  rightTrim?: boolean;
  maxReturnedRecords?: number;
  extendedResult?: boolean;
  transactions: {
    transaction: string;
    record: { [key: string]: string };
    selectedColumns?: string[];
  }[];
}

export interface IBulkMIResponse{
  results: {
    transaction: string;
    parameters?: { [key: string]: string };
    errorMessage?: string;
    errorCode?: string;
    errorCfg?: string;
    errorField?: string;
    errorType?: string;
    notProcessed?: boolean;
    records?: any[];
  }[];

  bulkJobId?: string;
  wasTerminated?: boolean;
  terminationReason?: string;
  terminationErrorType?: string;
  nrOfNotProcessedTransactions?: number;
  nrOfFailedTransactions?: number;
  nrOfSuccessfullTransactions?: number;
}
