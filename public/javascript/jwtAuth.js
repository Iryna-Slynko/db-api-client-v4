
const clientUrl = "http://localhost:3000";

function displayStatus () {
  const accessToken = localStorage.getItem('accessToken');
  const expirationDate = new Date(Number.parseInt(localStorage.getItem('expirationDate')));
  const isExpired = expirationDate < new Date();
  let status;

  if (!accessToken) {
    status = 'There is no access token present in local storage, meaning that you are not logged in. <a href="#" onclick="checkSession()">Click here to attempt an SSO login</a>';
  } else if (isExpired) {
    status = 'There is an expired access token in local storage. <a href="#" onclick="checkSession()">Click here to renew it</a>';
  } else {
    status = `There is an access token in local storage, and it expires on ${expirationDate}. <a href="#" onclick="checkSession()">Click here to renew it</a>`;
  }
  console.log("status: ", status);

  if (accessToken && !isExpired) {
    $('#login').hide();
    $('#logout').show();
    $('#get-profile').show();
    loadProducts();
  } else {
    $('#get-profile').hide();
    $('#logout').hide();
    $('#login').show();
  }
}

function getAccessToken () {
  return localStorage.getItem('accessToken');
}

function saveAuthResult (result) {
  localStorage.setItem('accessToken', result.accessToken);
  localStorage.setItem('idToken', result.idToken);
  localStorage.setItem('expirationDate', Date.now() + Number.parseInt(result.expiresIn) * 1000);
  displayStatus();
}

function checkSession () {
  auth0WebAuth.checkSession({
    responseType: 'token id_token',
    timeout: 5000,
    usePostMessage: true
  }, function (err, result) {
    if (err) {
      alert(`Could not get a new token using silent authentication (${err.error}). Opening login page...`);
      $('#app').hide();
      $('#logout').hide();
      $('#login').show();
    } else {
      saveAuthResult(result);
    }
  });
}

// Login
document.querySelector("#login").addEventListener("click", function(event) {
  event.preventDefault();
  auth0WebAuth.authorize({ returnTo: clientUrl });
  console.log("Logged in");
}, false);

// Logout
document.querySelector("#logout").addEventListener("click", function(event) {
  event.preventDefault();
  localStorage.clear();
  auth0WebAuth.logout({ returnTo: clientUrl });
  console.log("Logged out");
}, false);

// get profile
document.querySelector("#get-profile").addEventListener("click", async function(event) {
  event.preventDefault();

  auth0Authentication.userInfo(getAccessToken(), (err, usrInfo) => {
    if (err) {
          // handle error
      console.error('Failed to get userInfo');
      return;
    }

    // Output result to console (for testing purposes) 
    console.log(usrInfo);
    document.querySelector("#results pre").innerHTML = JSON.stringify(usrInfo, null, 2);
  });

}, false);


// When page is loaded
window.onload = (event) => {
    // execute this code
    auth0WebAuth.parseHash(function (err, result) {
      if (result) {
        saveAuthResult(result);
      }
    });
  // kick off display status
  displayStatus();
};



