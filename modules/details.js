// Constantes
const API_URLS = {
    departments: "https://api-colombia.com/api/v1/Department",
    cities: "https://api-colombia.com/api/v1/City",
    naturalAreas: "https://api-colombia.com/api/v1/NaturalArea"
};

// Variables globales
const urlParams = new URLSearchParams(window.location.search);
const departmentId = urlParams.get('id');
let cities = [];
let naturalAreas = [];

const domElements = {
    areasContainer: document.getElementById("contenedorAreas"),
    citiesContainer: document.getElementById("contenedorCiudades"),
    dynamicCard: document.getElementById("tarjetaDinamica"),
    searchInput: document.getElementById("buscarDetails"),
    cityCheckbox: document.getElementById("btnCiudades"),
    areaCheckbox: document.getElementById("btnAreas"),
    topContainer: document.getElementById("contenedorSuperior"),
    bottomContainer: document.getElementById("contenedorInferior")
};

// Funciones de utilidad
function fetchData(url) {
    return fetch(url).then(response => response.json());
}

function removeDiacritics(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// Función principal
function initializeApp() {
    Promise.all([
        fetchData(API_URLS.departments),
        fetchData(API_URLS.cities),
        fetchData(API_URLS.naturalAreas)
    ])
        .then(([departmentData, citiesData, areasData]) => {
            renderDepartmentInfo(departmentData);
            processCitiesData(citiesData);
            processNaturalAreasData(areasData);
            setupEventListeners();
            updateView();
        })
        .catch(error => {
            console.error("Error initializing app:", error);
        });
}

// Funciones de procesamiento de datos
function processCitiesData(allCities) {
    cities = allCities.filter(city => city.departmentId == departmentId);
}

function processNaturalAreasData(allAreas) {
    const departmentAreas = allAreas.filter(area => area.departmentId == departmentId);
    naturalAreas = [...new Set(departmentAreas.map(area => area.name))];
}

// Funciones de renderizado
function renderDepartmentInfo(departments) {
    const department = departments.find(dept => dept.id == departmentId);
    if (department) {
        domElements.dynamicCard.innerHTML = `
            <div class="card-body text-center">
                <h1 class="card-title pb-3 fw-bolder text-white">${department.name}</h1>
                <p class="card-text fw-medium text-justify fs-5 text-white">${department.description}</p>
                <p class="card-text fw-medium fs-6 text-white">Población: ${department.population} habitantes</p>
                <p class="card-text fw-medium fs-6 text-white">Superficie: ${department.surface} km²</p>
            </div>`;
    }
}

function renderCities(citiesToRender) {
    domElements.citiesContainer.innerHTML = citiesToRender.length ?
        citiesToRender.map(city => `
            <div class="col">
                <div class="card h-100">
                    <img src="../img/exotitmap.jpg" class="card-img-top p-2" alt="${city.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title fs-3 fw-bold">${city.name}</h5>
                    </div>
                </div>
            </div>
        `).join('') :
        `<div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6">
                    <div class="alert alert-warning text-center" role="alert">
                        No encontramos resultados para tu búsqueda.
                    </div>
                </div>
            </div>
        </div>`;
}

function renderNaturalAreas(areasToRender) {
    domElements.areasContainer.innerHTML = areasToRender.length ?
        areasToRender.map(area => `
            <div class="col justify-content-center">
                <div class="card h-100">
                    <img src="../img/mapaAreas.png" class="card-img-top p-2" alt="${area}">
                    <div class="card-body text-center">
                        <h5 class="card-title fs-3 fw-bold">${area}</h5>
                    </div>
                </div>
            </div>
        `).join('') :
        `<div class="col-12">
            <div class="alert alert-warning text-center" role="alert">
                No encontramos resultados para tu búsqueda.
            </div>
        </div>`;
}

// Funciones de actualización de vista
function updateView() {
    const showCities = domElements.cityCheckbox.checked;
    const showAreas = domElements.areaCheckbox.checked;
    const searchTerm = removeDiacritics(domElements.searchInput.value.toLowerCase());

    domElements.topContainer.style.display = showCities ? 'block' : 'none';
    domElements.bottomContainer.style.display = showAreas ? 'block' : 'none';

    if (showCities) {
        const filteredCities = cities.filter(city =>
            removeDiacritics(city.name.toLowerCase()).includes(searchTerm));
        renderCities(filteredCities);
    }

    if (showAreas) {
        const filteredAreas = naturalAreas.filter(area =>
            removeDiacritics(area.toLowerCase()).includes(searchTerm));
        renderNaturalAreas(filteredAreas);
    }
}

// Configuración de event listeners
function setupEventListeners() {
    domElements.searchInput.addEventListener('keyup', updateView);
    domElements.cityCheckbox.addEventListener('change', updateView);
    domElements.areaCheckbox.addEventListener('change', updateView);
}

// Inicialización de la aplicación
initializeApp();