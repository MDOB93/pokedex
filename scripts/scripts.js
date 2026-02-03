function init(){
    fetchData()
};

async function fetchData(){
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=25&offset=0');
    const responseAsJson = await response.json();

    console.log(responseAsJson);

    const allPokemon = [];

    // aweit only in async funtions (const pokemon = responseAsJson.results) | if you want to read the files in sequence, you cannot use forEach indeed. Just use a modern for … of loop instead, in which await will work as expected.
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    for (const pokemon of responseAsJson.results) {
        const urlRef = await fetch(pokemon.url);
        const urlData = await urlRef.json();
        allPokemon.push(urlData);
    }

    console.log(allPokemon);

    renderPokemon(allPokemon)
};

function renderPokemon(allPokemon){
    const contentRef = document.getElementById('content');

    allPokemon.forEach((arrayElement) => {
        console.log(`ID: ${arrayElement.id} | Name: ${arrayElement.name} | Img URL: ${arrayElement.sprites.front_shiny}`);
        
        contentRef.innerHTML += `
            <div class="card text-bg-dark mb-3" style="max-width: 18rem;">
                <div id="pokemonId" class="card-header">#${arrayElement.id}</div>
                <div class="card-body">
                    <h5 id="pokemonName" class="card-title">${arrayElement.name}</h5>
                    <div class="pokemonImgWraper">
                        <img id="pokemonImg" src="${arrayElement.sprites.front_shiny}" alt="Pokemon Img Front">
                        <p id="pokemonTag" class="card-text"></p>
                    </div>
                </div>
            </div>`;
    })
};