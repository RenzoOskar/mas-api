import { PutCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ICreateRequest } from "../inbound/ICreateRequest";
import { IUpdateRequest } from "../inbound/IUpdateRequest";

export interface IQueryBuilder {
  create: (item: ICreateRequest) => PutCommand;
  update: (item: IUpdateRequest) => UpdateCommand;
  query: (insuredId: string) => QueryCommand;
}