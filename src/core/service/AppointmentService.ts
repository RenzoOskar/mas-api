import { IAppointmentService } from "../interfaces/IService";
import { ICreateRequest } from "../interfaces/inbound/ICreateRequest";
import { QueryBuilder } from "../../adapters/outbound/QueryBuilder";
import { DynamoRepository } from "../../adapters/outbound/DynamoRepository";
import { IUpdateRequest } from "../interfaces/inbound/IUpdateRequest";
import { SQSEvent } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { ResponseBuilder } from "../../adapters/outbound/ResponseBuilder";
import { IQueryListResponse } from "../interfaces/inbound/IQueryListResponse";

export class AppointmentService implements IAppointmentService {
    
  private queryBuilder = new QueryBuilder();
  private dynamoRepository = DynamoRepository.getInstance();
  private snsClient = new SNSClient({ region: "us-east-1" });
  private snsTopicArn = process.env.SNS_TOPIC_ARN || "";
  private responseBuilder = new ResponseBuilder();

  async createAppointment(request: ICreateRequest): Promise<string> {
    try {
      let input = this.queryBuilder.create(request);
      await this.dynamoRepository.put(input);
      await this.snsClient.send(new PublishCommand({
        TopicArn: this.snsTopicArn,
        Message: JSON.stringify(request),
      }))
      return "El agendamiento esta en proceso";

    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to create appointment");
    }
  }

  async updateAppointment(event: SQSEvent): Promise<string> {
    console.log("event",event)
    try {
      let records = event.Records || [];
      for (let record of records) {
          const body = JSON.parse(record.body);
          console.log(record.body)
          let detail =  body.detail as IUpdateRequest;
          let input = this.queryBuilder.update(detail);
          console.log("input:", input);
          await this.dynamoRepository.update(input);    
      }
      return "success";
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to update appointment");
    }
  }

  async getAppointments(insuredId: string): Promise<IQueryListResponse> {
    try {
      const input = this.queryBuilder.query(insuredId);
      let data = await this.dynamoRepository.query(input)
      
      return this.responseBuilder.listResponse(data);

    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to retrieve appointments");
    }
  }
}