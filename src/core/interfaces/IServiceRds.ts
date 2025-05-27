import { SQSEvent } from "aws-lambda";

export interface IAppointmentServiceRds {
  createAppointment(request: SQSEvent): Promise<string>;
}