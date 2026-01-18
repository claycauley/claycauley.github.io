const INITIAL_LOAD = 50; // Start with 50 visible on page load
const LOAD_MORE_COUNT = 50; // Load 50 more as you scroll
const MILESTONE_151 = 151; // Show button at 151
const SCROLL_TRIGGER_THRESHOLD = 0.5; // Load when 50% of next batch is visible
const DB_NAME = 'PokedexDB';
const DB_VERSION = 1;
const IMAGE_STORE = 'pokemonImages';

// Forms to keep in main Pokedex display
const VISIBLE_FORM_SUFFIXES = ['-alola', '-galar', '-hisui', '-paldea', '-gmax', '-gigantamax', '-mega'];

// All forms (for finding alternate forms in modals)
const ALL_FORM_SUFFIXES = ['-alola', '-galar', '-hisui', '-paldea', '-gmax', '-gigantamax', '-mega', 
                           '-starter', '-active', '-totem', '-shadow', '-primal', '-eternamax',
                           '-rock-star', '-belle', '-pop-star', '-phd', '-libre', '-cosplay',
                           '-original-cap', '-hoenn-cap', '-sinnoh-cap', '-unova-cap', '-kalos-cap', '-alola-cap',
                           '-partner-cap', '-world-cap', '-attack', '-defense', '-speed', '-sandy', '-trash',
                           '-sky', '-origin', '-heat', '-wash', '-frost', '-fan', '-mow', '-sunny', '-rainy', '-snowy',
                           '-blue-striped', '-zen', '-pirouette', '-therian', '-black', '-white', '-resolute',
                           '-female', '-male', '-blade', '-shield', '-small', '-large', '-super', '-average',
                           '-red-meteor', '-orange-meteor', '-yellow-meteor', '-green-meteor', '-blue-meteor', '-indigo-meteor', '-violet-meteor',
                           '-red', '-orange', '-yellow', '-green', '-blue', '-indigo', '-violet',
                           '-busted', '-disguised', '-totem-disguised', '-totem-busted', '-busted',
                           '-unbound', '-dusk', '-dawn', '-ultra', '-ice', '-shadow', '-low-key', '-amped',
                           '-noice', '-hangry', '-crowned', '-dada', '-eternal', '-eternamax', '-limited-build',
                           '-sprinting-build', '-swimming-build', '-gliding-build', '-low-power-mode', '-drive-mode',
                           '-aquatic-mode', '-glide-mode', '-bloodmoon', '-wellspring-mask', '-hearthflame-mask', '-cornerstone-mask',
                           '-terastal', '-stellar', '-z', '-combat-breed', '-blaze-breed', '-aqua-breed',
                           '-white-striped', '-roaming', '-hero', '-three-segment', '-two-segment',
                           '-stretchy', '-droopy', '-blue-plumage', '-yellow-plumage', '-white-plumage', '-green-plumage',
                           '-pom-pom', '-pau', '-sensu', '-school', '-gulping', '-gorging'];

let allPokemon = [];
let filteredPokemon = [];
let isSearching = false;
let totalPokemonCount = 0;
let db = null; // IndexedDB instance
let isListView = false; // Track current view mode

// Form visibility toggles
let showMegaEvolutions = false;
let showGigantamaxForms = false;

// Virtualization for lazy rendering
let visibleStart = 0;
let visibleCount = 50; // Show 50 at a time
let intersectionObserver = null;

// Filter state
let activeFilters = {
    generation: '',
    type: '',
    category: ''
};
let allTypes = []; // Store all available types
let pokemonDataCache = {}; // Cache for Pokemon detailed data (type, generation)

