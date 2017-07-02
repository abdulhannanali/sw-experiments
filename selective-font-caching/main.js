const fontsText = document.getElementById('fonts-text');
const cachingComplete = document.getElementById('caching-complete');

const ALL_FONTS = [
  'Fresca',
  'Indie Flower',
  'Lobster',
  'Rationale',
  'Alegreya', 
  'EB Garamond', 
  'Archivo Narrow', 
  'Acme',
  'Cuprum', 
  'Francois One', 
  'Average',
  'Play',
  'Catamaran', 
  'Questrial',
  'Dancing Script', 
  'Exo 2',
  'Abril Fatface', 
  'Bree Serif'
];

const COLORS = [
  'AD1457',
  '0277BD',
  'E64A19',
  '880E4F',
  '388E3C',
  'FFD600',
  'd50000'
]

if ('serviceWorker' in navigator) {
  const initialController = navigator.serviceWorker.controller;
  navigator.serviceWorker.register('./serviceWorker.js').then(function (registration) {
    const controller = navigator.serviceWorker.controller;
    let serviceWorker;
    displayFontsText(controller);

    if (registration.installing) {
      serviceWorker = registration.installing;
      serviceWorker.addEventListener('statechange', function (event) {
        const state = event.target.state;
        if (state === 'installed' && !initialController) {
          console.log('Future visits to this page will be controlled by ServiceWorker');
          displayCachingComplete();
        }
      });
    }
  });
}



function displayFontsText(controlled) {
  const uncontrolledText = 'This page is not controlled by service worker, please reload the page to start using service worker';
  const controlledText = 'This page is controlled by the ServiceWorker <3'

  ALL_FONTS.forEach(font => {
    const textHead = document.createElement('h1');
    textHead.textContent = controlled ? controlledText : uncontrolledText;
    textHead.style.fontFamily = font;
    textHead.style.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    fontsText.appendChild(textHead);
  });
}

function displayCachingComplete () {
  cachingComplete.style.display = 'block';
}