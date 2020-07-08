const { body, check } = require('express-validator');
const Asset = require('../../models/asset');
const handle400 = require('../../middlewares/errorHandlers/handle400');

module.exports = (router) => {
  /**
   * Update asset
   * @param action String
   * @param payload Object
   */
  router.put('/:id', [
    check('id').exists().isMongoId(),
    body('action').exists().isIn(['move']),
    body('payload').exists(),
  ], handle400, async (req, res) => {
    const { id } = req.params;
    const { action, payload } = req.body;

    try {
      if (action === 'move') {
        await Asset.findOneAndUpdate({ _id: id }, { parent: payload.parentId });

        return res.status(200).end();
      }

      return req.handle400('Invalid action.');
    } catch (error) {
      req.handle500(error);
    }
  });
};
