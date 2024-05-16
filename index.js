import express from 'express';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3000;

const urlDatabase = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.post('/shorten', (req, res) =>{
  const {longUrl} = req.body;

  if (isValidUrl(longUrl)) {
    const shortUrl = generateShortUrl();
    urlDatabase[shortUrl] = longUrl;
    const shortenedLink = `http://localhost:${PORT}/${shortUrl}`;
    res.send(`
    <div class="shortened-link" style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; text-align:center">
    <h2 style="color: #333;">Short URL:</h2>
    <a href="${shortenedLink}" target="_blank" style="color:blue; text-decoration: none;"> ${shortenedLink}</a>
  </div>
  `);
  } else {
    res.status(400).send('Invalid URL');
  }
});

app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl];

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function generateShortUrl() {
  return nanoid(6); 
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
