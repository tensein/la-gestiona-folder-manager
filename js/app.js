// La Gestiona - Application Logic

// Global state
let dossiers = [];
let currentDossierId = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    loadDossiers();
    setupEventListeners();
    setupNavigation();
    updateUI();
});

// Local Storage Functions
function loadDossiers() {
    try {
        const stored = localStorage.getItem('dossiers');
        dossiers = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Erreur lors du chargement des dossiers:', error);
        dossiers = [];
    }
}

function saveDossiers() {
    try {
        localStorage.setItem('dossiers', JSON.stringify(dossiers));
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        alert('Erreur lors de l\'enregistrement des données');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Add form
    document.getElementById('addDossierForm').addEventListener('submit', handleAddDossier);

    // État du dossier change
    document.getElementById('etatDossier').addEventListener('change', handleEtatChange);

    // Autres à détailler checkbox
    document.getElementById('autresCheck').addEventListener('change', handleAutresChange);

    // Search form
    document.getElementById('searchForm').addEventListener('submit', handleSearch);

    // Print button
    document.getElementById('printState').addEventListener('click', handlePrint);

    // State tabs
    document.querySelectorAll('.state-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchStateTab(tabName);
        });
    });
}

// Navigation Setup
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const section = button.getAttribute('data-section');
            switchSection(section);
        });
    });
}

// Section Switching
function switchSection(sectionId) {
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-section') === sectionId);
    });

    // Show/hide sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.toggle('hidden', section.id !== sectionId);
    });

    // Update UI if needed
    if (sectionId === 'list' || sectionId === 'modify' || sectionId === 'delete') {
        updateUI();
    }
}

// State Tab Switching
function switchStateTab(tabName) {
    document.querySelectorAll('.state-tab').forEach(tab => {
        tab.classList.toggle('bg-blue-500', tab.getAttribute('data-tab') === tabName);
        tab.classList.toggle('text-white', tab.getAttribute('data-tab') === tabName);
    });
    updateStatesTabs();
}

// Form Handlers
function handleAddDossier(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const dossier = {
        id: Date.now(),
        number: generateDossierNumber(),
        nom: formatDossierName(formData.get('nomDossier')),
        dateArrivee: formData.get('dateArrivee'),
        etat: formData.get('etatDossier'),
        dateFin: formData.get('dateFin') || null,
        nombreEcritures: formData.get('nombreEcritures') || null,
        piecesSaisies: getCheckedValues('piecesSaisies'),
        piecesManquantes: getCheckedValues('piecesManquantes'),
        autresDetail: formData.get('autresDetail') || null,
        remarque: formData.get('remarque') || ''
    };

    // Validate
    const error = validateDossier(dossier);
    if (error) {
        showError('addFormError', error);
        return;
    }

    // Add to array and save
    dossiers.push(dossier);
    saveDossiers();
    
    // Reset form and update UI
    e.target.reset();
    updateUI();
    showSuccess('Dossier ajouté avec succès');
}

function handleModifyDossier(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const dossier = {
        ...dossiers.find(d => d.id === currentDossierId),
        nom: formatDossierName(formData.get('modifyNomDossier')),
        dateArrivee: formData.get('modifyDateArrivee'),
        etat: formData.get('modifyEtatDossier'),
        dateFin: formData.get('modifyDateFin') || null,
        nombreEcritures: formData.get('modifyNombreEcritures') || null,
        piecesSaisies: getCheckedValues('modifyPiecesSaisies'),
        piecesManquantes: getCheckedValues('modifyPiecesManquantes'),
        autresDetail: formData.get('modifyAutresDetail') || null,
        remarque: formData.get('modifyRemarque') || ''
    };

    // Validate
    const error = validateDossier(dossier);
    if (error) {
        showError('modifyFormError', error);
        return;
    }

    // Update array and save
    const index = dossiers.findIndex(d => d.id === currentDossierId);
    dossiers[index] = dossier;
    saveDossiers();
    
    // Hide form and update UI
    document.getElementById('modifyFormContainer').classList.add('hidden');
    updateUI();
    showSuccess('Dossier modifié avec succès');
}

