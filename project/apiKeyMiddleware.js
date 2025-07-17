function apiKeyMiddleware(req, res, next) {
  // Get the API key sent in request header 'x-api-key'
  const apiKey = req.header('x-api-key');

  // Get the correct API key from environment variable
  const expectedApiKey = process.env.API_KEY;

  // If no API key was sent, stop and send an error
  if (!apiKey) {
    return res.status(401).send('API Key is missing');
  }

  // If API key sent does not match the correct one, stop and send an error
  if (apiKey !== expectedApiKey) {
    return res.status(403).send('API Key is invalid');
  }

  // API key is correct, let the request continue
  next();
}

module.exports = apiKeyMiddleware;