const pokemonContainer = document.getElementById('pokemonContainer');
const loadingContainer = document.getElementById('loadingContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('pokemonModal');
const closeBtn = document.querySelector('.close');
const errorContainer = document.getElementById('errorContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const viewToggleBtn = document.getElementById('viewToggleBtn');
const viewToggleIcon = document.getElementById('viewToggleIcon');
const generationFilter = document.getElementById('generationFilter');
const typeFilter = document.getElementById('typeFilter');
const categoryFilter = document.getElementById('categoryFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const filtersModal = document.getElementById('filtersModal');
const openFiltersBtn = document.getElementById('openFiltersBtn');
const filterBadge = document.getElementById('filterBadge');
const closeFiltersBtn = document.querySelector('.close-filters');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const progressBar = document.getElementById('progressBar');
const showMegaToggle = document.getElementById('showMegaToggle');
const showGmaxToggle = document.getElementById('showGmaxToggle');
const settingsModal = document.getElementById('settingsModal');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const closeSettingsBtn = document.querySelector('#settingsModal .close');

// Helper function to check if a Pokemon name is an alternate form (any form)
function isAlternateForm(pokemonName) {
    return ALL_FORM_SUFFIXES.some(suffix => pokemonName.endsWith(suffix));
}

// Helper function to check if a Pokemon should be hidden from main display
function shouldHideFromMainDisplay(pokemonName) {
    const lowerName = pokemonName.toLowerCase();
    
    // Check if it's a hidden form
    const isHiddenForm = ALL_FORM_SUFFIXES.some(suffix => pokemonName.endsWith(suffix)) &&
                        !VISIBLE_FORM_SUFFIXES.some(suffix => pokemonName.endsWith(suffix));
    
    if (!isHiddenForm) {
        return false; // Not a hidden form, show it
    }
    
    // It's a form - check if we should hide it based on toggles
    if (!showMegaEvolutions && lowerName.includes('-mega')) {
        return true; // Hide Mega forms if toggle is off
    }
    
    if (!showGigantamaxForms && (lowerName.includes('-gmax') || lowerName.includes('-gigantamax'))) {
        return true; // Hide Gmax forms if toggle is off
    }
    
    return false; // Show it by default
}

// Filter out alternate forms from Pokemon list (keeps only base forms)
function filterOutForms(pokemonList) {
    return pokemonList.filter(pokemon => !isAlternateForm(pokemon.name));
}

// Format Pokemon name for display (convert POKEMON-Mega to Mega POKEMON, etc.)
function formatPokemonName(name) {
    const lowerName = name.toLowerCase();
    
    // Handle Nidoran gender forms: nidoran-f -> Nidoran♀, nidoran-m -> Nidoran♂
    if (lowerName === 'nidoran-f') {
        return 'Nidoran♀';
    }
    if (lowerName === 'nidoran-m') {
        return 'Nidoran♂';
    }
    
    // Handle Mega Evolutions: pokemon-mega, pokemon-mega-x, pokemon-mega-y, pokemon-mega-z
    if (lowerName.includes('-mega')) {
        const parts = lowerName.split('-mega');
        const baseName = parts[0];
        const megaVariant = parts[1] ? parts[1].replace('-', ' ').toUpperCase() : ''; // X, Y, Z
        const displayName = baseName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        if (megaVariant) {
            return `Mega ${displayName} ${megaVariant}`;
        } else {
            return `Mega ${displayName}`;
        }
    }
    
    // Handle Gigantamax: pokemon-gmax or pokemon-gigantamax
    if (lowerName.includes('-gmax') || lowerName.includes('-gigantamax')) {
        const baseName = lowerName.replace('-gmax', '').replace('-gigantamax', '');
        const displayName = baseName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        return `Gmax ${displayName}`;
    }
    
    // Handle multi-word form suffixes (e.g., pikachu-original-cap -> Original Cap Pikachu)
    // These are known multi-word suffixes that should go before the base name
    const multiWordSuffixes = [
        // Cap variants (Pikachu)
        'original-cap', 'hoenn-cap', 'sinnoh-cap', 'unova-cap', 'kalos-cap', 'alola-cap', 'partner-cap', 'world-cap',
        // Pikachu costumes
        'rock-star', 'pop-star', 'belle', 'phd', 'libre', 'cosplay',
        // Color variants (Minior)
        'red-meteor', 'orange-meteor', 'yellow-meteor', 'green-meteor', 'blue-meteor', 'indigo-meteor', 'violet-meteor',
        'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet',
        // Striped variants
        'blue-striped', 'red-striped', 'white-striped',
        // Plumage variants (Squawkabilly)
        'blue-plumage', 'yellow-plumage', 'white-plumage', 'green-plumage',
        // Personality variants (Oricorio)
        'pom-pom', 'pau', 'sensu',
        // Breed variants (Tauros)
        'combat-breed', 'blaze-breed', 'aqua-breed',
        // Build/Mode variants (Koraidon, Miraidon)
        'limited-build', 'sprinting-build', 'swimming-build', 'gliding-build',
        'low-power-mode', 'drive-mode', 'aquatic-mode', 'glide-mode',
        // Mask variants (Ogerpon)
        'wellspring-mask', 'hearthflame-mask', 'cornerstone-mask',
        // Strike variants (Urshifu)
        'single-strike', 'rapid-strike',
        // Segment variants (Dudunsparce)
        'three-segment', 'two-segment',
        // Family variants (Maushold)
        'family-of-four', 'family-of-three',
        // Rider variants (Calyrex)
        'ice-rider', 'shadow-rider',
        // Other multi-word forms
        'dada', 'unlimited', 'eternamax', 'droopy', 'stretchy', 'low-key'
    ];
    
    let matchedSuffix = null;
    for (const suffix of multiWordSuffixes) {
        if (lowerName.endsWith('-' + suffix)) {
            matchedSuffix = suffix;
            break;
        }
    }
    
    if (matchedSuffix) {
        const suffixLength = matchedSuffix.split('-').length + 1; // +1 for the dash
        const baseName = lowerName.split('-').slice(0, -suffixLength + 1).join('-');
        
        const displayBaseName = baseName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        const displayFormName = matchedSuffix.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        return `${displayFormName} ${displayBaseName}`;
    }
    
    // Handle single-word forms (Alola, Galar, Hisui, Paldea, etc.)
    if (lowerName.includes('-')) {
        const parts = lowerName.split('-');
        const formName = parts[parts.length - 1]; // Last part is the form
        const baseName = parts.slice(0, -1).join('-');
        
        const displayBaseName = baseName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        const displayFormName = formName.charAt(0).toUpperCase() + formName.slice(1);
        
        return `${displayFormName} ${displayBaseName}`;
    }
    
    // Standard name: capitalize each word
    return lowerName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Cache for base National Dex numbers of alternate forms
const nationalDexCache = {};

// Get the base National Pokedex number for a Pokemon (for forms like Mega, Regional variants, etc.)
async function getBaseNationalDexNumber(pokemonName) {
    // If already cached, return it
    if (nationalDexCache[pokemonName]) {
        return nationalDexCache[pokemonName];
    }
    
    try {
        // Fetch the Pokemon data to get species info
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) return null;
        
        const data = await response.json();
        
        // If this Pokemon has a species URL, fetch the species to get the base National Dex number
        if (data.species && data.species.url) {
            const speciesResponse = await fetch(data.species.url);
            if (!speciesResponse.ok) return null;
            
            const speciesData = await speciesResponse.json();
            const baseNationalDex = speciesData.id;
            
            // Cache it
            nationalDexCache[pokemonName] = baseNationalDex;
            return baseNationalDex;
        }
        
        // Fallback: use the Pokemon's own ID if no species data
        nationalDexCache[pokemonName] = data.id;
        return data.id;
    } catch (error) {
        console.error(`Error fetching base National Dex for ${pokemonName}:`, error);
        return null;
    }
}

// Initialize IndexedDB for image caching
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(IMAGE_STORE)) {
                database.createObjectStore(IMAGE_STORE, { keyPath: 'url' });
            }
        };
    });
}

// Cache image blob to IndexedDB
async function cacheImage(url, blob) {
    if (!db) return;
    try {
        const transaction = db.transaction([IMAGE_STORE], 'readwrite');
        const store = transaction.objectStore(IMAGE_STORE);
        store.put({ url, blob, timestamp: Date.now() });
    } catch (error) {
        console.error('Error caching image:', error);
    }
}

// Get cached image from IndexedDB
async function getCachedImage(url) {
    if (!db) return null;
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction([IMAGE_STORE], 'readonly');
            const store = transaction.objectStore(IMAGE_STORE);
            const request = store.get(url);
            
            request.onsuccess = () => {
                if (request.result) {
                    resolve(request.result.blob);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => resolve(null);
        } catch (error) {
            console.error('Error getting cached image:', error);
            resolve(null);
        }
    });
}

