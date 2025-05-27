import { ICreateRequest } from "./inbound/ICreateRequest";
import { SQSEvent } from "aws-lambda";
import { IQueryListResponse } from "./inbound/IQueryListResponse";

export interface IAppointmentService {
  createAppointment(request: ICreateRequest): Promise<string>;
  updateAppointment(event: SQSEvent): Promise<string>;
  getAppointments(insuredId: string): Promise<IQueryListResponse>;
}