// script.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA-A2KdSyt7RPA4bTuj_HLH82ojFxj_RmM",
  authDomain: "harry-potter-df717.firebaseapp.com",
  projectId: "harry-potter-df717",
  storageBucket: "harry-potter-df717.appspot.com", // OJO: aquí había un error en tu storageBucket
  messagingSenderId: "305991600613",
  appId: "1:305991600613:web:badd9c4c9badc920b2870c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mostrar secciones
function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(seccion => {
    seccion.classList.add('oculto');
  });
  document.getElementById(id).classList.remove('oculto');
}

// Función para agregar un mago a Firebase
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
      nombre,
      email,
      usuario,
      contraseña,
      casa,
      varita,
      nacimiento
    });
    alert('¡Mago registrado exitosamente!');
    document.getElementById('registro-form').reset();
  } catch (error) {
    console.error('Error al agregar mago:', error);
  }
}

// Función para obtener personajes de la API
async function obtenerPersonajes() {
  try {
    const respuesta = await fetch('https://hp-api.onrender.com/api/characters');
    const personajes = await respuesta.json();
    mostrarPersonajes(personajes);
  } catch (error) {
    console.error('Error al obtener personajes:', error);
  }
}

// Función para mostrar los personajes en tarjetas
function mostrarPersonajes(personajes) {
  const contenedor = document.getElementById('personajes');
  contenedor.innerHTML = ''; // Limpiar

  personajes.forEach(personaje => {
    const card = document.createElement('div');
    card.classList.add('personaje-card');
    card.dataset.casa = personaje.house || '';

    card.innerHTML = `
      <img src="${personaje.image || 'https://via.placeholder.com/150'}" alt="${personaje.name}" class="card-img">
      <h3>${personaje.name}</h3>
      <p><strong>Casa:</strong> ${personaje.house || 'Desconocido'}</p>
      <p><strong>Actor:</strong> ${personaje.actor || 'Desconocido'}</p>
    `;

    contenedor.appendChild(card);
  });
}

// Buscar personajes por nombre
function buscarPersonaje() {
  const input = document.getElementById('buscador').value.toLowerCase();
  const personajes = document.querySelectorAll('.personaje-card');
  personajes.forEach(card => {
    const nombre = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = nombre.includes(input) ? 'block' : 'none';
  });
}

// Filtrar personajes por casa
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

// Vincular eventos
document.getElementById('registro-form').addEventListener('submit', agregarDocumento);

// Exponer funciones al window para poder usarlas en HTML
window.mostrarSeccion = mostrarSeccion;
window.buscarPersonaje = buscarPersonaje;
window.filtrarPorCasa = filtrarPorCasa;

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
  obtenerPersonajes();
});
