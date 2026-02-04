function init(){
    fetchData()
};

async function fetchData(){
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=25&offset=0');
    const responseAsJson = await response.json();

    console.log(responseAsJson);

    const pokemonURL = [];

    // aweit only in async funtions (const pokemon = responseAsJson.results) | if you want to read the files in sequence, you cannot use forEach indeed. Just use a modern for … of loop instead, in which await will work as expected.
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    for (const pokemon of responseAsJson.results) {
        const urlRef = await fetch(pokemon.url);
        const urlData = await urlRef.json();
        pokemonURL.push(urlData);
    }

    console.log(pokemonURL);

    renderPokemon(pokemonURL)
};

function renderPokemon(pokemonURL){
    const contentRef = document.getElementById('content');

    pokemonURL.forEach((allPokemons) => {
        console.log(`ID: ${allPokemons.id} | Name: ${allPokemons.name} | Img URL: ${allPokemons.sprites.other.dream_world.front_default}`);
        
        console.log(pokemonNameUpCase(allPokemons));
        
        let tagArray = getPokemonTags(allPokemons)
        console.log(tagArray);
        
        contentRef.innerHTML += `
            <div class="card text-bg-dark mb-3" style="max-width: 18rem;">
                <div id="pokemonId" class="card-header">#${allPokemons.id}</div>
                <div class="card-body">
                    <h5 id="pokemonName" class="card-title">${pokemonNameUpCase(allPokemons)}</h5>
                    <div class="pokemonImgWraper">
                        <img id="pokemonImg" src="${allPokemons.sprites.other.dream_world.front_default}" alt="Pokemon Img Front">
                        <div>${getTagHtml(tagArray)}</div>
                    </div>
                </div>
            </div>`
        ;
    })
};

function pokemonNameUpCase(allPokemons) {
    const PokemonName = allPokemons.name
    // cahrAt(0) get the first letter of PokemonName than make it toUpperCase()
    // PokemonName.slice(1) get the rest of the word
    const nameUpCase = PokemonName.charAt(0).toUpperCase() + PokemonName.slice(1);
    
    return nameUpCase;
};

function getPokemonTags(allPokemons) {
    let pokemonTypes = allPokemons.types
    let pokemonTags = [];

    // iterate through pokemonTypes to get type.name of pokemon
    pokemonTypes.forEach ((pokemonTagsArray) => {
        pokemonTags.push(pokemonTagsArray.type.name)
    })

    return pokemonTags;
};

function getTagHtml(pokemonTagsArray) {
    let typeHtml = "";
    // iterate through pokemonTagsArray and save it in html as <span>
    pokemonTagsArray.forEach((tag) => {
        typeHtml += `<span>${tag} </span>`;
    })

    return typeHtml;
};