// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const performMove = async ({ gameId, user, changedSquare, changedSquareValue }) => {
  if (!(changedSquareValue == 1 || changedSquareValue == 2)) {
    throw new Error("Cannot set square value to different value than 1 or 2");
  }
  console.log(user);
  const params = {
    TableName: "turn-based-game",
    Key: {
      gameId: gameId
    },
    UpdateExpression: `SET lastMoveBy = :user, ${changedSquare} = :changedSquareValue`,
    ConditionExpression: `(user1 = :user OR user2 = :user) AND lastMoveBy <> :user`,
    ExpressionAttributeValues: {
      ":user": user,
      ":changedSquareValue": changedSquareValue
    },
    ReturnValues: "ALL_NEW"
  };
  try {
    const resp = await documentClient.update(params).promise();
    return resp.Attributes;
  } catch (error) {
    console.log("Error updating item: ", error.message);
    throw new Error("Error updating table")
  }
};

module.exports = performMove;