// Fetch image with caching
async function fetchImageWithCache(url) {
    try {
        // Try to get from cache first
        const cachedBlob = await getCachedImage(url);
        if (cachedBlob) {
            return URL.createObjectURL(cachedBlob);
        }
        
        // If not cached, fetch and cache
        const response = await fetch(url);
        if (!response.ok) return null;
        
        const blob = await response.blob();
        await cacheImage(url, blob);
        
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

// Initialize filters by fetching all available types
async function initializeFilters() {
    try {
        // Fetch all types from PokéAPI
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        
        // Extract type names and sort them
        allTypes = data.results
            .map(type => type.name)
            .filter(type => type !== 'unknown' && type !== 'shadow') // Filter out special types
            .sort();
        
        // Populate type filter dropdown
        if (typeFilter) {
            allTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                typeFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error initializing filters:', error);
    }
}

// Get generation number from Pokemon ID
function getGenerationFromId(id) {
    if (id <= 151) return '1';
    if (id <= 251) return '2';
    if (id <= 386) return '3';
    if (id <= 493) return '4';
    if (id <= 649) return '5';
    if (id <= 721) return '6';
    if (id <= 809) return '7';
    if (id <= 905) return '8';
    if (id <= 1025) return '9';
    return '';
}

// Enrich Pokemon data with type, generation, and category info
async function enrichPokemonData(pokemon) {
    const id = pokemon.url.split('/').filter(Boolean).pop();
    
    if (!pokemonDataCache[id]) {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            
            // Fetch species data for category info and base National Dex number
            const speciesResponse = await fetch(data.species.url);
            const speciesData = await speciesResponse.json();
            
            pokemonDataCache[id] = {
                types: data.types.map(t => t.type.name),
                generation: getGenerationFromId(data.id),
                isLegendary: speciesData.is_legendary,
                isMythical: speciesData.is_mythical,
                isBaby: speciesData.is_baby,
                baseNationalDexNumber: speciesData.id
            };
        } catch (error) {
            console.error('Error enriching Pokemon data for', pokemon.name, ':', error);
            pokemonDataCache[id] = { types: [], generation: '', isLegendary: false, isMythical: false, isBaby: false, baseNationalDexNumber: id };
        }
    }
    
    return pokemonDataCache[id];
}

// Apply active filters to Pokemon list
async function applyFilters() {
    activeFilters.generation = generationFilter.value;
    activeFilters.type = typeFilter.value;
    activeFilters.category = categoryFilter.value;
    
    // Reset to first page when filtering
    isSearching = false;
    searchInput.value = '';
    
    // If filters are active, filter the already-loaded allPokemon
    if (activeFilters.generation || activeFilters.type || activeFilters.category) {
        filteredPokemon = [];
        
        // Filter through the already-cached Pokemon data
        for (const pokemon of allPokemon) {
            const id = pokemon.url.split('/').filter(Boolean).pop();
            const data = pokemonDataCache[id];
            
            if (!data) {
                continue;
            }
            
            let matches = true;
            
            // Check generation filter
            if (activeFilters.generation) {
                if (data.generation !== activeFilters.generation) {
                    matches = false;
                }
            }
            
            // Check type filter
            if (matches && activeFilters.type) {
                if (!data.types || !data.types.includes(activeFilters.type)) {
                    matches = false;
                }
            }
            
            // Check category filter
            if (matches && activeFilters.category) {
                if (activeFilters.category === 'legendary') {
                    if (!data.isLegendary) {
                        matches = false;
                    }
                } else if (activeFilters.category === 'mythical') {
                    if (!data.isMythical) {
                        matches = false;
                    }
                } else if (activeFilters.category === 'baby') {
                    if (!data.isBaby) {
                        matches = false;
                    }
                } else if (activeFilters.category === 'mega') {
                    // For mega, check if pokemon name contains 'mega'
                    if (!pokemon.name.includes('mega')) {
                        matches = false;
                    }
                }
            }
            
            if (matches) {
                filteredPokemon.push(pokemon);
            }
        }
    } else {
        filteredPokemon = [];
    }
    
    updateFilterBadge();
    displayPage();
}

// Update the filter badge count
function updateFilterBadge() {
    let activeCount = 0;
    if (activeFilters.generation) activeCount++;
    if (activeFilters.type) activeCount++;
    if (activeFilters.category) activeCount++;
    
    const filterCountEl = document.getElementById('filterCount');
    if (activeCount > 0) {
        filterCountEl.textContent = activeCount;
        filterBadge.style.display = 'inline';
    } else {
        filterBadge.style.display = 'none';
    }
}

// Reset all filters
async function resetFilters() {
    activeFilters.generation = '';
    activeFilters.type = '';
    activeFilters.category = '';
    filteredPokemon = [];
    generationFilter.value = '';
    typeFilter.value = '';
    categoryFilter.value = '';
    isSearching = false;
    searchInput.value = '';
    updateFilterBadge();
    // Don't call displayPage here - let the user apply filters or close the modal
}

// Update progress bar
function updateProgress(percent) {
    progressBar.style.width = percent + '%';
    // Also update loading screen progress if visible
    const loadingProgress = document.getElementById('loading-progress');
    if (loadingProgress) {
        loadingProgress.style.width = percent + '%';
    }
}

// Complete progress bar (fade out)
function completeProgress() {
    progressBar.style.width = '100%';
    progressBar.classList.add('complete');
    // Also complete loading screen progress
    const loadingProgress = document.getElementById('loading-progress');
    if (loadingProgress) {
        loadingProgress.style.width = '100%';
    }
}

// Pre-load and cache all Pokemon data in the background
async function preloadAllData() {
    try {
        // Only proceed if we have totalPokemonCount set
        if (totalPokemonCount === 0) {
            completeProgress();
            return;
        }
        
        // First, fetch all Pokemon in the background (if we haven't already)
        let allPokemonList = [...allPokemon]; // Start with already loaded
        if (allPokemonList.length < totalPokemonCount) {
            try {
                const fullResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemonCount}&offset=0`);
                const fullData = await fullResponse.json();
                // Include ALL Pokemon (no filtering of forms)
                allPokemonList = fullData.results;
                updateProgress(5); // 5% after fetching list
            } catch (error) {
                console.warn('Could not fetch full Pokemon list, using current list:', error);
                updateProgress(5);
            }
        }
        
        // Pre-load all Pokemon data in batches
        const batchSize = 25;
        for (let i = 0; i < allPokemonList.length; i += batchSize) {
            const batch = allPokemonList.slice(i, i + batchSize);
            await Promise.all(batch.map(pokemon => enrichPokemonData(pokemon)));
            
            // Update progress bar (5% + 95% distributed)
            const progress = Math.min(95, 5 + Math.round((i + batchSize) / allPokemonList.length * 90));
            updateProgress(progress);
            
            // Small delay to prevent overwhelming the API and allow UI to stay responsive
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Complete the progress bar
        updateProgress(100);
        completeProgress();
    } catch (error) {
        console.error('Error pre-loading data:', error);
        updateProgress(100);
        completeProgress();
    }
}

// Initialize the app
async function init() {
    await initDB();
    loadViewPreference();
    await initializeFilters();
    await loadPokemonList();
    // Wire up view toggle button
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', toggleViewMode);
    }
    // Wire up form visibility toggles
    if (showMegaToggle) {
        showMegaToggle.addEventListener('change', (e) => {
            showMegaEvolutions = e.target.checked;
            // Re-render the current Pokemon list without reloading
            displayPage();
        });
    }
    if (showGmaxToggle) {
        showGmaxToggle.addEventListener('change', (e) => {
            showGigantamaxForms = e.target.checked;
            // Re-render the current Pokemon list without reloading
            displayPage();
        });
    }
    // Wire up filters modal
    if (openFiltersBtn) {
        openFiltersBtn.addEventListener('click', () => {
            filtersModal.style.display = 'block';
        });
    }
    if (closeFiltersBtn) {
        closeFiltersBtn.addEventListener('click', () => {
            filtersModal.style.display = 'none';
        });
    }
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', async () => {
            await applyFilters();
            filtersModal.style.display = 'none';
        });
    }
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', async () => {
            await resetFilters();
            filtersModal.style.display = 'none';
        });
    }
    // Wire up settings modal
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'block';
        });
    }
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    }
    // Global modal handlers - click outside or ESC to close
    window.addEventListener('click', (event) => {
        if (event.target === filtersModal) {
            filtersModal.style.display = 'none';
        }
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            filtersModal.style.display = 'none';
            settingsModal.style.display = 'none';
        }
    });
    displayPage();
}

// Load the list of all Pokemon
async function loadPokemonList() {
    try {
        // Check if we already have all Pokemon cached
        if (allPokemon.length > 0) {
            // We already have the data, skip loading
            return;
        }
        
        showLoadingScreen();
        updateProgress(0);
        
        // Fetch ALL Pokemon including alternate forms
        let fetchedPokemon = [];
        let offset = 0;
        
        // Fetch all Pokemon from the API
        while (true) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${offset}`);
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) break;
            
            totalPokemonCount = data.count || 0;
            
            // Include ALL Pokemon (base forms + alternate forms)
            fetchedPokemon = fetchedPokemon.concat(data.results);
            offset += 100;
            
            // Stop when we have all Pokemon
            if (fetchedPokemon.length >= totalPokemonCount) break;
        }
        
        // Sort by National Pokedex number (for alternate forms, use base number)
        // First enriches HALF the Pokemon to show content quickly
        let sortedPokemon = await sortPokemonByNationalDex(fetchedPokemon, true);
        
        // Keep ALL Pokemon (don't filter here, filter on display instead)
        allPokemon = sortedPokemon;
        
        updateProgress(100);
        completeProgress();
        
        // Hide loading screen after a short delay to show 100%
        setTimeout(() => {
            hideLoadingScreen();
            // Display the loaded Pokemon after splash screen disappears
            displayPage();
        }, 300);
        
        // Continue enriching remaining Pokemon in the background
        // This won't block the UI since the splash screen is already gone
        sortPokemonByNationalDex(fetchedPokemon, false).catch(error => {
            console.warn('Background Pokemon enrichment encountered an error:', error);
        });
    } catch (error) {
        showError('Failed to load Pokemon list');
        updateProgress(100);
        completeProgress();
        hideLoadingScreen();
    }
}

