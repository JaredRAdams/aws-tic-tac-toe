// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
AWS.config.update({ region: 'us-west-2' });
const ses = new AWS.SES({ apiVersion: '2010-12-01' });


const sendMessage = async ({ email, gameId }) => {
  const params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: 'You have been invited to play tic tac toe, the game ID is ' + gameId
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'tic tac toe invitation'
      }
    },
    Source: 'adamsj37@wwu.edu'
  };

  return ses.sendEmail(params).promise();
};

module.exports = sendMessage;
