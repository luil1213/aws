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
    //consulta de elementos
    const busqueda = new GetCommand(params);
    const respuesta = await dynamodb.send(busqueda);

    //validar item existente para eliminar
    if (respuesta.Item) {
    const validado = new DeleteCommand(params);
    await dynamodb.send(validado);
    return "Elemento eliminado";
  } else {
      return "Error intentando eliminar";
    }
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
const updateCompanyData = async ( data) => {
  try {
    const id = data.id;
    const titulo = data.titulo;
    const fecha = data.fecha;
    const params = {
      TableName: DYNAMODB_TABLE,
      Key: {
        id,
      
      },
      
      UpdateExpression: `set titulo = :ti, fecha = :fe `,
                       // "SET RelatedItems = :ri, ProductReviews = :pr",
      ExpressionAttributeValues: {
        ":ti": titulo,
        ":fe": fecha,

      },
    };
    console.info({ msg: "PARAMS", params });

    await dynamodb.update(params);
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
  updateCompanyData
};