// Display all Pokemon
// Sort Pokemon by National Pokedex number (using base number for forms)
async function sortPokemonByNationalDex(pokemonList, onlyFirstHalf = false) {
    // Enrich all Pokemon with base National Dex numbers in batches
    const batchSize = 20;
    const listToProcess = onlyFirstHalf ? pokemonList.slice(0, Math.ceil(pokemonList.length / 2)) : pokemonList;
    
    for (let i = 0; i < listToProcess.length; i += batchSize) {
        const batch = listToProcess.slice(i, i + batchSize);
        
        // Fetch all Pokemon in this batch in parallel
        await Promise.all(batch.map(async (pokemon) => {
            const id = pokemon.url.split('/').filter(Boolean).pop();
            if (!pokemonDataCache[id] || !pokemonDataCache[id].types) {
                try {
                    const response = await fetch(pokemon.url);
                    const data = await response.json();
                    
                    let baseNationalDex = data.id;
                    let isLegendary = false;
                    let isMythical = false;
                    let isBaby = false;
                    
                    // Fetch species data to get the actual base National Dex number and category info
                    if (data.species) {
                        try {
                            const speciesResponse = await fetch(data.species.url);
                            const speciesData = await speciesResponse.json();
                            baseNationalDex = speciesData.id;
                            isLegendary = speciesData.is_legendary;
                            isMythical = speciesData.is_mythical;
                            isBaby = speciesData.is_baby;
                        } catch (e) {
                            console.warn(`Could not fetch species for ${pokemon.name}, using pokemon id`);
                        }
                    }
                    
                    // Store COMPLETE cache entry so enrichPokemonData doesn't re-fetch
                    pokemonDataCache[id] = {
                        types: data.types.map(t => t.type.name),
                        generation: getGenerationFromId(data.id),
                        isLegendary: isLegendary,
                        isMythical: isMythical,
                        isBaby: isBaby,
                        baseNationalDexNumber: baseNationalDex
                    };
                } catch (error) {
                    console.error(`Error fetching Pokemon ${pokemon.name}:`, error);
                    pokemonDataCache[id] = {
                        types: [],
                        generation: '',
                        isLegendary: false,
                        isMythical: false,
                        isBaby: false,
                        baseNationalDexNumber: parseInt(id)
                    };
                }
            }
        }));
        
        // Update progress bar (only show for first half)
        if (onlyFirstHalf) {
            const progress = Math.min(95, Math.round((i + batchSize) / listToProcess.length * 90));
            updateProgress(progress);
        }
    }
    
    // Sort by base National Dex number
    return pokemonList.sort((a, b) => {
        const idA = a.url.split('/').filter(Boolean).pop();
        const idB = b.url.split('/').filter(Boolean).pop();
        
        const baseA = pokemonDataCache[idA]?.baseNationalDexNumber || parseInt(idA);
        const baseB = pokemonDataCache[idB]?.baseNationalDexNumber || parseInt(idB);
        
        if (baseA !== baseB) {
            return baseA - baseB;
        }
        
        // If same base number (forms), sort by form name
        return a.name.localeCompare(b.name);
    });
}

function displayPage() {
    let pagePokemon = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;
    
    // Filter out non-visible forms (Alola, Galar, Hisui, Paldea, etc.) from main display
    // These forms should only appear in the modal/details view
    pagePokemon = pagePokemon.filter(pokemon => {
        const isHiddenForm = ALL_FORM_SUFFIXES.some(suffix => pokemon.name.endsWith(suffix)) &&
                            !VISIBLE_FORM_SUFFIXES.some(suffix => pokemon.name.endsWith(suffix));
        return !isHiddenForm; // Show only if NOT a hidden form
    });
    
    // Apply form visibility toggles (for Mega/Gmax which ARE in visible forms)
    pagePokemon = pagePokemon.filter(pokemon => {
        const lowerName = pokemon.name.toLowerCase();
        
        // Hide Megas if toggle is off
        if (!showMegaEvolutions && lowerName.includes('-mega')) {
            return false;
        }
        
        // Hide Gmaxes if toggle is off
        if (!showGigantamaxForms && (lowerName.includes('-gmax') || lowerName.includes('-gigantamax'))) {
            return false;
        }
        
        return true;
    });
    
    pokemonContainer.innerHTML = '';
    visibleStart = 0;
    
    // Only render the first batch of Pokemon
    const endIndex = Math.min(visibleStart + visibleCount, pagePokemon.length);
    const visiblePokemon = pagePokemon.slice(visibleStart, endIndex);
    
    visiblePokemon.forEach((pokemon, index) => {
        const card = createPokemonCard(pokemon);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        pokemonContainer.appendChild(card);
        
        // Stagger animation
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 20);
    });
    
    // Setup intersection observer to load more when scrolling
    setupIntersectionObserver(pagePokemon);
}

// Setup intersection observer to load more Pokemon when scrolling
function setupIntersectionObserver(pokemonList) {
    // Clean up old observer
    if (intersectionObserver) {
        intersectionObserver.disconnect();
    }
    
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the last visible card is near the bottom, load more
            if (entry.isIntersecting && entry.target === pokemonContainer.lastChild) {
                loadMoreCards(pokemonList);
            }
        });
    }, {
        rootMargin: '100px' // Start loading 100px before reaching the bottom
    });
    
    // Observe the container
    if (pokemonContainer.lastChild) {
        intersectionObserver.observe(pokemonContainer.lastChild);
    }
}

