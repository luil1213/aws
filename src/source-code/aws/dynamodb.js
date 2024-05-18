const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocument, 
  GetCommand,
  PutCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const { AWS_REGION, DYNAMODB_TABLE } = require("../utils/constants");

const dynamodbClient = new DynamoDB({ region: AWS_REGION });
const dynamodb = DynamoDBDocument.from(dynamodbClient);

const getDynamoDBItem = async (key) => {

  const params = {
    TableName: DYNAMODB_TABLE,
    Key: key,
  };
  console.info("GET PARAMS", params);

  try {
    const command = new GetCommand(params);
    const response = await dynamodb.send(command);

    if (response.Item) {
      return response.Item;
    } else {
      return "No hay registros";
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const putDynamoDBItem = async (id, titulo) => {
  const params = {
    TableName: DYNAMODB_TABLE,
    Item:{
      id: id,
      titulo: titulo,
    } 
  };
  console.info("PUT PARAMS", params);

  try {
    const command = new PutCommand(params);
    await dynamodb.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const deleteDynamoDBItem = async (key) => {
  const params = {
    TableName: DYNAMODB_TABLE,
    Key: key,
  };
  console.info("DELETE PARAMS", params);

  try {
    const command = new DeleteCommand(params);
    await dynamodb.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//funcion post para crear un nuevo registro
const createUSU = async (id, titulo, fecha) => {
  try {
    const params = {
      TableName: DYNAMODB_TABLE,
      Item: {
        id,
        titulo,
        fecha,
        
      },
    };
    console.info({ msg: "PARAMS", params });

    await dynamodb.put(params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getDynamoDBItem,
  putDynamoDBItem,
  deleteDynamoDBItem,
  createUSU,
};