// UI Event Handlers
function handleEtatChange(e) {
    const isTermine = e.target.value === 'Terminé';
    document.getElementById('dateFinContainer').classList.toggle('hidden', !isTermine);
    document.getElementById('nombreEcrituresContainer').classList.toggle('hidden', !isTermine);
}

function handleAutresChange(e) {
    document.getElementById('autresDetailContainer').classList.toggle('hidden', !e.target.checked);
}

function handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchNom = formData.get('searchNom').toLowerCase();
    const dateDebut = formData.get('searchDateDebut');
    const dateFin = formData.get('searchDateFin');

    const results = dossiers.filter(dossier => {
        const matchesNom = !searchNom || dossier.nom.toLowerCase().includes(searchNom);
        const matchesDate = (!dateDebut || dossier.dateArrivee >= dateDebut) &&
                           (!dateFin || dossier.dateArrivee <= dateFin);
        return matchesNom && matchesDate;
    });

    renderSearchResults(results);
}

function handlePrint() {
    window.print();
}

// Utility Functions
function generateDossierNumber() {
    return dossiers.length ? Math.max(...dossiers.map(d => d.number)) + 1 : 1;
}

function formatDossierName(name) {
    if (!name) return '';
    return name.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace(/^[a-z]/, letter => letter.toUpperCase());
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR');
}

function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
                .map(input => input.value);
}

function validateDossier(dossier) {
    if (!dossier.nom) return 'Le nom du dossier est requis';
    if (!dossier.dateArrivee) return 'La date d\'arrivée est requise';
    if (!dossier.etat) return 'L\'état du dossier est requis';
    
    if (dossier.etat === 'Terminé') {
        if (!dossier.dateFin) return 'La date de fin est requise pour un dossier terminé';
        if (!dossier.nombreEcritures) return 'Le nombre d\'écritures est requis pour un dossier terminé';
    }
    
    return null;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.scrollIntoView({ behavior: 'smooth' });
}

function showSuccess(message) {
    // You could implement a toast notification here
    alert(message);
}

// UI Update Functions
function updateUI() {
    renderDossierList();
    renderModifyList();
    renderDeleteList();
    updateStatesTabs();
}

