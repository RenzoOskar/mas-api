import { SQSEvent } from "aws-lambda";
import { ICreateRequest } from "../interfaces/inbound/ICreateRequest";
import { IAppointmentServiceRds } from "../interfaces/IServiceRds";
import { RdsRepositoryPE } from "../../adapters/outbound/RdsRepositoryPE";
import { RdsRepositoryCL } from "../../adapters/outbound/RdsRepositoryCL";
import { IRdsRepository } from "../interfaces/outbound/IRdsRepository";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

export class AppointmentServiceRds implements IAppointmentServiceRds {

    private RdsRepositoryPE = new RdsRepositoryPE();
    private RdsRepositoryCL = new RdsRepositoryCL();
    private eventBridge = new EventBridgeClient({ region: process.env.AWS_REGION });

    async createAppointment(event: SQSEvent): Promise<string> {
        console.log(event)
        try {
        let records = event.Records || [];
        for (let record of records) {
            const body = JSON.parse(record.body);
            console.log(record.body)
            const message =  JSON.parse(body.Message) as ICreateRequest
            console.log("Parsed message:", message);
            let repository = this.getRepositoryByCountry(message.countryISO);
            await repository.putItem(message);
            await this.emitEvent(message);
        }

        return "Todos los mensajes SQS procesados con éxito";
        } catch (error) {
            console.error("Error:", error);
            throw new Error("Failed to create appointment");
        }
    }

    private getRepositoryByCountry(countryISO: string): IRdsRepository {
    switch (countryISO) {
      case "PE":
        return this.RdsRepositoryPE;
      case "CL":
        return this.RdsRepositoryCL;
      default:
        throw new Error("unsupported countryISO: " + countryISO);
    }
  }

    private async emitEvent(item: ICreateRequest): Promise<void> {
    let event = {
      Entries: [
        {
          EventBusName: process.env.EVENT_BUS_NAME!,
          Source: "lambda",
          DetailType: "AppointmentCompleted",
          Detail: JSON.stringify({
            insuredId: item.insuredId,
            scheduleId: item.scheduleId,
            status: "COMPLETED"
          })
        }
      ]
    };

    try {
        console.log("Sending event to EventBridge:", JSON.stringify(event));
        let result = await this.eventBridge.send(new PutEventsCommand(event));;
        console.log("EventBridge response:", JSON.stringify(result));
    } catch (err) {
        console.error("Failed to send event to EventBridge:", err);
        throw err;
    }
  }
}