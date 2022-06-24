import { nanoid } from 'nanoid'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, QueryCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { PinResults, PinStatus, Pin, PinQuery } from './schema'

// used to filter props when querying dynamodb
export const PinStatusAttrs = ['requestid', 'status', 'created', 'pin', 'delegates', 'info']

type DynamoDBConfig = {
  table: string
  client: DynamoDBDocumentClient
}

export default class DynamoDBPinningService implements DynamoDBConfig {
  table: string
  client: DynamoDBDocumentClient

  constructor (table = 'PinStatus', client = new DynamoDBClient({})) {
    this.table = table
    this.client = DynamoDBDocumentClient.from(client)
  }

  /**
   * Insert a new PinStatus for userid
   */
  async addPin (userid: string, pin: Pin) {
    return addPin(this, userid, pin)
  }
  
  /**
   * Find PinStatus objects for userid that match query. Returns pins with status: `pinned` by default
   */
  async getPins (userid: string, query: PinQuery) {
    return getPins(this, userid, query)
  }

  async getPinByRequestId (userid: string, requestid: string) {
    return getPinByRequestId(this, userid, requestid)
  }

  async replacePinByRequestId (userid: string, requestid: string, pin: Pin) {
    return replacePinByRequestId(this, userid, requestid, pin)
  }

  async deletePinByRequestId (userid: string, requestid: string) {
    return deletePinByRequestId(this, userid, requestid)
  }
}

export async function addPin ({ client, table }: DynamoDBConfig, userid: string, pin: Pin): Promise<PinStatus> {
  const status: PinStatus = {
    requestid: `${Date.now()}-${nanoid(13)}`,
    status: 'queued',
    created: new Date().toISOString(),
    pin,
    delegates: [],
    info: {}
  }
  await client.send(new PutCommand({ 
    TableName: table, 
    Item: {
      ...status,
      userid
    } 
  }))
  return status
}

export async function getPins ({ client, table }: DynamoDBConfig, userid: string, query: PinQuery): Promise<PinResults> {
  const status = Array.isArray(query.status) ? query.status : Array.of(query.status || 'pinned')  
  const dbQuery: QueryCommandInput = { 
    TableName: table,
    // gotta sidestep dynamo reserved words!?
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: { 
      ":u": userid,
      ...toInFilter(status).Values
    },
    KeyConditionExpression: "userid = :u",
    FilterExpression: `#status IN (${toInFilter(status).Expresssion})`,
    ProjectionExpression: PinStatusAttrs.map(x => x === 'status' ? '#status' : x).join(', '),
    ScanIndexForward: false, // most recent pins first plz
    Limit: Number(query.limit) || 10
  }
  const res = await client.send(new QueryCommand(dbQuery))
  const body: PinResults = { 
    count: res.Count || 0, 
    results: res.Items as PinStatus[]
  }
  return body
}

export async function getPinByRequestId ({ client, table }: DynamoDBConfig, userid: string, requestid: string): Promise<PinStatus> {
  const res = await client.send(new GetCommand({ 
    TableName: table, 
    Key: { userid, requestid },
    AttributesToGet: PinStatusAttrs
  }))
  return res.Item as PinStatus
}

export async function replacePinByRequestId ({ client, table }: DynamoDBConfig, userid: string, requestId: string, pin: Pin): Promise<PinStatus> {
  throw new Error('Not Implemented')
}

export async function deletePinByRequestId ({ client, table }: DynamoDBConfig, userid: string, requestId: string): Promise<void> {
  throw new Error('Not Implemented')
}

// gross. i have no idea how they expect you to write an IN query with this shit.
export function toInFilter(arr: string[]) {
  const Expresssion = arr.map(k => `:${k}`).join(', ')
  let Values = {}
  // @ts-ignore
  arr.forEach(k => Values[`:${k}`] = k)
  return { Expresssion, Values }
}