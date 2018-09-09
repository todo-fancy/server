module.exports = (id) => {
  const mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;

  return new ObjectId(id);
}