const Todo = require('../db/todo.model');
const tcomb = require('tcomb');

const updateSchema = tcomb.struct(
  {
    id: tcomb.String,
    description: tcomb.maybe(tcomb.String),
    deadline: tcomb.maybe(tcomb.Date),
    done: tcomb.maybe(tcomb.Boolean)
  },
  { strict: true }
);

async function update(req, res) {
  try {
    const result = await Todo.findByIdAndUpdate(req.params.id, {
      $set: req.body
    });
    return res.send({ id: result._id, status: 'Todo Updated' });
  } catch (e) {
    return res.status(500).send('An error occurred: ' + e);
  }
}

module.exports = {
  update,
  updateSchema
};