// Load more Pokemon cards
function loadMoreCards(pokemonList) {
    const currentLength = pokemonContainer.children.length;
    const newStart = currentLength;
    const newEnd = Math.min(newStart + visibleCount, pokemonList.length);
    
    // If we've loaded everything, stop
    if (newEnd <= currentLength) {
        return;
    }
    
    const newPokemon = pokemonList.slice(newStart, newEnd);
    
    newPokemon.forEach((pokemon, index) => {
        const card = createPokemonCard(pokemon);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        pokemonContainer.appendChild(card);
        
        // Stagger animation
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 20);
    });
    
    // Re-observe the new last child
    if (intersectionObserver && pokemonContainer.lastChild) {
        intersectionObserver.observe(pokemonContainer.lastChild);
    }
}

// Toggle between grid and list view
function toggleViewMode() {
    isListView = !isListView;
    pokemonContainer.classList.toggle('list-view', isListView);
    
    // Update button icon
    if (viewToggleIcon) {
        viewToggleIcon.textContent = isListView ? '≡' : '⊞';
    }
    
    // Save preference to localStorage
    localStorage.setItem('pokemonViewMode', isListView ? 'list' : 'grid');
    
    // Redraw all cards in new view
    displayPage();
}

// Load saved view preference
function loadViewPreference() {
    const savedMode = localStorage.getItem('pokemonViewMode');
    if (savedMode === 'list') {
        isListView = true;
        pokemonContainer.classList.add('list-view');
        if (viewToggleIcon) {
            viewToggleIcon.textContent = '≡';
        }
    }
}

// Display page with staggered animation for new cards
function displayPageWithAnimation() {
    const pagePokemon = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;

    pokemonContainer.innerHTML = '';

    pagePokemon.forEach((pokemon, index) => {
        const card = createPokemonCard(pokemon);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        pokemonContainer.appendChild(card);
        
        // Stagger animation
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 30);
    });
}

// Create a skeleton loading card
function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    
    card.innerHTML = `
        <div class="skeleton-element skeleton-id"></div>
        <div class="skeleton-element skeleton-image"></div>
        <div class="skeleton-element skeleton-name"></div>
        <div class="skeleton-types">
            <div class="skeleton-element skeleton-type"></div>
            <div class="skeleton-element skeleton-type"></div>
        </div>
    `;
    
    return card;
}

// Create a Pokemon card element
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    // Extract Pokemon ID from URL
    const id = pokemon.url.split('/').filter(Boolean).pop();
    
    // Get the base National Dex number for display (for forms like Mega, Regional variants)
    const baseNationalDex = pokemonDataCache[id]?.baseNationalDexNumber || parseInt(id);
    
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const displayName = formatPokemonName(pokemon.name);
    
    if (isListView) {
        // List view layout
        card.innerHTML = `
            <div>
                <div class="pokemon-id">#${baseNationalDex.toString().padStart(3, '0')}</div>
                <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}" data-fallback="${fallbackUrl}">
            </div>
            <div class="pokemon-name">${displayName}</div>
        `;
    } else {
        // Grid view layout
        card.innerHTML = `
            <div class="pokemon-id">#${baseNationalDex.toString().padStart(3, '0')}</div>
            <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}" data-fallback="${fallbackUrl}">
            <div class="pokemon-name">${displayName}</div>
        `;
    }

    // Load image with caching
    const img = card.querySelector('img');
    img.addEventListener('error', function() {
        this.src = this.dataset.fallback;
    });
    
    // Use cached image if available
    fetchImageWithCache(imageUrl).then(cachedUrl => {
        if (cachedUrl && img.src === imageUrl) {
            img.src = cachedUrl;
        }
    });

    card.addEventListener('click', () => showPokemonDetails(pokemon));
    return card;
}

// Show detailed modal for a Pokemon
async function showPokemonDetails(pokemon) {
    try {
        const response = await fetch(pokemon.url);
        const data = await response.json();

        const id = data.id;
        
        // Get the base National Dex number for display
        let baseNationalDex = id;
        if (data.species) {
            const speciesResponse = await fetch(data.species.url);
            const speciesData = await speciesResponse.json();
            baseNationalDex = speciesData.id;
            // Cache it for future use
            pokemonDataCache[id] = pokemonDataCache[id] || {};
            pokemonDataCache[id].baseNationalDexNumber = baseNationalDex;
        }
        
        const modalImage = document.getElementById('modalImage');
        const modalName = document.getElementById('modalName');
        const modalId = document.getElementById('modalId');
        const modalTypes = document.getElementById('modalTypes');
        const modalStats = document.getElementById('modalStats');
        const modalAbilities = document.getElementById('modalAbilities');
        const modalEvolutions = document.getElementById('modalEvolutions');
        const modalEffectiveness = document.getElementById('modalEffectiveness');

        const imageUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
        
        // Use cached image if available, otherwise use direct URL
        const cachedImageUrl = await fetchImageWithCache(imageUrl);
        modalImage.src = cachedImageUrl || imageUrl;
        modalName.textContent = formatPokemonName(data.name);
        modalId.textContent = `#${baseNationalDex.toString().padStart(3, '0')}`;

        // Setup cry button
        const cryButton = document.getElementById('cryButton');
        const cryUrl = data.cries.legacy || data.cries.latest;
        if (cryUrl) {
            cryButton.style.display = 'inline-block';
            cryButton.onclick = () => {
                const audio = new Audio(cryUrl);
                audio.play();
            };
        } else {
            cryButton.style.display = 'none';
        }

        // Display types
        modalTypes.innerHTML = data.types.map(typeObj => 
            `<span class="type-badge type-${typeObj.type.name}">${typeObj.type.name}</span>`
        ).join('');

        // Display stats
        const statNameMap = {
            'hp': 'HP',
            'attack': 'Attack',
            'defense': 'Defense',
            'special-attack': 'Sp. Atk',
            'special-defense': 'Sp. Def',
            'speed': 'Speed'
        };

        modalStats.innerHTML = `
            <div style="display: grid; grid-template-columns: 70px 1fr 40px; gap: 10px; align-items: center;">
                ${data.stats.map(stat => {
                    const maxStat = 255;
                    const percentage = (stat.base_stat / maxStat) * 100;
                    const displayName = statNameMap[stat.stat.name] || stat.stat.name;
                    return `
                        <div style="font-weight: bold; color: #333; font-size: 13px;">${displayName}</div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div style="font-weight: bold; color: #333; text-align: right; font-size: 13px;">${stat.base_stat}</div>
                    `;
                }).join('')}
            </div>
        `;

        // Display abilities
        const abilities = data.abilities.map(abilityObj => {
            const hidden = abilityObj.is_hidden ? ' (Hidden)' : '';
            return `<div>• ${abilityObj.ability.name}${hidden}</div>`;
        }).join('');
        modalAbilities.innerHTML = `<strong>Abilities:</strong><div style="margin-top: 8px;">${abilities}</div>`;

        // Fetch and display evolutions
        const evolutions = await getEvolutions(data.species.url);
        modalEvolutions.innerHTML = evolutions;

        // Fetch and display alternate forms
        const modalOtherForms = document.getElementById('modalOtherForms');
        const alternateFormsHtml = await getAlternateForms(data.name, data.id);
        modalOtherForms.innerHTML = alternateFormsHtml;

        // Fetch and display type effectiveness
        const typeEffectiveness = await getTypeEffectiveness(data.types);
        modalEffectiveness.innerHTML = typeEffectiveness;

        modal.style.display = 'block';
        
        // Scroll to top after content is rendered using requestAnimationFrame
        requestAnimationFrame(() => {
            document.querySelector('.modal-content').scrollTop = 0;
        });
    } catch (error) {
        console.error('Error in showPokemonDetails:', error);
        showError('Failed to load Pokemon details');
    }
}
// Get evolution chain for a Pokemon
async function getEvolutions(speciesUrl) {
    try {
        const speciesResponse = await fetch(speciesUrl);
        if (!speciesResponse.ok) return '';
        
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;
        
        const chainResponse = await fetch(evolutionChainUrl);
        if (!chainResponse.ok) return '';
        
        const chainData = await chainResponse.json();
        
        let html = '';
        const evolutionChain = buildEvolutionChain(chainData.chain);
        
        if (evolutionChain.length > 1) {
            html = '<div class="evolution-section"><strong>Evolution Chain:</strong><div class="evolution-chain">';
            html += evolutionChain.map((pokemon, index) => {
                let html = `
                    <div class="evolution-item" onclick="showPokemonByName('${pokemon.name}')">
                        <img class="evolution-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png'">
                        <div class="evolution-name">${pokemon.name}</div>
                `;
                if (pokemon.condition) {
                    html += `<div class="evolution-condition">${pokemon.condition}</div>`;
                }
                html += '</div>';
                
                if (index < evolutionChain.length - 1) {
                    html += '<div class="evolution-arrow">→</div>';
                }
                
                return html;
            }).join('');
            html += '</div></div>';
        }
        
        return html;
    } catch (error) {
        console.error('Error fetching evolutions:', error);
        return '';
    }
}

