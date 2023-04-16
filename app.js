const express = require('express')
const app = express()
var bodyParser = require('body-parser');
const auth = require('./middleware/auth')
const port = 3000
app.use(bodyParser.json())

const employeeSalaries = [
	{
			"employeeNumber": "1234",
			"salary": "4000",
			"department": "HR",
	},
	{
		"employeeNumber": "1254",
		"salary": "4020",
		"department": "HR",
	},
	{
		"employeeNumber": "1237",
		"salary": "4100",
		"department": "HR",
	}
];

app.post('/login', (req, res) => {
  auth.login(req, res);
});

app.get('/employeeSalaries', auth.authenticateJWT, (req, res) => {
    res.json(employeeSalaries);
});

app.use(auth.requestLogger)
// Middle ware and other uses for the app
app.use(auth.errorLogger)
app.use(auth.errorResponder)
app.use(auth.invalidPathHandler)

app.listen(port, () => {
  console.log(`AWS Restart Backend listening on port ${port}`)
})