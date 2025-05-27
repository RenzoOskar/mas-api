import { SQSEvent } from "aws-lambda";
import { AppointmentServiceRds } from "../../core/service/AppointmentServiceRds";

export async function handler(event: SQSEvent): Promise<String>{

const service = new AppointmentServiceRds();

  try {
    if (event.Records && event.Records.length > 0) {
        let msg = await service.createAppointment(event);
        return msg;
    } else {
        return "no hay mensajes SQS para procesar";
    }  
  } catch (error) {
        console.error("Error processing appointment_pe SQS event:", error);
        return "Internal Server Error";
  }
};