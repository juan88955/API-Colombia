// Constantes
const API_URL = "https://api-colombia.com/api/v1/InvasiveSpecie";

// Variables globales
const tableBody = document.getElementById("cuerpoTabla");

// Función principal
function initializeApp() {
    fetchInvasiveSpecies()
        .then(renderInvasiveSpecies)
        .catch(handleError);
}

// Funciones de obtención de datos
function fetchInvasiveSpecies() {
    return fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}

// Funciones de renderizado
function renderInvasiveSpecies(species) {
    tableBody.innerHTML = species.map(createTableRow).join('');
}

function createTableRow(species) {
    let rowClass = getRowClass(species.riskLevel);
    return `
        <tr class="${rowClass}">
            <th class="p-1 text-center" scope="row">${species.name}</th>
            <td class="p-1 text-center">${species.scientificName}</td>
            <td class="p-2 text-justify">${species.impact}</td>
            <td class="p-1 text-justify">${species.manage}</td>
            <td class="p-2 text-center">${species.riskLevel}</td>
            <td class="p-1 text-center"><img src="${species.urlImage}" alt="${species.name}" class="img-fluid" style="max-width: 100px; max-height: 100px;"></td>
        </tr>
    `;
}

// Funciones de utilidad
function getRowClass(riskLevel) {
    switch(riskLevel) {
        case 1:
            return 'table-primary';
        case 2:
            return 'table-success';
        default:
            return '';
    }
}

// Manejo de errores
function handleError(error) {
    console.error('Error:', error);
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                <div class="alert alert-danger" role="alert">
                    Ha ocurrido un error al cargar los datos. Por favor, intente más tarde.
                </div>
            </td>
        </tr>
    `;
}

// Inicialización de la aplicación
initializeApp();