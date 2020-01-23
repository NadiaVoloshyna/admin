const router = require('express').Router();
const Person = require('../models/person');
const Asset = require('../models/asset');
const GoogleApi = require('../services/google');
const { query, body, check } = require('express-validator');
const { createQueryForPagination } = require('../helpers/resolvers');
const handleError = require('../helpers/handleError');
const errorHandler = require('../middlewares/errorHandler');

/**
 * Get subset of persons based of query parameters
 */
router.get('/', [
  query('offset').exists().escape().isNumeric(),
  query('searchTerm').exists().escape(),
  query('sort').exists().escape().isIn([
    'ascending',
    'descending',
    'newest',
    'older'
  ]),
], errorHandler, async (req, res) => {
  try {
    const { query, options } = createQueryForPagination({ ...req.query});
    const persons = await Person.paginate(query, options);

    const response = {
      persons: persons.docs,
      pagination: {
        total: persons.total,
        limit: persons.limit,
        offset: persons.offset
      }
    }

    res.send(response);
  } catch (error) {
    handleError.custom(res, 500, error);
  }
});

/**
 * Get single person
 */
router.get('/:id', [
  check('id').isMongoId()
], errorHandler, async (req, res) => {
  let person, 
    documentMeta = null
    _id = req.params.id;

  if (!_id) {
    res.status(404).end();
  };

  // Get person from database
  try {
    const document = await Person
      .findOne({ _id })
      .populate('professions.profession')
      .populate('professions.media');

    person = document.toJSON();
  } catch (error) {
    return handleError.custom(res, 500, error);
  }

  // Get Google Doc Metadata by id
  try {
    const response = await GoogleApi.getFileMeta(person.biography.documentId);

    if (response && response.data) {
      const { modifiedTime, lastModifyingUser, permissions } = response.data;
      documentMeta = {
        modifiedTime,
        lastModifyingUser: lastModifyingUser.displayName,
        permissions: permissions.filter(item => item.role !== 'owner')
      };
    } else {
      throw new Error("Couldn't fetch file's metadata");
    }
  } catch (error) {
    return handleError.custom(res, 500, error);
  }
  
  const responseBody = {
    ...person,
    biography: {
      ...person.biography,
      documentMeta
    }
  };

  console.log('responseBody', responseBody);

  res.status(200).send(responseBody)
});

/**
 * Create person
 * 1. Find person in DB
 * 2. If person exists, exit
 * 3. If person not exists create google document for the person
 * 4. Create person
 * 5. If document creation failed continue creating person
 * 6. If document was created add document id to persons data
 */
router.post('/', [
  body('name').isString().escape(),
], errorHandler, async (req, res) => {
  // 1. Get current user
  const userId = req.user._id;
  const { name } = req.body;
  let person, documentId, newPerson, rootAsset;

  // Check if person exists
  try {
    person = await Person.findOne({ name });

    if (person) {
      // Person with this name is already exist
      res.status(409).send({
        id: person._id,
        name: person.name
      });
      return;
    }
  } catch (error) {
    return handleError.custom(res, 500, error);
  }

  // Create google document for current person
  try {
    const { data } = await GoogleApi.createDocument(name);
    
    if (data.id) {
      documentId = data.id;
    };
  } catch (error) {
    return handleError.custom(res, 500, error);
  }

  try {
    rootAsset = await new Asset({
      type: 'FOLDER',
      name,
      createdBy: userId
    }).save();
  } catch (error) {
    return handleError.custom(res, 500, error);
  }

  // Create person
  try {
    newPerson = await new Person({
      name,
      rootAssetId: rootAsset._id,
      createdBy: userId,
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
});

/**
 * Delete one or multiple persons
 * 1. Try to delete google docs asocciated with persons
 * 2. If above is success delete persons
 * 3. If google docs deletion fails do not delete persons
 */
router.delete('/', [
  body('ids').exists().isArray({min: 1}).withMessage('At least one id is required'),
  body('documentIds').exists().isArray({min: 1}).withMessage('At least one documentId is required')
], errorHandler, async (req, res) => {
  const { ids, documentIds } = req.body;

  try {
    GoogleApi.deleteDocuments(documentIds, (error) => {
      if (error) throw Error(error)
    });
    
    await Person.deleteMany({ 
      _id: ids
    });

    res.status(200).end();
    return;
  } catch (error) {
    return handleError.custom(res, 500, error);
  }
});

/**
 * Update single person
 */
router.put('/:id', [
  check('id').isMongoId(),
  body('name').isString().not().isEmpty().escape(),
  body('portrait').if(body('portrait').exists()).isString().escape(),
  body('born').if(body('born').exists()).isString().escape(),
  body('died').if(body('died').exists()).isString().escape(),
], errorHandler, async (req, res) => {
  const { portrait, born, died, professions } = req.body;
  const { id } = req.params;

  try {
    await Person.updateOne(
      { _id: id },
      { 
        portrait,
        born,
        died,
        professions
      }
    );
  } catch (error) {
    return handleError.custom(res, 500, error);
  }

  res.status(200).end();
});

module.exports = router;