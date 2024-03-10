const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const updateUser = async ({ gameId, user }) => {
  const params = {
    TableName: "turn-based-game",
    Key: {
      gameId: gameId
    },
    UpdateExpression: 'SET user2 = :user',
    ExpressionAttributeValues: {
      ":user": user
    },
    ReturnValues: "ALL_NEW"
  };
  try {
    const resp = await documentClient.update(params).promise();
    return resp.Attributes;
  } catch (error) {
    console.log("Error updating User2: ", error.message);
    throw new Error('Could not add User2')
  }
};

module.exports = updateUser;