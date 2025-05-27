
import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, QueryCommand, PutCommandOutput, UpdateCommandOutput, QueryCommandOutput} from "@aws-sdk/lib-dynamodb";
import { IRepository } from "../../core/interfaces/outbound/IRepository";

export class DynamoRepository implements IRepository {

    private static instance: DynamoRepository;
    private docClient: DynamoDBDocumentClient;

    private constructor() {
        const client = new DynamoDBClient({ region: process.env.AWS_REGION});
        this.docClient = DynamoDBDocumentClient.from(client);
    }

    public static getInstance(): DynamoRepository {
        if (!DynamoRepository.instance) {
            DynamoRepository.instance = new DynamoRepository();
        }
        return DynamoRepository.instance;
    }

    public async put(command: PutCommand): Promise<PutCommandOutput> {
        try {
            return await this.docClient.send(command);
        } catch (error) {
            console.error("Error", error);
            throw new Error("Failed to execute PutCommand");
        }
    }

    public async update(command: UpdateCommand): Promise<UpdateCommandOutput> {
        try {
            return await this.docClient.send(command);
        } catch (error) {
            console.error("Error", error);
            throw new Error("Failed to execute UpdateCommand");
        }
    }

    public async query(command: QueryCommand): Promise<QueryCommandOutput> {
        try {
            return await this.docClient.send(command);
        } catch (error) {
            console.error("Error", error);
            throw new Error("Failed to execute QueryCommand");
        }
   }
}