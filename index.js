const form = document.querySelector('form');
const apiKeyInput = form.querySelector('#apiKeyInput');
const memeUrlInput = form.querySelector('#memeUrlInput');
const resultPara = document.querySelector('#resultPara');
const resultImage = document.querySelector('img');

const onSubmit = (event) => {
  event.preventDefault();
  console.log('form submitted!', event);
  const memeUrl = memeUrlInput.value;
  const apiKey = apiKeyInput.value || localStorage.getItem('apiKey');
  localStorage.setItem('apiKey', apiKey);
  resultImage.src = memeUrl;

  getOcrResult(memeUrl, apiKey)
    .then(formatResponse)
    .then((memeText) => resultPara.textContent = memeText.toUpperCase())
    .catch(console.error);
};

const getOcrResult = (memeUrl, apiKey) => {
  const apiUrl = 'https://eastus.api.cognitive.microsoft.com/vision/v1.0/ocr'; 
  const params = {
    "language": "unk",
    "detectOrientation ": "true",
  };
  const paramsString = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
  const encodedUrl = `${apiUrl}?${encodeURI(paramsString)}`;

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': apiKey
  });

  const fetchOptions = {
    method: 'POST',
    headers,
    body: `{"url": "${memeUrl}"}`
  };

  return fetch(encodedUrl, fetchOptions)
    .then((response) => response.json())
};

const formatResponse = (response) => {
  return new Promise((resolve, reject) => {
    console.log(response);
    const flatResponse = response.regions.map((region) => {
      return region.lines.map((line) => {
        return line.words.reduce((wordstring, word) => {
          return `${wordstring} ${word.text}`;
        }, '');
      }).join('');
    }).join('');

    console.log(flatResponse);
    resolve(flatResponse);
  });
};

form.addEventListener('submit', onSubmit);











