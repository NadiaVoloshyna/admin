const Person = require('../../models/person');
const Asset = require('../../models/asset');
const GoogleApi = require('../../services/google');
const { body } = require('express-validator');
const handleError = require('../../helpers/handleError');
const errorHandler = require('../../middlewares/errorHandler');
const ac = require('../../../accesscontrol.config');

// 1. Check if user has permissions to create a person
const checkPermissions = (req, res, next) => {
  const user = req.user;
  const permission = ac.can(user.role).createOwn('person');

  if (permission.granted) {
    next();
  } else {
    res.status(403).end();
  }
}

// 2. Check if we already have this person in database
const findResource = async (req, res, next) => {
  const { name } = req.body;

  // Check if person exists
  try {
    const person = await Person.findOne({ name });

    if (person) {
      // Person with this name exist
      return res.status(409).send({
        id: person._id,
        name: person.name
      });
    }
    
  } catch (error) {
    return handleError.custom(res, 500, error);
  }

  next();
}

// 3.Create google document for the person
const createGoogleDoc = async (req, res, next) => {
  const { name } = req.body;

  // Create google document for current person
  try {
    const { data } = await GoogleApi.createDocument(name);
    
    if (data.id) {
      documentId = data.id;
      res.locals.documentId = documentId;

      next();
    };
  } catch (error) {
    return handleError.custom(res, 500, error);
  }
}

// 4. Create root asset for the person
const createAsset = async (req, res, next) => {
  const { name } = req.body;
  const user = req.user;

  try {
    const rootAsset = await new Asset({
      type: 'FOLDER',
      name,
      createdBy: user._id
    }).save();

    res.locals.rootAssetId = rootAsset._id;
    next();
  } catch (error) {
    return handleError.custom(res, 500, error);
  }
}

// 5. Create person
const createPerson = async (req, res) => {
  const user = req.user;
  const { name } = req.body;
  const { documentId, rootAssetId } = res.locals;
  let newPerson;

  // Create person
  try {
    newPerson = await new Person({
      name,
      rootAssetId,
      createdBy: user._id,
      biography: {
        documentId
      }
    }).save();
  } catch (error) {
    return handleError.custom(res, 500, error);
  }

  res.status(302).send({
    id: newPerson._id,
    name: newPerson.name
  });
}

module.exports = (router) => {
  router.post('/', [
    body('name').isString().escape(),
  ], 
    errorHandler,
    checkPermissions,
    findResource,
    createGoogleDoc,
    createAsset,
    createPerson
  )
}