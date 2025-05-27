import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from "aws-lambda";
import { ICreateRequest } from "../../core/interfaces/inbound/ICreateRequest";
import { AppointmentService } from "../../core/service/AppointmentService";

export async function handler(event: APIGatewayProxyEvent | SQSEvent): Promise<APIGatewayProxyResult> {
    console.log("Lambda invoked with event:", JSON.stringify(event));
    const service = new AppointmentService();

    try {
        if ("httpMethod" in event) {
            switch (event.httpMethod) {
            case 'POST':
                if (event.path === '/appointment') {
                    const body = JSON.parse(event.body || '{}') as ICreateRequest;
                    if (!body.insuredId ||typeof body.insuredId !== 'string' ||!body.scheduleId || typeof body.scheduleId !== 'number' ||!body.countryISO ||(body.countryISO !== 'PE' && body.countryISO !== 'CL')
                        ) {
                            return {
                                statusCode: 400,
                                body: JSON.stringify({ message: "Request inválido" }),
                            };
                        }
                    let msg = await service.createAppointment(body);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ msg }),
                    };
                }
                break;
            case 'GET':
                if (event.path.startsWith('/appointments/')) {
                    const insuredId = event.pathParameters?.insuredId || '';
                    let msg = await service.getAppointments(insuredId);
                    if (!msg || msg.data.length === 0) {
                        return {
                            statusCode: 404,
                            body: JSON.stringify({ message: "No se encontraron citas" }),
                        };
                    } else {
                        return {
                            statusCode: 200,
                            body: JSON.stringify({ msg }),
                        };
                    }
                }
                break;
            }
        } else if ("Records" in event && event.Records.length > 0 && event.Records[0].eventSource === 'aws:sqs' ) {
            let msg = await service.updateAppointment(event);
            return {
                statusCode: 200,
                body: JSON.stringify({ msg }),
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Error en el request' }),
        }
    } catch (error) {
        console.error("Error", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
}
