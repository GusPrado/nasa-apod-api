const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const count = 5;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let apiResults = [];
let favorites = {};

const showContent = (page) => {
  if (page === 'apiResults') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
  window.scroll({
    top: 0,
    behavior: 'instant',
  });
  loader.classList.add('hidden');
};
const createDOMNodes = (page) => {
  const currentItems =
    page === 'apiResults' ? apiResults : Object.values(favorites);

  currentItems.forEach((picture) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const link = document.createElement('a');
    link.href = picture.hdurl;
    link.title = 'View full image';
    link.target = '_blank';
    const image = document.createElement('img');
    image.src = picture.url;
    image.alt = 'NASA Picture of the day!';
    image.loading = 'lazy';
    image.classList.add('card-image-top');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = picture.title;
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'apiResults') {
      saveText.textContent = 'Add to favorites';
      // saveText.onclick = () => saveFavorite('${picture.url}')
      saveText.setAttribute('onclick', `saveFavorite('${picture.url}')`);
    } else {
      saveText.textContent = 'Remove favorites';
      saveText.setAttribute('onclick', `removeFavorite('${picture.url}')`);
    }
    const cardText = document.createElement('p');
    cardText.textContent = picture.explanation;
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    const date = document.createElement('strong');
    date.textContent = picture.date;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${picture.copyright || ''}`;
    // Append section
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
};

const updateDOM = (page) => {
  if (localStorage.getItem('nasaApodFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaApodFavorites'));
  }
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
};

const getNasaPictures = async () => {
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    apiResults = await response.json();
    console.log(apiResults);
    updateDOM('apiResults');
  } catch (e) {
    console.error(e);
  }
};

const saveFavorite = (itemUrl) => {
  apiResults.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      localStorage.setItem('nasaApodFavorites', JSON.stringify(favorites));
    }
  });
};

const removeFavorite = (itemUrl) => {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem('nasaApodFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
};

getNasaPictures();
