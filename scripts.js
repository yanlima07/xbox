const modalBackground = document.getElementById("modalBackground");
const searchModalBackground = document.getElementById("searchModalBackground");
const modalLogin = document.getElementById("modalLogin");
const searchModal = document.getElementById("searchModal");
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");
const uploadBox = document.getElementById("uploadBox");
const toRegisterButton = document.getElementById("toRegisterButton");
const toLoginButton = document.getElementById("toLoginButton");
const buttonAddPokemon = document.getElementById("buttonAddPokemon");
const emailProblem = document.getElementById("emailProblem");
const registerEmailProblem = document.getElementById("registerEmailProblem");
const entrarLogin = document.getElementById("entrarLogin");
const sairLogout = document.getElementById("sairLogout");

const serverLink = "https://xbox-backend-render.onrender.com";
const serverLocal = "http://localhost:5500";

var emailFlag = false;

if (localStorage.getItem("token") == null) {
  document.getElementById("entrarLogin").classList.remove("hidden");
  document.getElementById("search").classList.remove("visible");
  document.getElementById("sairLogout").classList.add("hidden");
} else {
  document.getElementById("sairLogout").classList.remove("hidden");
  document.getElementById("search").classList.add("visible");
  document.getElementById("entrarLogin").classList.add("hidden");
  loadPokemons();
}

function resetInputs() {
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("resgisterPassword").value = "";
  document.getElementById("textUpload").value = "";
}

entrarLogin.onclick = (e) => {
  modalLogin.classList.toggle("visible");
  loginBox.classList.toggle("visibleBlock");
};

toRegisterButton.onclick = (e) => {
  loginBox.classList.toggle("visibleBlock");
  registerBox.classList.toggle("visibleBlock");
};

toLoginButton.onclick = (e) => {
  loginBox.classList.toggle("visibleBlock");
  registerBox.classList.toggle("visibleBlock");
};

modalBackground.onclick = (e) => {
  modalLogin.classList.toggle("visible");
  loginBox.classList.toggle("visibleBlock");
  emailFlag = false;
  flagHandler();
  resetInputs();
};

buttonAddPokemon.onclick = (e) => {
  searchModal.classList.toggle("visible");
};

searchModalBackground.onclick = (e) => {
  searchModal.classList.toggle("visible");
  uploadBox.classList.toggle("visibleBlock");
  resetInputs();
};

sairLogout.onclick = (e) => {
  localStorage.removeItem("token");
  document.getElementById("entrarLogin").classList.remove("hidden");
  document.getElementById("sairLogout").classList.add("hidden");
  window.location.reload();
};

function flagHandler() {
  if (emailFlag) {
    emailProblem.classList.add("visible");
    registerEmailProblem.classList.add("visible");
  } else {
    emailProblem.classList.remove("visible");
    registerEmailProblem.classList.remove("visible");
  }
}

function Register(event) {
  event.preventDefault();

  const emailData = document.getElementById("registerEmail").value;
  const passwordData = document.getElementById("registerPassword").value;

  const data = { email: emailData, password: passwordData };

  fetch(serverLink + "/authenticate/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((dataReceived) => {
      if (!dataReceived.error) {
        localStorage.setItem("token", dataReceived.token);
        window.location.reload();
      } else {
        emailFlag = true;
        flagHandler();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  loadPokemons();
}

function Login(event) {
  event.preventDefault();

  const emailData = document.getElementById("loginEmail").value;
  const passwordData = document.getElementById("loginPassword").value;

  const data = { email: emailData, password: passwordData };

  fetch(serverLink + "/authenticate/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((dataReceived) => {
      if (!dataReceived.error) {
        localStorage.setItem("token", dataReceived.token);
        window.location.reload();
      } else {
        emailFlag = true;
        flagHandler();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  loadPokemons();
}

function Upload(event) {
  event.preventDefault();

  const nameData = document.getElementById("textUpload").value;
  const fileData = document.getElementById("fileUpload").files[0];

  const data = {
    name: nameData,
    url: fileData,
  };

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("url", data.url);

  fetch(serverLink + "/pokemons", {
    method: "POST",
    headers: {
      token: window.localStorage.getItem("token"),
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.error) {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

var pokemonArray = [];
const pokemonCardTemplate = document.querySelector("[pokemon-card-template]");
const pokemonCardContainer = document.querySelector("[pokemon-card-container]");

function loadPokemons() {
  fetch(serverLink + "/pokemons", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: window.localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      pokemonArray = data;
      pokemonMap = pokemonArray.map((pokemon) => {
        const card = pokemonCardTemplate.content.cloneNode(true).children[0];
        const pokeName = card.querySelector("[poke-name]");

        pokeName.textContent = pokemon.name;

        const pokeImage = card.querySelector("[poke-image]");
        pokeImage.src = pokemon.url;

        pokemonCardContainer.append(card);

        return { name: pokemon.name, element: card };
      });
    })

    .catch((error) => {
      console.error("Error:", error);
    });
}

var searchInput = document.querySelector("[poke-search]");
var searchName;

searchInput.addEventListener("input", (e) => {
  const value = e.target.value;
  searchName = e.target.value;
  pokemonMap.forEach((pokemon) => {
    const isVisible = pokemon.name.toLowerCase().includes(value);
    pokemon.element.classList.toggle("hide", !isVisible);
  });
});

function searchPokemon(event) {
  event.preventDefault();

  pokemonCardContainer.innerHTML = "";

  fetch(serverLink + "/searchPokemons/?name=" + searchName, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: window.localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      pokemonArray = data;
      pokemonMap = pokemonArray.map((pokemon) => {
        const card = pokemonCardTemplate.content.cloneNode(true).children[0];
        const pokeName = card.querySelector("[poke-name]");

        pokeName.textContent = pokemon.name;

        const pokeImage = card.querySelector("[poke-image]");
        pokeImage.src = pokemon.url;

        pokemonCardContainer.append(card);

        return { name: pokemon.name, element: card };
      });
    })

    .catch((error) => {
      console.error("Error:", error);
    });
}
