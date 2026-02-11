let nextPokemonUrl = null;
let allPokemon = [];
let loaderTimer = null;
let currentRenderedPokemon = [];
let currentPokemonIndex = 0;

const dialogRef = document.getElementById('myDialog');

function init(){
    fetchData()
    initDialogNavigation()
};

async function fetchData(){
    showLoadingScreen();
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=25&offset=0');
        const responseAsJson = await response.json();
        
        const pokemonURL = await responseResulteLoope(responseAsJson);
        renderPokemon(pokemonURL)
    } finally {
        hideLoadingScreen();
    }
};

async function responseResulteLoope(responseAsJson) {
    nextPokemonUrl = responseAsJson.next;
    const pokemonURL = [];
    for (const pokemon of responseAsJson.results) {
            const urlRef = await fetch(pokemon.url);
            const urlData = await urlRef.json();
            pokemonURL.push(urlData);
    }
    return pokemonURL;
};

function openDialog(pokemonId) {
    currentPokemonIndex = currentRenderedPokemon.findIndex(
        p => p.id === pokemonId
    );
    if (currentPokemonIndex === -1) return;
    dialogRef.showModal();
    renderDialog(currentRenderedPokemon[currentPokemonIndex]);
};

function closeDialog() {
    dialogRef.close();
};

function renderDialog(pokemon) {
    const tagArray = getPokemonTags(pokemon);
    const mainType = tagArray[0];
    const typeClasses = `type-${mainType}`;

    const stats = pokemonStatsTable(pokemon);

    document.getElementById('myDialog').classList = typeClasses
    document.getElementById('dialogTitle').innerHTML = `#${pokemon.id} ${pokemonNameUpCase(pokemon)}`;
    document.getElementById('imgDialog').setAttribute('src', `${pokemon.sprites.other.dream_world.front_default}`);
    document.getElementById('pokeDescript').innerHTML = dialogTbleTemplate(stats, tagArray);
};

function pokemonStatsTable(pokemon) {
    const statsArray = getPokemonStats(pokemon);
    const statNames = [
        "hp",
        "attack",
        "defense",
        "specialAttack",
        "specialDefense",
        "speed"
    ];
    const stats = {};
    statsArray.forEach((stat, index) => {
        stats[statNames[index]] = stat;
    });
    return stats;
};


function renderPokemon(pokemonURL){
    const contentRef = document.getElementById('content');
    currentRenderedPokemon.push(...pokemonURL);
    pokemonURL.forEach((pokemon) => {
        allPokemon.push(pokemon)       
        const tagArray = getPokemonTags(pokemon)
        const mainType = tagArray[0];
        const typeClasses = `type-${mainType}`;        
        contentRef.innerHTML += pokemonCardTemplate(pokemon, typeClasses, tagArray);
    })
    document.getElementById('nextPokemonBtn').disabled = false;
};

function pokemonNameUpCase(pokemon) {
    const PokemonName = pokemon.name
    const nameUpCase = PokemonName.charAt(0).toUpperCase() + PokemonName.slice(1);
    return nameUpCase;
};

function getPokemonTags(pokemon) {
    let pokemonTypes = pokemon.types;
    let pokemonTags = [];
    pokemonTypes.forEach ((pokemonTagsArray) => {
        pokemonTags.push(pokemonTagsArray.type.name)
    })
    return pokemonTags;
};

function getPokemonStats(pokemon) {
    let pokemonStats = pokemon.stats;
    let pokemonStat = [];
    pokemonStats.forEach ((pokemonStatsArray) => {
        pokemonStat.push(pokemonStatsArray.base_stat)
    })
    return pokemonStat;
};

function getTagHtml(pokemonTagsArray) {
    let typeHtml = "";
    pokemonTagsArray.forEach((tag) => {
        typeHtml += `<span class="tagFrame type-${tag}">${tag}</span>`;
    })
    return typeHtml;
};