// Render Functions
function renderDossierList() {
    const container = document.getElementById('dossierListContainer');
    if (!dossiers.length) {
        container.innerHTML = '<p class="text-gray-500">Aucun dossier disponible</p>';
        return;
    }

    container.innerHTML = dossiers.map(dossier => `
        <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div>
                <h3 class="font-medium">${dossier.nom}</h3>
                <p class="text-sm text-gray-500">${formatDate(dossier.dateArrivee)}</p>
            </div>
            <button onclick="deleteDossier(${dossier.id})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function renderModifyList() {
    const container = document.getElementById('modifyListContainer');
    if (!dossiers.length) {
        container.innerHTML = '<p class="text-gray-500">Aucun dossier disponible</p>';
        return;
    }

    container.innerHTML = dossiers.map(dossier => `
        <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div>
                <h3 class="font-medium">${dossier.nom}</h3>
                <p class="text-sm text-gray-500">${formatDate(dossier.dateArrivee)}</p>
            </div>
            <button onclick="showModifyForm(${dossier.id})" class="text-blue-500 hover:text-blue-700">
                <i class="fas fa-edit"></i>
            </button>
        </div>
    `).join('');
}

function renderDeleteList() {
    const container = document.getElementById('deleteListContainer');
    if (!dossiers.length) {
        container.innerHTML = '<p class="text-gray-500">Aucun dossier disponible</p>';
        return;
    }

    container.innerHTML = dossiers.map(dossier => `
        <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div>
                <h3 class="font-medium">${dossier.nom}</h3>
                <p class="text-sm text-gray-500">${formatDate(dossier.dateArrivee)}</p>
            </div>
            <button onclick="confirmDelete(${dossier.id})" 
                    class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                Supprimer
            </button>
        </div>
    `).join('');
}

function renderSearchResults(results) {
    const container = document.getElementById('searchResults');
    if (results.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Aucun résultat trouvé</p>';
        return;
    }
    
    container.innerHTML = results.map(dossier => `
        <div class="p-4 border rounded-lg hover:bg-gray-50">
            <h3 class="font-medium">${dossier.nom}</h3>
            <p class="text-sm text-gray-500">${formatDate(dossier.dateArrivee)}</p>
            <p class="text-sm">État: ${dossier.etat}</p>
        </div>
    `).join('');
}

// State Management
function updateStatesTabs() {
    const content = document.getElementById('stateTabContent');
    const activeTab = document.querySelector('.state-tab.bg-blue-500').getAttribute('data-tab');
    
    switch(activeTab) {
        case 'traites':
            renderDossiersTraites(content);
            break;
        case 'manquantes':
            renderPiecesManquantes(content);
            break;
        case 'ecritures':
            renderEcrituresTotal(content);
            break;
    }
}

function renderDossiersTraites(container) {
    const traites = dossiers.filter(d => d.etat === 'Terminé');
    container.innerHTML = `
        <table class="w-full">
            <thead>
                <tr class="border-b">
                    <th class="text-left py-2">Date</th>
                    <th class="text-left py-2">Nom</th>
                    <th class="text-right py-2">Écritures</th>
                </tr>
            </thead>
            <tbody>
                ${traites.map(d => `
                    <tr class="border-b">
                        <td class="py-2">${formatDate(d.dateArrivee)}</td>
                        <td class="py-2">${d.nom}</td>
                        <td class="py-2 text-right">${d.nombreEcritures}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderPiecesManquantes(container) {
    const avecManquantes = dossiers.filter(d => d.piecesManquantes.length > 0);
    container.innerHTML = `
        <table class="w-full">
            <thead>
                <tr class="border-b">
                    <th class="text-left py-2">Date</th>
                    <th class="text-left py-2">Nom</th>
                    <th class="text-left py-2">Pièces manquantes</th>
                </tr>
            </thead>
            <tbody>
                ${avecManquantes.map(d => `
                    <tr class="border-b">
                        <td class="py-2">${formatDate(d.dateArrivee)}</td>
                        <td class="py-2">${d.nom}</td>
                        <td class="py-2">${formatPiecesManquantes(d)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderEcrituresTotal(container) {
    const groupedDossiers = dossiers.reduce((acc, d) => {
        if (!acc[d.nom]) {
            acc[d.nom] = { total: 0, count: 0 };
        }
        if (d.nombreEcritures) {
            acc[d.nom].total += parseInt(d.nombreEcritures);
            acc[d.nom].count++;
        }
        return acc;
    }, {});

    const totalGeneral = Object.values(groupedDossiers)
        .reduce((sum, group) => sum + group.total, 0);

    container.innerHTML = `
        <table class="w-full">
            <thead>
                <tr class="border-b">
                    <th class="text-left py-2">Nom</th>
                    <th class="text-right py-2">Total écritures</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(groupedDossiers).map(([nom, data]) => `
                    <tr class="border-b">
                        <td class="py-2">${nom}</td>
                        <td class="py-2 text-right">${data.total}</td>
                    </tr>
                `).join('')}
                <tr class="font-bold bg-gray-50">
                    <td class="py-2">Total général</td>
                    <td class="py-2 text-right">${totalGeneral}</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Helper Functions
function formatPiecesManquantes(dossier) {
    const pieces = [...dossier.piecesManquantes];
    if (dossier.autresDetail) {
        pieces.push(dossier.autresDetail);
    }
    return pieces.join(', ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function showModifyForm(id) {
    currentDossierId = id;
    const dossier = dossiers.find(d => d.id === id);
    if (!dossier) return;

    // Show the form container
    const container = document.getElementById('modifyFormContainer');
    container.classList.remove('hidden');
    
    // Create and insert the form HTML
    container.innerHTML = createModifyFormHTML(dossier);
    
    // Setup event listeners for the new form
    setupModifyFormListeners();
    
    // Scroll to the form
    container.scrollIntoView({ behavior: 'smooth' });
}

function confirmDelete(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
        deleteDossier(id);
    }
}

function deleteDossier(id) {
    dossiers = dossiers.filter(d => d.id !== id);
    saveDossiers();
    updateUI();
    showSuccess('Dossier supprimé avec succès');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadDossiers();
    setupEventListeners();
    setupNavigation();
    updateUI();
});
