const jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_KEY = process.env.JWT_KEY


const users = [
	{
			username: 'john',
			password: 'password123admin',
			role: 'admin'
	}, {
			username: 'anna',
			password: 'password123member',
			role: 'member'
	}
];

const requestLogger = (request, response, next) => {
    console.log(`${request.method} url:: ${request.url}`);
    next()
}

// Error handling Middleware functions
const errorLogger = (error, request, response, next) => {
  console.log( `error ${error.message}`)
	// console.log(request)
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

const login = (req, res, next) => {
	const { username, password } = req.body;

	const user = users.find(u => { return u.username === username && u.password === password });

	if (user) {
		// Generate an access token
		const accessToken = jwt.sign({ username: user.username,  role: user.role }, JWT_KEY);

		res.json({
			accessToken
		});
	} else {
		res.send('Username or password incorrect');
	}
}


module.exports = { 
	authenticateJWT, 
	invalidPathHandler, 
	errorResponder, 
	errorLogger, 
	requestLogger, 
	login
};