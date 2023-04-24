const express = require('express')
const app = express()
var bodyParser = require('body-parser');
const auth = require('./middleware/auth')
const db = require('./database/db')
const port = 3000
app.use(bodyParser.json())

app.post('/login', (req, res) => {
  auth.login(req, res);
});

app.get('/employee/:id/salaries', auth.authenticateJWT, auth.salaryAccess, (req, res) => {
	db.getEmployeeSalaries(req, res);
});

app.get('/employee/:id', auth.authenticateJWT, auth.ownInformationAccess, (req, res) => {
	db.getEmployee(req, res);
});

app.use(auth.requestLogger)
// Middle ware and other uses for the app
app.use(auth.errorLogger)
app.use(auth.errorResponder)
app.use(auth.invalidPathHandler)

app.listen(port, () => {
  console.log(`AWS Restart Backend listening on port ${port}`)
})