// Build evolution chain recursively
function buildEvolutionChain(chain) {
    const evolutions = [];
    
    const processChain = (chainLink) => {
        if (chainLink.species) {
            const pokemonId = chainLink.species.url.split('/').filter(Boolean).pop();
            const condition = getEvolutionCondition(chainLink.evolution_details);
            
            evolutions.push({
                name: chainLink.species.name,
                id: pokemonId,
                condition: condition
            });
        }
        
        if (chainLink.evolves_to.length > 0) {
            chainLink.evolves_to.forEach(evolution => processChain(evolution));
        }
    };
    
    processChain(chain);
    return evolutions;
}

// Get human-readable evolution condition
function getEvolutionCondition(evolutionDetails) {
    if (!evolutionDetails || evolutionDetails.length === 0) return '';
    
    const details = evolutionDetails[0];
    const conditions = [];
    
    if (details.min_level) conditions.push(`Level ${details.min_level}`);
    if (details.min_happiness) conditions.push(`Happiness ${details.min_happiness}`);
    if (details.min_affection) conditions.push(`Affection ${details.min_affection}`);
    if (details.item) conditions.push(`Use ${details.item.name}`);
    if (details.known_move) conditions.push(`Knows ${details.known_move.name}`);
    if (details.known_move_type) conditions.push(`Knows ${details.known_move_type.name} Move`);
    if (details.location) conditions.push(`At ${details.location.name}`);
    if (details.time_of_day) conditions.push(`Time: ${details.time_of_day}`);
    if (details.trade_species) conditions.push('Trade');
    if (details.trigger.name === 'trade' && !details.trade_species) conditions.push('Trade');
    if (details.held_item) conditions.push(`Hold ${details.held_item.name}`);
    if (details.relative_physical_stats) {
        if (details.relative_physical_stats > 0) conditions.push('Attack > Defense');
        if (details.relative_physical_stats < 0) conditions.push('Defense > Attack');
        if (details.relative_physical_stats === 0) conditions.push('Attack = Defense');
    }
    
    return conditions.length > 0 ? conditions.join(', ') : '';
}

