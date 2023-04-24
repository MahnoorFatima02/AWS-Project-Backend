const jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_KEY = process.env.JWT_KEY
const db = require('../database/db')

const requestLogger = (request, response, next) => {
    console.log(`${request.method} url:: ${request.url}`);
    next()
}

// Error handling Middleware functions
const errorLogger = (error, request, response, next) => {
  console.log( `error ${error.message}`)
  next(error) // calling next middleware
}

const errorResponder = (error, request, response, next) => {
  response.header("Content-Type", 'application/json')
    
  const status = error.status || 400
  response.status(status).send(error.message)
}

const invalidPathHandler = (request, response, next) => {
  response.status(400)
  response.send('invalid path')
}

const authenticateJWT = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if ( req.path == '/login') return next();

	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, JWT_KEY, (err, user) => {
			if (err) {
				return res.sendStatus(403);
			}
			req.user = user;
			next();
		});
	} else {
		res.sendStatus(401);
	}
};

const login = async function(req, res, next) {
	const { username, password } = req.body;

	const user = await db.getUser(parseInt(username), password);
	if (user != null) {
		const accessToken = jwt.sign({ sub: user.emp_no, role: user.role }, JWT_KEY, {
			expiresIn: "2h"
		});
		res.json({accessToken});
	} else {
		res.status(401).send('Username or password incorrect');
	}
}

const isManager = (req) => {
	if(req.user.role === 'manager') {
		return true
	}
	return false
}

const hasUserSufficientRights = (req) => {
	const employeeNo = parseInt(req.params.id)
	if(req.user.sub === employeeNo) {
		return true
	}
	return false
}

const salaryAccess = async function(req, res, next) {
	if (isManager(req) || hasUserSufficientRights(req)) {
		return next();
	}
	return res.sendStatus(403);
}

const ownInformationAccess = async function(req, res, next) {
	if (hasUserSufficientRights(req)) {
		return next();
	}
	return res.sendStatus(403);
}

module.exports = {
	authenticateJWT, 
	invalidPathHandler, 
	errorResponder, 
	errorLogger, 
	requestLogger, 
	login,
	salaryAccess,
	ownInformationAccess
};
