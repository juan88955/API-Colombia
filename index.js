// Constantes
const API_URL = "https://api-colombia.com/api/v1/Department";

// Variables globales
let departments = [];
const contenedorDepartamentos = document.getElementById("contenedorDepartamentos");

// Función principal
function initializeApp() {
    fetchDepartments()
        .then(data => {
            departments = data;
            renderDepartments(departments);
            setupEventListeners();
        })
        .catch(error => {
            console.error("Error initializing app:", error);
        });
}

// Funciones de obtención de datos
function fetchDepartments() {
    return fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error! status: " + response.status);
            }
            return response.json();
        });
}

// Funciones de renderizado
function renderDepartments(departmentsToRender) {
    departmentsToRender.length === 0 ? renderNoResultsMessage() : renderDepartmentCards(departmentsToRender);
}

function renderNoResultsMessage() {
    contenedorDepartamentos.innerHTML = `
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6">
                    <div class="alert alert-warning text-center" role="alert">
                        No encontramos resultados para tu búsqueda.
                    </div>
                </div>
            </div>
        </div>`;
}

function renderDepartmentCards(departments) {
    const sortedDepartments = departments.sort((a, b) => a.name.localeCompare(b.name));
    contenedorDepartamentos.innerHTML = sortedDepartments.map(department => `
        <div class="col">
            <div class="card h-100 text-center">
                <img src="./img/bandera.jpeg" class="card-img-top p-2" alt="${department.name}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${department.name}</h5>
                    <p class="card-text">Superficie: ${department.surface} km²</p>
                    <p class="card-text">Población: ${department.population} habitantes</p>
                    <a href="./Modules/details.html?id=${department.id}" class="btn btn-primary mt-auto">Detalles</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Funciones de filtrado
function filterDepartments() {
    const searchTerm = document.getElementById("buscarHome").value.toLowerCase();
    const showLargePopulationOnly = document.getElementById("switchHome").checked;

    const filteredDepartments = departments.filter(department =>
        department.name.toLowerCase().includes(searchTerm) &&
        (!showLargePopulationOnly || department.population >= 2000000)
    );

    renderDepartments(filteredDepartments);
}

// Configuración de event listeners
function setupEventListeners() {
    document.getElementById("buscarHome").addEventListener('input', filterDepartments);
    document.getElementById("switchHome").addEventListener('change', filterDepartments);
}

// Inicialización de la aplicación
initializeApp();