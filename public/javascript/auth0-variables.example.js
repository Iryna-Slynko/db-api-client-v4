const AUTH0_CLIENT_ID = '';
const AUTH0_DOMAIN = '.eu.auth0.com';
const AUDIENCE = 'https://product-api';
const AUTH0_CALLBACK_URL = 'http://localhost:3000';


const auth0WebAuth = new auth0.WebAuth({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID,
  redirectUri: AUTH0_CALLBACK_URL,
  responseType: 'id_token token',
  audience: AUDIENCE
});

const auth0Authentication = new auth0.Authentication(auth0WebAuth, {
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID
});
