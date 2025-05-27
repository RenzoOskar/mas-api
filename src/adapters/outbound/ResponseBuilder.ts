import { QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { IResponseBuilder } from "../../core/interfaces/outbound/IResponseBuilder";
import { IQueryListResponse, IAppointmentDTO } from "../../core/interfaces/inbound/IQueryListResponse";

export class ResponseBuilder implements IResponseBuilder {
  public listResponse(result: QueryCommandOutput): IQueryListResponse {
    const { Items } = result;

    const response: IQueryListResponse = {
      data: (Items || []).map((item) => ({
        scheduleId: item.scheduleId,
        insuredId: item.insuredId,
        countryISO: item.countryISO,
        status: item.status,
      })),
    };

    return response;
  }
}