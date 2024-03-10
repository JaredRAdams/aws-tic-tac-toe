// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
AWS.config.update({ region: 'us-west-2' });
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendMessage = require('./sendMessage')

const handlePostMoveNotification = async ({ game, mover, opponent }) => {
  // Handle when game is finished
    var hasWon = false;
    console.log(game)
    if (game.square1 == game.square2 && game.square2 == game.square3 && !(game.square1 == 0)) {
      hasWon = true;
      console.log("line 14");
    }
    if (game.square1 == game.square4 && game.square4 == game.square7 && !(game.square1 == 0)) {
      hasWon = true;
      console.log("line 18");
    }
    if (game.square1 == game.square5 && game.square5 == game.square9 && !(game.square1 == 0)) {
      hasWon = true;
      console.log("line 22");
    }
    if (game.square2 == game.square5 && game.square5 == game.square8 && !(game.square2 == 0)) {
      hasWon = true;
      console.log("line 26");
    }
    if (game.square3 == game.square6 && game.square6 == game.square9 && !(game.square3 == 0)) {
      hasWon = true;
      console.log("line 30");
    }
    if (game.square3 == game.square5 && game.square5  == game.square7 && !(game.square3 == 0)) {
      hasWon = true;
      console.log("line 34");
    }
    if (game.square4 == game.square5 && game.square5 == game.square6 && !(game.square4 == 0)) {
      hasWon = true;
      console.log("line 38");
    }
    if (game.square7 == game.square8 && game.square8 == game.square9 && !(game.square7 == 0)) {
      hasWon = true;
      console.log("line 42");
    }
    if (!(game.square1 == 0 || game.square2 == 0 || game.square3 == 0 || game.square4 == 0 || game.square5 == 0 || game.square6 == 0 || game.square7 == 0 || game.square8 == 0 || game.square9 == 0 || hasWon)){
      const tieEmail = {
        Destination: {
          ToAddresses: [mover.email, opponent.email]
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: 'The game has finished in a tie'
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'tic tac toe result'
          }
        },
        Source: 'adamsj37@wwu.edu'
      };
    
      try {
        await ses.sendEmail(tieEmail).promise();
      } catch (error) {
        console.log("Error sending tie email: ", error.message);
        throw new Error("Could not send email to users");
      }

      return
    }

    if (hasWon == true) {
      
      const wonEmail = {
        Destination: {
          ToAddresses: [mover.email]
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: 'You have won the game of tic tac toe!'
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'tic tac toe result'
          }
        },
        Source: 'adamsj37@wwu.edu'
      };

      const loseEmail = {
        Destination: {
          ToAddresses: [opponent.email]
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: 'You have lost the game of tic tac toe!'
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'tic tac toe result'
          }
        },
        Source: 'adamsj37@wwu.edu'
      };
      
      await ses.sendEmail(wonEmail).promise();
      await ses.sendEmail(loseEmail).promise();

      return
    }

    const gameEmail = {
      Destination: {
        ToAddresses: [opponent.email]
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: 'Your opponent has moved, it is your turn!'
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'tic tac toe update'
        }
      },
      Source: 'adamsj37@wwu.edu'
    };

    await ses.sendEmail(gameEmail).promise()
};

module.exports = handlePostMoveNotification;