async function loadNextPokemon() {  
    if (!nextPokemonUrl) return;
    showLoadingScreen();
    try {
        const response = await fetch(nextPokemonUrl);
        const responseAsJson = await response.json();       
        const pokemonURL = await responseResulteLoope(responseAsJson);
        renderPokemon(pokemonURL)
    } finally {
        hideLoadingScreen();
    }
};

async function searchPokemon() {
    showLoadingScreen();
    try {
        const searchValue = getSearchValue();    
        if (!isSearchValid(searchValue)) {
            activateNextButton();
            return;
        }
        const filteredPokemon = filterPokemonByName(searchValue);
        if (filteredPokemon.length >= 3) {
            renderSearchResults(filteredPokemon);
            deactivateNextButton();
            return;
        }
        await tryFetchSinglePokemon(searchValue);
        clearSearchInput();
    } finally {
        hideLoadingScreen();
    }
};

function getSearchValue() {
    const inputRef = document.getElementById('searchInput');
    return inputRef.value.toLowerCase().trim();
};

function isSearchValid(searchValue) {
    return searchValue !== '' && searchValue.length >= 3;
};

function filterPokemonByName(searchValue) {
    return allPokemon.filter(pokemon =>
        pokemon.name.includes(searchValue)
    );
};

function renderSearchResults(filteredPokemon) {
    const contentRef = document.getElementById('content');
    contentRef.innerHTML = '';
    currentRenderedPokemon = filteredPokemon;
    currentPokemonIndex = 0;
    filteredPokemon.forEach(pokemon => {
        const tagArray = getPokemonTags(pokemon);
        const mainType = tagArray[0];
        const typeClasses = `type-${mainType}`;
        contentRef.innerHTML += pokemonCardTemplate(pokemon, typeClasses, tagArray);
    });
};

async function tryFetchSinglePokemon(searchValue) {
    const contentRef = document.getElementById('content');
    try {
        await fetchPokemon(searchValue);
        deactivateNextButton();
    } catch (error) {
        contentRef.innerHTML = errorTemplate();
        deactivateNextButton();
    }
};

async function fetchPokemon(pokemonName) {
    const contentRef = document.getElementById('content');
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const responseAsJson = await response.json();
    const tagArray = getPokemonTags(responseAsJson)
    const mainType = tagArray[0];
    const typeClasses = `type-${mainType}`;
    contentRef.innerHTML = '';
    currentRenderedPokemon = [responseAsJson];
    currentPokemonIndex = 0;             
    contentRef.innerHTML += pokemonFetchTemplate(responseAsJson, typeClasses, tagArray);
    showHideBtn ()
};

function deactivateNextButton() {
    document.getElementById('nextPokemonBtn').disabled = true;
    showHideBtn();
};

function activateNextButton() {
    document.getElementById('nextPokemonBtn').disabled = false;
    showHideBtn();
};

function clearSearchInput() {
    document.getElementById('searchInput').value = '';
};

function showHideBtn() {
    let nextBtn = document.getElementById('nextPokemonBtn').disabled
    if (nextBtn == true) {
        let backBtn = document.getElementById('backBtn')
        backBtn.classList.remove("d-none");
    }else {
        let backBtn = document.getElementById('backBtn')
        backBtn.classList.add("d-none");
    }
};

function backHome() {
    location.reload();
};

function showLoadingScreen() {
    document.getElementById('loader').classList.remove('d-none');
};

function hideLoadingScreen() {
    document.getElementById('loader').classList.add('d-none');
};

function initDialogNavigation() {
    document.getElementById('backBtnImg').onclick = showPrevPokemon;
    document.getElementById('forBtnIMG').onclick = showNextPokemon;
};

function showNextPokemon() {
    currentPokemonIndex++;
    if (currentPokemonIndex >= currentRenderedPokemon.length) {
        currentPokemonIndex = 0;
    }
    renderDialog(currentRenderedPokemon[currentPokemonIndex]);
};

function showPrevPokemon() {
    currentPokemonIndex--;
    if (currentPokemonIndex < 0) {
        currentPokemonIndex = currentRenderedPokemon.length - 1;
    }
    renderDialog(currentRenderedPokemon[currentPokemonIndex]);
};