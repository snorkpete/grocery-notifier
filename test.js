var request = require('request');

let url = 'https://api.stackexchange.com/2.2/users/11742/notifications/unread?key=U4DMV*8nvpm3EOpvf69Rxw((&site=stackoverflow&access_token=wgocCevaKplEHssz2q(xBQ))&filter=default';

request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('response:', JSON.parse(body)); // Print the HTML for the Google homepage.
});
