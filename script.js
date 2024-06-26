let currentPageUrl = 'https://swapi.dev/api/people/';

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');

    nextButton.addEventListener('click', loadNextPage);
    backButton.addEventListener('click', loadPreviousPage);

    // Adiciona o evento para fechar a modal ao clicar fora dela
    window.addEventListener('click', (event) => {
        const modal = document.getElementById("modal");
        if (event.target === modal) {
            modal.style.visibility = "hidden";
        }
    });
};

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Limpa os resultados anteriores.

    try {
        const response = await fetch(url); // Faz a requisição para a URL.
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement("div"); // Cria uma tag HTML.
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
            card.className = "cards";

            const characterNameBG = document.createElement("div");
            characterNameBG.className = "character-name-bg";

            const characterName = document.createElement("span");
            characterName.className = "character-name";
            characterName.innerText = `${character.name}`;

            characterNameBG.appendChild(characterName); // Insere um elemento dentro de outro.
            card.appendChild(characterNameBG);

            card.onclick = () => {
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";

                const modalContent = document.getElementById("modal-content");
                modalContent.innerHTML = '';

                const characterImage = document.createElement("div");
                characterImage.style.backgroundImage = 
                `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
                characterImage.className = "character-image";

                const name = document.createElement("span");
                name.className = "character-details";
                name.innerText = `Nome: ${character.name}`;

                const characterHeight = document.createElement("span");
                characterHeight.className = "character-details";
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`;

                const mass = document.createElement("span");
                mass.className = "character-details";
                mass.innerText = `Peso: ${convertMass(character.mass)}`;

                const eyeColor = document.createElement("span");
                eyeColor.className = "character-details";
                eyeColor.innerText = `Cor dos Olhos: ${convertEyeColor(character.eye_color)}`;

                const birthYear = document.createElement("span");
                birthYear.className = "character-details";
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(characterHeight);
                modalContent.appendChild(mass);
                modalContent.appendChild(eyeColor);
                modalContent.appendChild(birthYear);
            };

            mainContent.appendChild(card);
        });

        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');

        nextButton.disabled = !responseJson.next; // Desabilita o botão se não houver próxima página.
        backButton.disabled = !responseJson.previous; // Desabilita o botão se não houver página anterior.

        backButton.style.visibility = responseJson.previous ? "visible" : "hidden";

        currentPageUrl = url;

    } catch (error) {
        alert('Erro ao carregar os personagens');
        console.error(error);
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return; // Previne um erro.

    try {
        const response = await fetch(currentPageUrl); // Faz a requisição para a URL atual.
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        const responseJson = await response.json();

        if (responseJson.next) {
            await loadCharacters(responseJson.next); // Carrega a próxima página.
        }

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar a próxima página');
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return; // Previne um erro.

    try {
        const response = await fetch(currentPageUrl); // Faz a requisição para a URL atual.
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        const responseJson = await response.json();

        if (responseJson.previous) {
            await loadCharacters(responseJson.previous); // Carrega a página anterior.
        }

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar a página anterior');
    }
}

function convertEyeColor(eyeColor) {
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avela",
        unknown: "desconhecida"
    };

    return cores[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeight(height) {
    if (height === "unknown") {
        return "desconhecida";
    }

    return `${(height / 100).toFixed(2)} m`;
}

function convertMass(mass) {
    if (mass === "unknown") {
        return "desconhecida";
    }

    return `${mass} kg`;
}

function convertBirthYear(birthYear) {
    if (birthYear === "unknown") {
        return "desconhecido";
    }

    return birthYear;
}