import { PutCommand, UpdateCommand, QueryCommand, UpdateCommandOutput, QueryCommandOutput, PutCommandOutput} from "@aws-sdk/lib-dynamodb";

export interface IRepository {
  put: (command: PutCommand) => Promise<PutCommandOutput>;
  update:(command: UpdateCommand) => Promise<UpdateCommandOutput>;
  query: (command: QueryCommand) => Promise<QueryCommandOutput>;
}