// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const Joi = require("joi");

const extractError = error => {
  return error.details[0].message;
};

// Request body validation for the POST /users endpoint
const validateCreateUser = body => {
  const schema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(8).max(20).required(),
    username: Joi.string().min(4).max(20).required(),
  });

  const result = Joi.validate(body, schema);
  if (result.error) {
    return {
      valid: false,
      message: extractError(result.error)
    };
  }
  return {
    valid: true
  };
};

// Request body validation for the POST /games endpoint
const validateCreateGame = body => {
  const schema = Joi.object().keys({
    opponent: Joi.string().email({ minDomainAtoms: 2 }).required()
  });

  const result = Joi.validate(body, schema);
  if (result.error) {
    return {
      valid: false,
      message: extractError(result.error)
    };
  }
  return {
    valid: true
  };
};

// Request body validation for the POST /games/:gameIdendpoint
const validatePerformMove = body => {
  const schema = Joi.object().keys({
    //TODO make sure move is not a non existent square
    changedSquare: Joi.string().valid('square1', 'square2', 'square3', 'square4', 'square5', 'square6', 'square7', 'square8', 'square9').required(),
    changedSquareValue: Joi.number().min(1).max(2).required()
  });

  const result = Joi.validate(body, schema);
  if (result.error) {
    return {
      valid: false,
      message: extractError(result.error)
    };
  }
  return {
    valid: true
  };
};

module.exports = {
  validateCreateUser,
  validateCreateGame,
  validatePerformMove
};
