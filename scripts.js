const modalBackground = document.getElementById("modalBackground");
const modalLogin = document.getElementById("modalLogin");
const emailProblem = document.getElementById("emailProblem");
const entrarLogin = document.getElementById("entrarLogin");
const sairLogout = document.getElementById("sairLogout");

var emailFlag = false;

if (localStorage.getItem("token") == null) {
  document.getElementById("entrarLogin").classList.remove("hidden");
  document.getElementById("search").classList.remove("visible");
  document.getElementById("sairLogout").classList.add("hidden");
} else {
  document.getElementById("sairLogout").classList.remove("hidden");
  document.getElementById("search").classList.add("visible");
  document.getElementById("entrarLogin").classList.add("hidden");
}

function resetInputs() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

entrarLogin.onclick = (e) => {
  modalLogin.classList.toggle("visible");
};

modalBackground.onclick = (e) => {
  modalLogin.classList.toggle("visible");
  emailFlag = false;
  flagHandler();
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
  } else {
    emailProblem.classList.remove("visible");
  }
}

function Login(event) {
  event.preventDefault();

  const emailData = document.getElementById("email").value;

  const fetchAPI =
    "https://emailvalidation.abstractapi.com/v1/?api_key=2b2eaffef5bf468d928a7bc822c05cb3&email=" +
    emailData;

  fetch(fetchAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((responseAPI) => responseAPI.json())
    .then((dataAPI) => {
      if (dataAPI.is_valid_format.value == true) {
        const data = {
          //email: "eve.holt@reqres.in",
          //password: "123",
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        };

        fetch("https://reqres.in/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((dataReceived) => {
            if (dataReceived.token != null) {
              localStorage.setItem("token", dataReceived.token);
              emailFlag = false;
              flagHandler();
              resetInputs();
              window.location.reload();
            } else {
              emailFlag = true;
              flagHandler();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        emailFlag = true;
        flagHandler();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

var pokemonArray = [];
const pokemonCardTemplate = document.querySelector("[pokemon-card-template]");
const pokemonCardContainer = document.querySelector("[pokemon-card-container]");

fetch("https://pokeapi.co/api/v2/pokemon?limit=150&offset=0", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    pokemonArray = data.results;
    pokemonMap = pokemonArray.map((pokemon) => {
      const card = pokemonCardTemplate.content.cloneNode(true).children[0];
      const pokeName = card.querySelector("[poke-name]");

      pokeName.textContent = pokemon.name;

      var pokelink = pokemon.url;

      fetch(pokelink, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const pokeImage = card.querySelector("[poke-image]");
          pokeImage.src = data.sprites.front_default;
          pokemonCardContainer.append(card);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      return { name: pokemon.name, element: card };
    });
  })

  .catch((error) => {
    console.error("Error:", error);
  });

var searchInput = document.querySelector("[poke-search]");

searchInput.addEventListener("input", (e) => {
  const value = e.target.value;
  console.log(pokemonMap);
  pokemonMap.forEach((pokemon) => {
    const isVisible = pokemon.name.toLowerCase().includes(value);
    pokemon.element.classList.toggle("hide", !isVisible);
  });
});
