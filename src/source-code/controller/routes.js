const express = require("express");
const multer  = require('multer');
const { StatusCodes } = require("http-status-codes");

const upload = multer({ storage: multer.memoryStorage() });

// Importing the functions from the DynamoDB SDK
const {
  createUSU,
  putDynamoDBItem,
  getDynamoDBItem,
  deleteDynamoDBItem,
} = require("../aws/dynamodb");

// Importing the functions from the S3 SDK
const {
  uploadS3File,
  ListS3Files,
  getS3File,
  deleteS3File,
} = require("../aws/s3");

const api = express.Router();
//funcion para crear nuevos elementos en base de datos funcionando
api.post("/path1", async (request, response) => {
  try {
    console.info({ msg: "BODY", body: request.body });

    const { id, titulo, fecha } =request.body;
    if (!id || !titulo || !fecha ) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "falta un campo" });
    }
    
    await createUSU(id, titulo, fecha);


    response
      .status(StatusCodes.OK)
      .json({ msg: "Datos ingresados correctamente" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Erro" });
  }
});
//funcion get funcionando
api.get("/capturar/:id", async (request, response) => {
  try {
    console.info("params", request.params);

    const id = request.params.id;

    const dynamoDBItem = await getDynamoDBItem({ id });
    console.info(`DynamoDB Item With ID ${id}`, dynamoDBItem);

    response.status(StatusCodes.OK).json(dynamoDBItem);
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});




api.post("/path2", upload.single("file"), async (request, response) => {
  try {
    console.info("BODY", request.file);

    const fileInfo = request.file;
    console.info("FILE INFO", fileInfo);

    const { originalname, buffer, mimetype } = fileInfo;

    // Upload a file to S3
    await uploadS3File({ key: originalname, buffer, mimetype });

    // List all files from S3
    const s3Files = await ListS3Files();
    console.info("S3 Files", s3Files);

    // Get the file from S3
    const s3File = await getS3File(originalname);
    console.info(`S3 File With Name ${originalname}`, s3File);

    // Delete the file from S3
    await deleteS3File(originalname);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Hello from path2" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

module.exports = api;
