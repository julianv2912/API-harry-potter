// script.js

// Splash Screen
window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
    }, 2000);
  });
  
  // Variables globales
  let personajesGlobal = [];
  
  // Cargar personajes
  fetch('https://hp-api.onrender.com/api/characters')
    .then(response => response.json())
    .then(data => {
      personajesGlobal = data;
      cargarPersonajes(data);
    })
    .catch(error => console.error('Error al cargar personajes:', error));
  
  // Mostrar/ocultar secciones
  function mostrarSeccion(id) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(sec => sec.classList.add('oculto'));
  
    const activa = document.getElementById(id);
    if (activa) {
      activa.classList.remove('oculto');
    }
  }
  
  // Cargar tarjetas de personajes
  function cargarPersonajes(personajes) {
    const contenedor = document.getElementById('personajes-lista');
    contenedor.innerHTML = '';
  
    personajes.forEach(personaje => {
      const card = document.createElement('div');
      card.classList.add('personaje-card');
      card.innerHTML = `
        <img src="${personaje.image || 'https://via.placeholder.com/150'}" alt="${personaje.name}">
        <h3>${personaje.name}</h3>
        <p>${personaje.house || 'Sin casa'}</p>
        <button onclick="agregarFavorito('${personaje.name}')">⭐ Favorito</button>
      `;
      contenedor.appendChild(card);
    });
  }
  
  // Filtrar por casa
  function filtrarPorCasa() {
    const casaSeleccionada = document.getElementById('filtro-casa').value;
  
    if (casaSeleccionada === '') {
      cargarPersonajes(personajesGlobal);
    } else {
      const filtrados = personajesGlobal.filter(p => p.house === casaSeleccionada);
      cargarPersonajes(filtrados);
    }
  }
  
  // Buscar por nombre
  function buscarPersonaje() {
    const texto = document.getElementById('buscador').value.toLowerCase();
    const filtrados = personajesGlobal.filter(p => p.name.toLowerCase().includes(texto));
    cargarPersonajes(filtrados);
  }
  
  // CRUD de Favoritos (localStorage)
  function agregarFavorito(nombre) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (!favoritos.includes(nombre)) {
      favoritos.push(nombre);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      alert('Agregado a favoritos!');
      mostrarFavoritos();
    }
  }
  
  function mostrarFavoritos() {
    const lista = document.getElementById('favoritos-lista');
    lista.innerHTML = '';
  
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos.forEach(nombre => {
      const item = document.createElement('div');
      item.textContent = nombre;
      lista.appendChild(item);
    });
  }
  
  // Registro (espacio para Firebase)
  const registroForm = document.getElementById('registro-form');
  registroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registroForm);
    const datos = Object.fromEntries(formData.entries());
  
    console.log('Registrar en Firebase:', datos);
    // 🔥 Aquí conectarías a tu base de datos Firebase!
    registroForm.reset();
    alert('Registro exitoso!');
  });
  