import { QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { IQueryListResponse } from "../inbound/IQueryListResponse";

export interface IResponseBuilder {
  listResponse(result: QueryCommandOutput): IQueryListResponse;
}