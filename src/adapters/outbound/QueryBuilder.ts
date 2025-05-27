import { PutCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { IQueryBuilder } from "../../core/interfaces/outbound/IQueryBuilder";
import { ICreateRequest } from "../../core/interfaces/inbound/ICreateRequest";
import { IUpdateRequest } from "../../core/interfaces/inbound/IUpdateRequest";

export class QueryBuilder implements IQueryBuilder {
  create(item: ICreateRequest): PutCommand {
    return new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `INSURED#${item.insuredId}`,
        SK: `SCHEDULE#${item.scheduleId}`,
        insuredId: item.insuredId,
        scheduleId: item.scheduleId,
        countryISO: item.countryISO,
        status: "PENDING",
      },
    });
  }

  update(item: IUpdateRequest ): UpdateCommand {
    console.log("Updating item:", item);
    return new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `INSURED#${item.insuredId}`,
        SK: `SCHEDULE#${item.scheduleId}`,
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": item.status,
      },
    });
  }

  query(insuredId: string): QueryCommand {
    return new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "PK = :insuredId",
      ExpressionAttributeValues: {
        ":insuredId": `INSURED#${insuredId}`,
      },
    });
  }
}