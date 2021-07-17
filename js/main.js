/**
 * 1. Obtener el formulario
 * 2. Obtener la barra de menu
 * 3. Obtener el Widget del usuario
 * 
 * Mi API https://api.github.com/users/isaacgordoflores
 */

// 1
const form = document.getElementById("form")
// 2
const search = document.getElementById("search")
// 3
const userCard = document.getElementById("usercard")

// Escuchar evento submit del formulario
form.addEventListener("submit", (evt) => {
    evt.preventDefault() // Cancela el evento si este es cancelable, sin detener el resto del funcionamiento del evento, es decir, puede ser llamado de nuevo.
    const username = search.value

    getUserData(username)
    search.value = ""
})

// Obtengo la informacion del usuario de GitHub
async function getUserData (username) { // console.log(username)
    
    const API = "https://api.github.com/users/"

    //
    try {
        const userRequest = await fetch(API + username)

        // Si no existe el usuario buscado, muestra ERROR
        if (!userRequest.ok) {
            throw new Error(userRequest.status)
        }
        
        const userData = await userRequest.json()
        // console.log(userRequest)

        // Si el usuario consultado tiene repos publicos
        // Añado la propiedad nueva "repos" a userData con los repositorios encontrados
        if (userData.public_repos) {
            const reposRequest = await fetch(API + username + "/repos")
            const reposData = await reposRequest.json() // console.log(reposData)

            userData.repos = reposData
        }

        showUserData(userData)

    } catch(error) {
       showError(error.message);
    }
}

// Rellenar el Widget en html

function showUserData(userData) {
    
    let userContent = `
        <img
        src=${userData.avatar_url}
        alt="Avatar de usuario"
        />
        <h1>${userData.name}</h1>
        <p>
        ${userData.bio}
        </p>

        <section class="data">
        <ul>
            <li>Followers: ${userData.followers} </li>
            <li>Following: ${userData.following} </li>
            <li>Repos: ${userData.public_repos} </li>
        </ul>
        </section>
    `;

    // Si tengo repositorios ...
    if (userData.repos) {
        userContent += `<section class="repos">`

        userData.repos.slice(0, 7).forEach(repo => {
            userContent += `<a href="${repo.html_url}" target="_blank">${repo.name} </a>`
        })
        userContent += `</section>`;
    }

    userCard.innerHTML = userContent;
}


// Gestion de Errores

function showError(error) {
    const errorContent = `<h2>⚠️ ERROR ${error} ⚠️</h2>`
    userCard.innerHTML = errorContent
}