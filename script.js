import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyA-A2KdSyt7RPA4bTuj_HLH82ojFxj_RmM",
  authDomain: "harry-potter-df717.firebaseapp.com",
  projectId: "harry-potter-df717",
  storageBucket: "harry-potter-df717.appspot.com",
  messagingSenderId: "305991600613",
  appId: "1:305991600613:web:badd9c4c9badc920b2870c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let personajesGlobal = [];
let favoritos = [];

function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(seccion => {
    seccion.classList.add('oculto');
  });
  document.getElementById(id).classList.remove('oculto');
}

async function agregarDocumento(event) {
  event.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const usuario = document.getElementById('usuario').value;
  const contraseña = document.getElementById('contraseña').value;
  const casa = document.getElementById('casa').value;
  const varita = document.getElementById('varita').value;
  const nacimiento = document.getElementById('nacimiento').value;

  try {
    await addDoc(collection(db, 'magos'), {
      nombre, email, usuario, contraseña, casa, varita, nacimiento
    });
    alert('¡Mago registrado exitosamente!');
    document.getElementById('registro-form').reset();
  } catch (error) {
    console.error('Error al agregar mago:', error);
  }
}

async function obtenerPersonajes() {
  try {
    const respuesta = await fetch('https://hp-api.onrender.com/api/characters');
    const personajes = await respuesta.json();
    personajesGlobal = personajes;
    mostrarPersonajes(personajes);
  } catch (error) {
    console.error('Error al obtener personajes:', error);
  }
}

function mostrarPersonajes(personajes) {
  const contenedor = document.getElementById('personajes-lista');
  contenedor.innerHTML = '';

  personajes.forEach(personaje => {
    const card = document.createElement('div');
    card.classList.add('personaje-card');
    card.dataset.casa = personaje.house || '';

    card.innerHTML = `
      <img src="${personaje.image || 'https://via.placeholder.com/150'}" alt="${personaje.name}" class="card-img">
      <h3>${personaje.name}</h3>
      <p><strong>Casa:</strong> ${personaje.house || 'Desconocido'}</p>
      <p><strong>Actor:</strong> ${personaje.actor || 'Desconocido'}</p>
      <button onclick='agregarAFavoritos(${JSON.stringify(personaje).replace(/'/g, "\\'")})'>⭐ Agregar a Favoritos</button>
    `;

    contenedor.appendChild(card);
  });
}

function agregarAFavoritos(personaje) {
  if (!favoritos.some(fav => fav.name === personaje.name)) {
    favoritos.push(personaje);
    guardarFavoritos();
    mostrarFavoritos();
  }
}

function eliminarDeFavoritos(personaje) {
  favoritos = favoritos.filter(fav => fav.name !== personaje.name);
  guardarFavoritos();
  mostrarFavoritos();
}

function mostrarFavoritos() {
  const contenedor = document.getElementById("favoritos-lista");
  contenedor.innerHTML = "";

  if (favoritos.length === 0) {
    contenedor.innerHTML = "<p>No tienes personajes favoritos aún.</p>";
    return;
  }

  favoritos.forEach(p => {
    const div = document.createElement("div");
    div.className = "personaje-card";
    div.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/150'}" alt="${p.name}" width="200">
      <h3>${p.name}</h3>
      <p><strong>Casa:</strong> ${p.house || "Sin casa"}</p>
      <button onclick='eliminarDeFavoritos(${JSON.stringify(p).replace(/'/g, "\\'")})'>❌ Eliminar de Favoritos</button>
    `;
    contenedor.appendChild(div);
  });
}

function guardarFavoritos() {
  localStorage.setItem("favoritosHP", JSON.stringify(favoritos));
}

function cargarFavoritos() {
  const data = localStorage.getItem("favoritosHP");
  if (data) {
    favoritos = JSON.parse(data);
    mostrarFavoritos();
  }
}

function buscarPersonaje() {
  const input = document.getElementById('buscador').value.toLowerCase();
  const personajes = document.querySelectorAll('.personaje-card');
  personajes.forEach(card => {
    const nombre = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = nombre.includes(input) ? 'block' : 'none';
  });
}

function filtrarPorCasa() {
  const casa = document.getElementById('filtro-casa').value;
  const personajes = document.querySelectorAll('.personaje-card');
  personajes.forEach(card => {
    if (!casa || card.dataset.casa === casa) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Eventos
document.getElementById('registro-form').addEventListener('submit', agregarDocumento);

document.addEventListener('DOMContentLoaded', () => {
  obtenerPersonajes();
  cargarFavoritos();
});

window.mostrarSeccion = mostrarSeccion;
window.buscarPersonaje = buscarPersonaje;
window.filtrarPorCasa = filtrarPorCasa;
window.agregarAFavoritos = agregarAFavoritos;
window.eliminarDeFavoritos = eliminarDeFavoritos;
