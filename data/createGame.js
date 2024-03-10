// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require("uuid/v4");
const sendMessage = require("./sendMessage");



const createGame = async ({ creator, opponentEmail }) => {
  var gameId = uuidv4().split('-')[0];
  const params = {
    TableName: "turn-based-game",
    Item: {
      gameId: gameId,
      user1: creator,
      user2: "",
      square1: 0,
      square2: 0,
      square3: 0,
      square4: 0,
      square5: 0,
      square6: 0,
      square7: 0,
      square8: 0,
      square9: 0,
      lastMoveBy: creator
    }
  };

  try {
    await documentClient.put(params).promise();
  } catch (error) {
    console.log("Error creating game: ", error.message);
    throw new Error("Could not create game");
  }

  try {
    await sendMessage({ email: opponentEmail, gameId: gameId });
  } catch (error) {
    console.log("Error sending email: ", error.message);
    throw new Error("Could not send email to Player 2");
  }

  return params.Item;
};

module.exports = createGame;
