import { ICreateRequest } from "../inbound/ICreateRequest";

export interface IRdsRepository {
  putItem: (item: ICreateRequest) => Promise<void>;
}