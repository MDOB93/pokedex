function pokemonCardTemplate(pokemon, typeClasses, tagArray) {
    return `
    <div id="card-${pokemon.id}" class="card ${typeClasses}" onclick="openDialog(${pokemon.id})"style="max-width: 18rem;">
        <div class="card-header">#${pokemon.id}</div>
        <div class="card-body">
            <h5 id="${pokemon.name}" class="card-title">${pokemonNameUpCase(pokemon)}</h5>
            <div class="pokemonImgWraper">
                <img id="pokemonImg-${pokemon.id}" src="${pokemon.sprites.other.dream_world.front_default}" alt="Pokemon Img Front">
                <div id="tags" class="tags">${getTagHtml(tagArray)}</div>
            </div>
        </div>
    </div>`
};

function pokemonFetchTemplate(responseAsJson, typeClasses, tagArray) {
    return `
    <div class="card ${typeClasses}" onclick="openDialog(${responseAsJson.id})"style="max-width: 18rem;">
        <div id="${responseAsJson.id}" class="card-header">#${responseAsJson.id}</div>
        <div class="card-body">
            <h5 id="${responseAsJson.name}" class="card-title">${pokemonNameUpCase(responseAsJson)}</h5>
            <div class="pokemonImgWraper">
                <img id="pokemonImg-${responseAsJson.id}" src="${responseAsJson.sprites.other.dream_world.front_default}" alt="Pokemon Img Front">
                <div id="tags" class="tags">${getTagHtml(tagArray)}</div>
            </div>
        </div>
    </div>`
};

function errorTemplate() {
    return `
    <div>
        <h2>No Pokémon found<br>
        Error 404 ¯\\_(ツ)_/¯</h2>
    </div>`
};

function dialogTbleTemplate(hp, attack, defense, specialAttack, specialDefense, speed, tagArray) {
    return `
    <table>
        <tr>
            <th>Hp:</th>
            <td>${hp}</td>
        </tr>
        <tr>
            <th>Attack:</th>
            <td>${attack}</td>
        </tr>
        <tr>
            <th>Defense:</th>
            <td>${defense}</td>
        </tr>
        <tr>
            <th>Special-Attack:</th>
            <td>${specialAttack}</td>
        </tr>
        <tr>
            <th>Special-Defense:</th>
            <td>${specialDefense}</td>
        </tr>
        <tr>
            <th>Speed:</th>
            <td>${speed}</td>
        </tr>
    </table>
    <div id="dialogTags" class="tags">${getTagHtml(tagArray)}</div>`
}