// Get alternate forms for a Pokemon (Alola, Galar, Mega, Gmax, etc)
async function getAlternateForms(pokemonName, baseId) {
    try {
        // Fetch all Pokemon forms to find alternates
        const formsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000`);
        if (!formsResponse.ok) return '';
        
        const formsData = await formsResponse.json();
        const pokemonNameLower = pokemonName.toLowerCase();
        
        // Determine the base name (without variant suffix)
        // For "charizard" -> "charizard", for "charizard-mega-x" -> "charizard"
        let baseName = pokemonNameLower;
        if (pokemonNameLower.includes('-')) {
            baseName = pokemonNameLower.split('-')[0];
        }
        
        // Find all forms that match this base Pokemon name
        // Check both explicit suffixes AND any form that starts with the base name
        const allFormNames = formsData.results
            .map(p => p.name)
            .filter(name => name.startsWith(baseName) && name !== baseName);
        
        if (allFormNames.length === 0) return ''; // No alternate forms exist
        
        // Fetch details for each form (base + alternates)
        const formDetails = await Promise.all(
            [baseName, ...allFormNames].map(async (formName) => {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${formName}`);
                    if (!response.ok) return null;
                    return await response.json();
                } catch (err) {
                    return null;
                }
            })
        );
        
        const validForms = formDetails.filter(f => f !== null);
        if (validForms.length <= 1) return ''; // Only the base form, no alternates
        
        // Check if we're viewing the base form or a variant
        const isViewingBaseForm = pokemonNameLower === baseName;
        
        // Organize forms by type
        const megas = validForms.filter(f => f.name.includes('-mega'));
        const gmaxes = validForms.filter(f => f.name.includes('-gmax') || f.name.includes('-gigantamax'));
        const alolaForms = validForms.filter(f => f.name.includes('-alola'));
        const galarForms = validForms.filter(f => f.name.includes('-galar'));
        const hisuiForms = validForms.filter(f => f.name.includes('-hisui'));
        const paldeanForms = validForms.filter(f => f.name.includes('-paldea'));
        
        // Get remaining forms that don't fit above categories (but exclude the base form)
        const allCategorizedNames = new Set([
            baseName, // Exclude the base form from other sections
            ...megas.map(f => f.name),
            ...gmaxes.map(f => f.name),
            ...alolaForms.map(f => f.name),
            ...galarForms.map(f => f.name),
            ...hisuiForms.map(f => f.name),
            ...paldeanForms.map(f => f.name)
        ]);
        const otherForms = validForms.filter(f => !allCategorizedNames.has(f.name));
        
        let html = '';
        
        // If viewing a Mega or Gmax variant, only show the Original Form section
        const isViewingMega = pokemonNameLower.includes('-mega');
        const isViewingGmax = pokemonNameLower.includes('-gmax') || pokemonNameLower.includes('-gigantamax');
        
        if (isViewingMega || isViewingGmax) {
            // Show only the Original Form for Mega/Gmax variants
            const baseForm = validForms.find(f => f.name === baseName);
            if (baseForm) {
                html += '<div class="other-forms-section"><h4>Original Form</h4><div class="forms-grid">';
                const displayName = formatPokemonName(baseForm.name);
                const imageUrl = baseForm.sprites.other['official-artwork']?.front_default || baseForm.sprites.front_default;
                const types = baseForm.types.map(t => t.type.name).join('/');
                html += `
                    <div class="form-item" onclick="showPokemonByName('${baseForm.name}')">
                        <img class="form-image" src="${imageUrl}" alt="${baseForm.name}"
                            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${baseForm.id}.png'">
                        <div class="form-label">${displayName}</div>
                        <div class="form-type-badge">${types}</div>
                    </div>
                `;
                html += '</div></div>';
            }
            return html;
        }
        
        // Alola Forms Section
        if (alolaForms.length > 0) {
            html += '<div class="other-forms-section"><h4>Alola Forms</h4><div class="forms-grid">';
            html += alolaForms.map(form => {
                const displayName = formatPokemonName(form.name);
                const imageUrl = form.sprites.other['official-artwork']?.front_default || form.sprites.front_default;
                return `
                    <div class="form-item" onclick="showPokemonByName('${form.name}')">
                        <img class="form-image" src="${imageUrl}" alt="${form.name}" 
                            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.id}.png'">
                        <div class="form-label">${displayName}</div>
                    </div>
                `;
            }).join('');
            html += '</div></div>';
        }
        
        // Galar Forms Section
        if (galarForms.length > 0) {
            html += '<div class="other-forms-section"><h4>Galar Forms</h4><div class="forms-grid">';
            html += galarForms.map(form => {
                const displayName = formatPokemonName(form.name);
                const imageUrl = form.sprites.other['official-artwork']?.front_default || form.sprites.front_default;
                return `
                    <div class="form-item" onclick="showPokemonByName('${form.name}')">
                        <img class="form-image" src="${imageUrl}" alt="${form.name}"
                            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.id}.png'">
                        <div class="form-label">${displayName}</div>
                    </div>
                `;
            }).join('');
            html += '</div></div>';
        }
        
        // Hisui Forms Section
        if (hisuiForms.length > 0) {
            html += '<div class="other-forms-section"><h4>Hisui Forms</h4><div class="forms-grid">';
            html += hisuiForms.map(form => {
                const displayName = formatPokemonName(form.name);
                const imageUrl = form.sprites.other['official-artwork']?.front_default || form.sprites.front_default;
                return `
                    <div class="form-item" onclick="showPokemonByName('${form.name}')">
                        <img class="form-image" src="${imageUrl}" alt="${form.name}"
                            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.id}.png'">
                        <div class="form-label">${displayName}</div>
                    </div>
                `;
            }).join('');
            html += '</div></div>';
        }
        
        // Paldea Forms Section
        if (paldeanForms.length > 0) {
            html += '<div class="other-forms-section"><h4>Paldea Forms</h4><div class="forms-grid">';
            html += paldeanForms.map(form => {
                const displayName = formatPokemonName(form.name);
                const imageUrl = form.sprites.other['official-artwork']?.front_default || form.sprites.front_default;
                return `
                    <div class="form-item" onclick="showPokemonByName('${form.name}')">
                        <img class="form-image" src="${imageUrl}" alt="${form.name}"
                            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.id}.png'">
                        <div class="form-label">${displayName}</div>
                    </div>
                `;
            }).join('');
            html += '</div></div>';
        }
        
        // Mega Evolution Section
        if (megas.length > 0) {
            html += '<div class="other-forms-section"><h4>Mega Evolutions</h4><div class="forms-grid">';
            
            // Add mega forms
            html += megas.map(form => {
                const displayName = formatPokemonName(form.name);
                const imageUrl = form.sprites.other['official-artwork']?.front_default || form.sprites.front_default;
                const types = form.types.map(t => t.type.name).join('/');
                return `
                    <div class="form-item" onclick="showPokemonByName('${form.name}')">
                        <img class="form-image" src="${imageUrl}" alt="${form.name}"
                            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.id}.png'">
                        <div class="form-label">${displayName}</div>
                        <div class="form-type-badge">${types}</div>
                    </div>
                `;
            }).join('');
            html += '</div></div>';
        }
        
        // Gigantamax Section
        if (gmaxes.length > 0) {
            html += '<div class="other-forms-section"><h4>Gigantamax Forms</h4><div class="forms-grid">';
            
            // Add gmax forms
            html += gmaxes.map(form => {
                const displayName = formatPokemonName(form.name);
                const imageUrl = form.sprites.other['official-artwork']?.front_default || form.sprites.front_default;
                return `
                    <div class="form-item" onclick="showPokemonByName('${form.name}')">
                        <img class="form-image" src="${imageUrl}" alt="${form.name}"
                            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.id}.png'">
                        <div class="form-label">${displayName}</div>
                    </div>
                `;
            }).join('');
            html += '</div></div>';
        }
        
        // Other Miscellaneous Forms Section
        if (otherForms.length > 0) {
            html += '<div class="other-forms-section"><h4>Other Forms</h4><div class="forms-grid">';
            html += otherForms.map(form => {
                const displayName = formatPokemonName(form.name);
                const imageUrl = form.sprites.other['official-artwork']?.front_default || form.sprites.front_default;
                return `
                    <div class="form-item" onclick="showPokemonByName('${form.name}')">
                        <img class="form-image" src="${imageUrl}" alt="${form.name}"
                            onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.id}.png'">
                        <div class="form-label">${displayName}</div>
                    </div>
                `;
            }).join('');
            html += '</div></div>';
        }
        
        return html;
    } catch (error) {
        console.error('Error fetching alternate forms:', error);
        return '';
    }
}

// Show Pokemon by name
async function showPokemonByName(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        if (!response.ok) throw new Error('Pokemon not found');
        
        const pokemonData = await response.json();
        await showPokemonDetails({ url: pokemonData.species.url.replace('pokemon-species', 'pokemon').replace(/\/$/, '').replace(/[^/]*$/, pokemonData.id), name: pokemonName });
        
        // Smooth scroll to top of modal
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error loading Pokemon:', error);
        showError('Failed to load Pokemon');
    }
}

