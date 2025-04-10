// app.js

// Splash Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
    }, 2000);
});

// Tabs Navigation
const tabs = document.querySelectorAll('#tabs button, footer button');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        contents.forEach(c => c.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// Modo oscuro automático
const hour = new Date().getHours();
if (hour >= 19 || hour <= 7) {
    document.body.setAttribute('data-theme', 'dark');
}

// Fetch personajes (fake API con opción para Harry Potter)
const API_URL = 'https://hp-api.onrender.com/api/characters';

async function fetchCharacters() {
    try {
        const res = await fetch(API_URL);
        const characters = await res.json();
        displayCharacters(characters);
    } catch (err) {
        console.error('Error al cargar personajes:', err);
    }
}

function displayCharacters(data) {
    const list = document.getElementById('character-list');
    list.innerHTML = '';

    data.forEach(char => {
        const card = document.createElement('div');
        card.innerHTML = `
            <h4>${char.name}</h4>
            <p>${char.house || 'Sin casa'}</p>
            <button onclick='addFavorite("${char.name}")'>💖 Fav</button>
        `;
        list.appendChild(card);
    });
}

fetchCharacters();

// Buscador
const search = document.getElementById('search');
search.addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase();
    const res = await fetch(API_URL);
    const data = await res.json();
    const filtered = data.filter(char => char.name.toLowerCase().includes(query));
    displayCharacters(filtered);
});

// Filtro por casa
const filterHouse = document.getElementById('filter-house');
filterHouse.addEventListener('change', async (e) => {
    const house = e.target.value;
    const res = await fetch(API_URL);
    const data = await res.json();
    const filtered = house ? data.filter(char => char.house === house) : data;
    displayCharacters(filtered);
});

// CRUD de favoritos en localStorage
function addFavorite(name) {
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favs.includes(name)) {
        favs.push(name);
        localStorage.setItem('favorites', JSON.stringify(favs));
        loadFavorites();
    }
}

function removeFavorite(name) {
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    favs = favs.filter(fav => fav !== name);
    localStorage.setItem('favorites', JSON.stringify(favs));
    loadFavorites();
}

function loadFavorites() {
    const favList = document.getElementById('favorites-list');
    favList.innerHTML = '';
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];

    favs.forEach(name => {
        const card = document.createElement('div');
        card.innerHTML = `
            <h4>${name}</h4>
            <button onclick='removeFavorite("${name}")'>❌ Quitar</button>
        `;
        favList.appendChild(card);
    });
}

// Cargar favoritos al inicio
loadFavorites();

// Formulario de Registro
const form = document.getElementById('registration-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    console.log('Registrado:', values);
    alert('¡Registro exitoso!');
    form.reset();
});
