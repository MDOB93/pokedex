function init(){
    fetchData()
    initDialogNavigation()
};

let nextPokemonUrl = null;
let allPokemon = [];
let loaderTimer = null;
let currentRenderedPokemon = [];
let currentPokemonIndex = 0;

const dialogRef = document.getElementById('myDialog');

async function fetchData(){
    showLoadingScreen();
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=25&offset=0');
        const responseAsJson = await response.json();
        nextPokemonUrl = responseAsJson.next;
        const pokemonURL = [];
        // aweit only in async funtions (const pokemon = responseAsJson.results) | if you want to read the files in sequence, you cannot use forEach indeed. Just use a modern for … of loop instead, in which await will work as expected.
        // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        for (const pokemon of responseAsJson.results) {
            const urlRef = await fetch(pokemon.url);
            const urlData = await urlRef.json();
            pokemonURL.push(urlData);
        }
        renderPokemon(pokemonURL)
    } finally {
        hideLoadingScreen();
    }
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
    const statsArray = getPokemonStats(pokemon);
    const mainType = tagArray[0];
    const typeClasses = `type-${mainType}`;
    const hp = `${statsArray[0]}`;
    const attack = `${statsArray[1]}`;
    const defense = `${statsArray[2]}`;
    const specialAttack = `${statsArray[3]}`;
    const specialDefense = `${statsArray[4]}`;
    const speed = `${statsArray[5]}`;

    document.getElementById('myDialog').classList = typeClasses
    document.getElementById('dialogTitle').innerHTML = `#${pokemon.id} ${pokemonNameUpCase(pokemon)}`;
    document.getElementById('imgDialog').setAttribute('src', `${pokemon.sprites.other.dream_world.front_default}`);
    document.getElementById('pokeDescript').innerHTML = dialogTbleTemplate(hp, attack, defense, specialAttack, specialDefense, speed, tagArray);
};


function renderPokemon(pokemonURL){
    const contentRef = document.getElementById('content');

    currentRenderedPokemon.push(...pokemonURL);// ... Spread-Operator | It „spreads“ an array – turns many values into individual elements.

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
    // cahrAt(0) get the first letter of PokemonName than make it toUpperCase()
    // PokemonName.slice(1) get the rest of the word
    const nameUpCase = PokemonName.charAt(0).toUpperCase() + PokemonName.slice(1);
    return nameUpCase;
};

function getPokemonTags(pokemon) {
    let pokemonTypes = pokemon.types;
    let pokemonTags = [];
    // iterate through pokemonTypes to get type.name of pokemon
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
    // iterate through pokemonTagsArray and save it in html as <span>
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
        nextPokemonUrl = responseAsJson.next;
        const pokemonURL = [];
        for (const pokemon of responseAsJson.results) {
            const urlRef = await fetch(pokemon.url);
            const urlData = await urlRef.json();
            pokemonURL.push(urlData);
        }
        renderPokemon(pokemonURL)
    } finally {
        hideLoadingScreen();
    }
};

async function searchPokemon() {
    showLoadingScreen();
    try {
        const inputRef = document.getElementById('searchInput');
        const searchValue = inputRef.value.toLowerCase().trim();
        const contentRef = document.getElementById('content');

        if (searchValue === '' || searchValue.length < 3) {
            document.getElementById('nextPokemonBtn').disabled = false;
            showHideBtn();
            return;
        }

        let filteredPokemon = allPokemon.filter((pokemon) =>
            pokemon.name.includes(searchValue)
        );

        if (filteredPokemon.length >= 3) {
            contentRef.innerHTML = '';

            currentRenderedPokemon = filteredPokemon;
            currentPokemonIndex = 0;

            for (const pokemon of filteredPokemon) {
                const tagArray = getPokemonTags(pokemon);
                const mainType = tagArray[0];
                const typeClasses = `type-${mainType}`;

                contentRef.innerHTML += pokemonCardTemplate(pokemon, typeClasses, tagArray);
            }

            document.getElementById('nextPokemonBtn').disabled = true;
            showHideBtn();
            return;
        }

        try {
            await fetchPokemon(searchValue);
            document.getElementById('nextPokemonBtn').disabled = true;
            showHideBtn();
        } catch (error) {
            contentRef.innerHTML = errorTemplate();
            document.getElementById('nextPokemonBtn').disabled = true;
            showHideBtn();
            return;
        }
        inputRef.value = '';
    } finally {
        hideLoadingScreen();
    }
};

async function fetchPokemon(pokemonName) {
    const contentRef = document.getElementById('content');
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const responseAsJson = await response.json();

    console.log(responseAsJson);

    const tagArray = getPokemonTags(responseAsJson)
    const mainType = tagArray[0];
    const typeClasses = `type-${mainType}`;

    contentRef.innerHTML = '';

    currentRenderedPokemon = [responseAsJson];
    currentPokemonIndex = 0;
                
    contentRef.innerHTML += pokemonFetchTemplate(responseAsJson, typeClasses, tagArray);

    showHideBtn ()
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