// Get type effectiveness details from damage_relations
async function getTypeEffectiveness(types) {
    try {
        const offensiveEffectiveness = {
            noDamage: new Set(),
            halfDamage: new Set(),
            normalDamage: new Set(),
            doubleDamage: new Set()
        };

        const defensiveEffectiveness = {
            noDamage: new Set(),
            halfDamage: new Set(),
            normalDamage: new Set(),
            doubleDamage: new Set()
        };

        // Fetch data for each type
        for (const typeObj of types) {
            try {
                const typeResponse = await fetch(typeObj.type.url);
                if (!typeResponse.ok) continue;
                
                const typeData = await typeResponse.json();
                const relations = typeData.damage_relations;

                // Offensive effectiveness - what this type is strong/weak against
                if (relations.no_damage_to) {
                    relations.no_damage_to.forEach(t => offensiveEffectiveness.noDamage.add(t.name));
                }
                if (relations.half_damage_to) {
                    relations.half_damage_to.forEach(t => offensiveEffectiveness.halfDamage.add(t.name));
                }
                if (relations.double_damage_to) {
                    relations.double_damage_to.forEach(t => offensiveEffectiveness.doubleDamage.add(t.name));
                }

                // Defensive effectiveness - what is strong/weak against this type
                if (relations.no_damage_from) {
                    relations.no_damage_from.forEach(t => defensiveEffectiveness.noDamage.add(t.name));
                }
                if (relations.half_damage_from) {
                    relations.half_damage_from.forEach(t => defensiveEffectiveness.halfDamage.add(t.name));
                }
                if (relations.double_damage_from) {
                    relations.double_damage_from.forEach(t => defensiveEffectiveness.doubleDamage.add(t.name));
                }
            } catch (error) {
                console.error('Error fetching type data:', error);
            }
        }

        let html = '';

        // Offensive section
        if (offensiveEffectiveness.doubleDamage.size > 0 || offensiveEffectiveness.halfDamage.size > 0 || offensiveEffectiveness.noDamage.size > 0) {
            html += '<div class="effectiveness-section"><div class="effectiveness-title">Offensive Coverage:</div>';
            
            if (offensiveEffectiveness.doubleDamage.size > 0) {
                html += `
                    <div style="margin-bottom: 10px;">
                        <strong style="font-size: 12px; color: #28a745;">Super Effective Against:</strong>
                        <div class="effectiveness-list" style="margin-top: 4px;">
                            ${Array.from(offensiveEffectiveness.doubleDamage).sort().map(type => 
                                `<span class="type-badge type-${type}">${type}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }
            
            if (offensiveEffectiveness.halfDamage.size > 0) {
                html += `
                    <div style="margin-bottom: 10px;">
                        <strong style="font-size: 12px; color: #ffc107;">Not Very Effective Against:</strong>
                        <div class="effectiveness-list" style="margin-top: 4px;">
                            ${Array.from(offensiveEffectiveness.halfDamage).sort().map(type => 
                                `<span class="type-badge type-${type}">${type}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }

            if (offensiveEffectiveness.noDamage.size > 0) {
                html += `
                    <div style="margin-bottom: 10px;">
                        <strong style="font-size: 12px; color: #dc3545;">No Effect Against:</strong>
                        <div class="effectiveness-list" style="margin-top: 4px;">
                            ${Array.from(offensiveEffectiveness.noDamage).sort().map(type => 
                                `<span class="type-badge type-${type}">${type}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
        }

        // Defensive section
        if (defensiveEffectiveness.doubleDamage.size > 0 || defensiveEffectiveness.halfDamage.size > 0 || defensiveEffectiveness.noDamage.size > 0) {
            html += '<div class="effectiveness-section"><div class="effectiveness-title">Type Defenses:</div>';
            
            if (defensiveEffectiveness.doubleDamage.size > 0) {
                html += `
                    <div style="margin-bottom: 10px;">
                        <strong style="font-size: 12px; color: #dc3545;">Weak To:</strong>
                        <div class="effectiveness-list" style="margin-top: 4px;">
                            ${Array.from(defensiveEffectiveness.doubleDamage).sort().map(type => 
                                `<span class="type-badge type-${type}">${type}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }
            
            if (defensiveEffectiveness.halfDamage.size > 0) {
                html += `
                    <div style="margin-bottom: 10px;">
                        <strong style="font-size: 12px; color: #28a745;">Resists:</strong>
                        <div class="effectiveness-list" style="margin-top: 4px;">
                            ${Array.from(defensiveEffectiveness.halfDamage).sort().map(type => 
                                `<span class="type-badge type-${type}">${type}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }

            if (defensiveEffectiveness.noDamage.size > 0) {
                html += `
                    <div style="margin-bottom: 10px;">
                        <strong style="font-size: 12px; color: #007bff;">Immune To:</strong>
                        <div class="effectiveness-list" style="margin-top: 4px;">
                            ${Array.from(defensiveEffectiveness.noDamage).sort().map(type => 
                                `<span class="type-badge type-${type}">${type}</span>`
                            ).join('')}
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
        }

        return html;
    } catch (error) {
        console.error('Error in getTypeEffectiveness:', error);
        return '';
    }
}

// Search functionality
async function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        isSearching = false;
        filteredPokemon = [];
        displayPage();
        return;
    }

    isSearching = true;
    
    try {
        // First search in already loaded Pokemon
        let results = allPokemon.filter(pokemon => {
            const id = pokemon.url.split('/').filter(Boolean).pop();
            return pokemon.name.toLowerCase().includes(query) || id.includes(query);
        });
        
        // If no results and query is numeric, it might be a high ID number
        if (results.length === 0 && /^\d+$/.test(query)) {
            // Try to fetch the specific Pokemon by ID
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
                if (response.ok) {
                    const pokemon = await response.json();
                    results = [{
                        name: pokemon.name,
                        url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
                    }];
                }
            } catch (error) {
                console.error('Error fetching Pokemon by ID:', error);
            }
        }
        
        // If still no results, search across all Pokemon in the API
        if (results.length === 0) {
            try {
                // Get all Pokemon to search through
                const allResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0`);
                if (allResponse.ok) {
                    const allData = await allResponse.json();
                    results = allData.results.filter(pokemon => {
                        const id = pokemon.url.split('/').filter(Boolean).pop();
                        return pokemon.name.toLowerCase().includes(query) || id.includes(query);
                    });
                }
            } catch (error) {
                console.error('Error searching all Pokemon:', error);
            }
        }
        
        filteredPokemon = results;
        displayPage();
    } catch (error) {
        console.error('Error in search:', error);
        showError('Error searching Pokemon');
    }
}

// Search event listeners
searchBtn.addEventListener('click', handleSearch);
clearBtn.addEventListener('click', () => {
    // Only clear if there's actually something to clear
    if (searchInput.value.trim() || isSearching || filteredPokemon.length > 0) {
        searchInput.value = '';
        isSearching = false;
        filteredPokemon = [];
        displayPage();
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Modal event listeners
closeBtn.addEventListener('click', () => {
    closeModal();
});

function closeModal() {
    modal.classList.add('closing');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
    }, 300);
}

function closeFiltersModalFunc() {
    filtersModal.style.display = 'none';
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === filtersModal) {
        closeFiltersModalFunc();
    }
});

// Close modal on ESC key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
        closeFiltersModalFunc();
    }
});

// Utility functions
function showLoading() {
    loadingContainer.style.display = 'block';
}

function hideLoading() {
    loadingContainer.style.display = 'none';
}

function showLoadingScreen() {
    // Create a full-screen loading overlay
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; width: 80%; max-width: 400px;">
                <h1 style="color: white; font-size: 48px; margin-bottom: 40px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🔴 Pokédex</h1>
                <div style="
                    width: 100%;
                    height: 6px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 20px;
                ">
                    <div id="loading-progress" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <p id="loading-text" style="color: white; font-size: 18px; margin-top: 20px;">Loading Pokémon...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}


function hideLoadingScreen() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showError(message) {
    errorContainer.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => {
        errorContainer.innerHTML = '';
    }, 5000);
}

// Start the app
init();
