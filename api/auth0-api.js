var axios = require("axios").default;

var options = {
  method: 'PATCH',
  url: 'https://dev-3w13u2voxkka7vrf.us.auth0.com/api/v2/users/USER_ID',
  headers: {authorization: 'Bearer ABCD', 'content-type': 'application/json'},
  data: {user_metadata: {picture: 'https://example.com/some-image.png'}}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});