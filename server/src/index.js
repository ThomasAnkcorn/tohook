const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const useJwtAuth = require('./auth');
const User = require('./db/user.model');
const validate = require('tcomb-validation-middleware');
const Todo = require('./todo');
const Task = require('./task');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load('../env.production.local');
}

require('./db/init');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());

const { auth, protection } = useJwtAuth(passport, User);

app.use('/auth', auth);

app.get('/check', protection(), (req, res) => res.send({ status: 'okay' }));

app.post('/todo', protection(), validate(Todo.createSchema), Todo.create);

app.get('/todo', protection(), validate(Todo.getSchema), Todo.get);

app.put('/todo/:id', protection(), validate(Todo.updateSchema), Todo.update);

app.delete('/todo/:id', protection(), validate(Todo.removeSchema), Todo.remove);

app.post('/todo/:id/task/', protection(), validate(Task.addTaskSchema), Task.addTask);

app.put('/todo/task/:taskid', protection(), validate(Task.updateTaskSchema), Task.updateTask);

app.delete('/todo/task/:taskid', protection(), validate(Task.deleteTaskSchema), Task.deleteTask);

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`server started on port http://${process.env.HOST}:${process.env.PORT}`);
});

module.exports = app;
