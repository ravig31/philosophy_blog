const axios = require('axios');
const Article = require('./../models/article');

exports.processArticleID = async function(ArticleID) {
  const articleInfo = {
    method: 'GET',
    url:  `https://medium2.p.rapidapi.com/article/${ArticleID}`,
    headers: {
      'X-RapidAPI-Key': 'b83c966179msh44339ccc6092613p1a153bjsn48337fdc835a',
      'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
    }
  };

  const markdown = {
    method: 'GET',
    url:  `https://medium2.p.rapidapi.com/article/${ArticleID}/markdown`,
    headers: {
      'X-RapidAPI-Key': 'b83c966179msh44339ccc6092613p1a153bjsn48337fdc835a',
      'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
    }
  };

  try {
    const [markdownResponse, infoResponse] = await Promise.all([
      axios.request(markdown),
      axios.request(articleInfo)
    ]);

      // process title out of markdown
      const markdownLines = markdownResponse.data.markdown.split('\n');
      const processedMarkdown = markdownLines.slice(2).join('\n');

    

    return {
      title: infoResponse.data.title,
      description: infoResponse.data.subtitle,
      markdown: processedMarkdown,
      origURL: infoResponse.data.url
    }

  }catch (error) {
    console.error(error);
  }
};

