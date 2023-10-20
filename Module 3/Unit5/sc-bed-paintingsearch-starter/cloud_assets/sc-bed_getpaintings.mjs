import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ExecuteStatementCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = 'eu-south-1'; // Change this to match your region

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true'
};

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION })
);

const fetchNext = async (searchTerm, nextToken = '') => {
  const commandInput = {
    Statement: 'SELECT * FROM "sc-bed_paintings" WHERE contains(artist_name, ?) or contains(work_name, ?)',
    Parameters: [String(searchTerm), String(searchTerm)]
  };
  if (nextToken !== '') {
    commandInput.NextToken = nextToken;
  }
  const command = new ExecuteStatementCommand(commandInput);
  return await docClient.send(command);
};

export const handler = async (event) => {
  const searchTerm = event.queryStringParameters?.searchTerm ?? '';
  
  let data = '';
  if (searchTerm === '') {
    data = {
      'status': false,
      'result': null,
      'error': 'A search query was not provided.'
    };
    return { 
      'headers': headers,
      body: JSON.stringify(data) 
    };
  }

  try {
    let items = [];
    let nextToken = '';
    for (;;) {
      const result = await fetchNext(searchTerm, nextToken);
      items = items.concat(result.Items);
      if ((!('LastEvaluatedKey' in result)) || result.LastEvaluatedKey === undefined) break;
      nextToken = result.NextToken;
    }

    data = {
      'status': true,
      'result': items,
      'error': null
    };
    
    return { 
      'headers': headers,
      body: JSON.stringify(data) 
    };
  } catch (err) {
    data = {
      'status': false,
      'result': null,
      'error': err
    };
    return { 
      'headers': headers,
      body: JSON.stringify(data)  
    };
  }
};
