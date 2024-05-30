(function () {
  const searchController = document.querySelector('#searchWrapper');
  const searchbar = searchController.querySelector('#searchbar');
  const displayWrapper = document.querySelector('#display');
  const mainDisplayGrid = displayWrapper.querySelector('#mainPanel');
  const sideDisplaySection = displayWrapper.querySelector('#sidePanel');
  const siteDefaultMessage = displayWrapper.querySelector('#siteEntryMsg');
  const siteContextMessage = displayWrapper.querySelector('#siteEntryContext');

  const activePokeInformation = displayWrapper.querySelector('#pokeContext');
  const pokeSpriteFrontDefault = activePokeInformation.querySelector('[data-front-default]');
  const pokeSpriteBackDefault = activePokeInformation.querySelector('[data-back-default]');
  const pokeSpriteFrontShiny = activePokeInformation.querySelector('[data-front-shiny]');
  const pokeSpriteBackShiny = activePokeInformation.querySelector('[data-back-shiny]');
  const pokeName = activePokeInformation.querySelector('#pokemonName');

  const GRID_DIMENSIONS = 5;
  const GRID_TOTAL = GRID_DIMENSIONS ** 2;
  let dataCounter = 1;

  const POKEMON_TYPING_COLOR_HEXCODES = [
    {
      "type": "NORMAL",
      "color": "#A8A77A"
    },
    {
      "type": "FIRE",
      "color": "#EE8130"
    },
    {
      "type": "WATER",
      "color": "#6390F0"
    },
    {
      "type": "ELECTRIC",
      "color": "#F7D02C"
    },
    {
      "type": "GRASS",
      "color": "#7AC74C"
    },
    {
      "type": "ICE",
      "color": "#96D9D6"
    },
    {
      "type": "FIGHTING",
      "color": "#C22E28"
    },
    {
      "type": "POISON",
      "color": "#A33EA1"
    },
    {
      "type": "GROUND",
      "color": "#E2BF65"
    },
    {
      "type": "FLYING",
      "color": "#A98FF3"
    },
    {
      "type": "PSYCHIC",
      "color": "#F95587"
    },
    {
      "type": "BUG",
      "color": "#A6B91A"
    },
    {
      "type": "ROCK",
      "color": "#B6A136"
    },
    {
      "type": "GHOST",
      "color": "#735797"
    },
    {
      "type": "DRAGON",
      "color": "#6F35FC"
    },
    {
      "type": "DARK",
      "color": "#705746"
    },
    {
      "type": "STEEL",
      "color": "#B7B7CE"
    },
    {
      "type": "FAIRY",
      "color": "#D685AD"
    }
  ]

  mainDisplayGrid.style.grid = `repeat(${GRID_DIMENSIONS}, 1fr) / repeat(${GRID_DIMENSIONS}, 1fr)`;

  for (let i = 0; i < GRID_DIMENSIONS; i++) {
    for (let j = 0; j < GRID_DIMENSIONS; j++) {
      const cell = document.createElement('div');
      const link = document.createElement('a');
      link.href = '';
      link.dataset.linkRef = dataCounter++;
      cell.classList.add('gif-cell');
      link.appendChild(cell);
      mainDisplayGrid.appendChild(link);
    }
  }

  // API call logic
  async function callGiphyAPI(input) {
    const requestLimit = GRID_TOTAL;

    const url = (input ? `https://api.giphy.com/v1/gifs/search?api_key=t3dEnktbGqQWPfWBSFigewYF8eA6MGLz&q=pokemon+${input}&limit=${requestLimit}&offset=&rating=pg&lang=en&bundle=messaging_non_clips` : `https://api.giphy.com/v1/gifs/trending?api_key=t3dEnktbGqQWPfWBSFigewYF8eA6MGLz&limit=${requestLimit}&offset=&rating=pg&bundle=messaging_non_clips`);
    try {
      const response = await axios.get(url);
      const gifArr = response.data.data;
      const gridCells = mainDisplayGrid.querySelectorAll('a');
      gridCells.forEach((cell) => {
        const outputLink = gifArr[cell.dataset.linkRef - 1].images.original.url;
        cell.href = outputLink;
        const refDiv = cell.firstChild;
        refDiv.style.backgroundImage = `url(${outputLink})`;
      })
      return response;
    } catch (error) {
      return;
    }
  }

  async function callPokeAPI(input) {
    const url = `https://pokeapi.co/api/v2/pokemon/${input}`;
    let isMediaUpdateRandom = false;
    let dataObj;
    try {
      const response = await axios.get(url);
      dataObj = response;
      return response;
    } catch (error) {
      siteDefaultMessage.textContent = `[${error.response.status} - ${error.response.data}]`;
      siteContextMessage.style.display = 'block';
      siteContextMessage.textContent = `< Please try a different search query - displaying random results>`;
      isMediaUpdateRandom = true;
    } finally {
      if (isMediaUpdateRandom) {
        siteDefaultMessage.style.display = 'block';
        siteContextMessage.style.display = 'block';
        activePokeInformation.style.display = 'none';
        callGiphyAPI('');
      } else {
        siteDefaultMessage.style.display = 'none';
        siteContextMessage.style.display = 'none';
        activePokeInformation.style.display = 'block';
        pokeSpriteFrontDefault.src = dataObj.data.sprites['front_default'];
        pokeSpriteBackDefault.src = dataObj.data.sprites['back_default'];
        pokeSpriteFrontShiny.src = dataObj.data.sprites['front_shiny'];
        pokeSpriteBackShiny.src = dataObj.data.sprites['back_shiny'];
        pokeName.textContent = dataObj.data.name.charAt(0).toUpperCase() + dataObj.data.name.slice(1);
        const typeKey = dataObj.data.types[0].type.name;
        let refObj = POKEMON_TYPING_COLOR_HEXCODES.find(typeObj => typeObj.type === typeKey.toUpperCase());
        pokeName.style.color = refObj.color;
        callGiphyAPI(input);
      }
    }
    return true;
  }



  // Search event listener (button click / enter keystroke)
  searchController.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = searchbar.value;
    if (searchQuery) {
      callPokeAPI(searchQuery);
    }
  });

  searchbar.addEventListener('keydown', (e) => searchbar.style.border = '1px solid #222224');
  searchbar.addEventListener('keyup', (e) => searchbar.style.border = '1px solid #EE1515');
})();