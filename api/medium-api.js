const axios = require("axios");

exports.processArticleID = function(ArticleID) {
  const options = {
    method: 'GET',
    url:  `https://medium2.p.rapidapi.com/article/${ArticleID}/markdown`,
    headers: {
      'X-RapidAPI-Key': 'b83c966179msh44339ccc6092613p1a153bjsn48337fdc835a',
      'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
    }
  };
    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
};

