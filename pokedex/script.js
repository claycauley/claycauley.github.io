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
let isListView = true; // Track current view mode

// Form visibility toggles
let showMegaEvolutions = false;
let showGigantamaxForms = false;
let showRegionalVariants = false;

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
let pokemonColorCache = {}; // Cache for dominant colors extracted from images
let favoritePokemon = new Set(); // Set of favorite Pokemon IDs

const STORAGE_KEYS = {
    FAVORITES: 'pokedex_favorites',
    VIEW_PREFERENCE: 'pokedex_view',
    LAST_SYNC: 'pokedex_last_sync',
    POKEMON_LIST: 'pokedex_pokemon_list',
    POKEMON_DATA: 'pokedex_pokemon_data',
    CACHE_VERSION: 'pokedex_cache_v11'
};

const pokemonContainer = document.getElementById('pokemonContainer');
const loadingContainer = document.getElementById('loadingContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const modal = document.getElementById('pokemonModal');
const closeBtn = document.querySelector('.close');
const errorContainer = document.getElementById('errorContainer');
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
const showRegionalVariantsToggle = document.getElementById('showRegionalVariantsToggle');
const settingsModal = document.getElementById('settingsModal');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const closeSettingsBtn = document.querySelector('#settingsModal .close');
const favoritesFilter = document.getElementById('favoritesFilter');
const viewToggleList = document.getElementById('viewToggleList');
const viewToggleGrid = document.getElementById('viewToggleGrid');

// Helper function to blend two hex colors
function blendColors(color1, color2) {
    // Convert hex to RGB
    const rgb1 = parseInt(color1.slice(1), 16);
    const r1 = (rgb1 >> 16) & 255;
    const g1 = (rgb1 >> 8) & 255;
    const b1 = rgb1 & 255;
    
    const rgb2 = parseInt(color2.slice(1), 16);
    const r2 = (rgb2 >> 16) & 255;
    const g2 = (rgb2 >> 8) & 255;
    const b2 = rgb2 & 255;
    
    // Average the colors
    const r = Math.round((r1 + r2) / 2);
    const g = Math.round((g1 + g2) / 2);
    const b = Math.round((b1 + b2) / 2);
    
    // Convert back to hex
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

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
    
    if (!showRegionalVariants && (lowerName.includes('-alola') || lowerName.includes('-galar') || 
                                    lowerName.includes('-hisui') || lowerName.includes('-paldea'))) {
        return true; // Hide regional variants if toggle is off
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

// Favorites Management Functions
function loadFavorites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (stored) {
            favoritePokemon = new Set(JSON.parse(stored));
        } else {
            favoritePokemon = new Set();
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoritePokemon = new Set();
    }
}

function saveFavorites() {
    try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(favoritePokemon)));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

function addFavorite(pokemonId) {
    favoritePokemon.add(String(pokemonId));
    saveFavorites();
}

function removeFavorite(pokemonId) {
    favoritePokemon.delete(String(pokemonId));
    saveFavorites();
}

function isFavorite(pokemonId) {
    return favoritePokemon.has(String(pokemonId));
}

function toggleFavorite(pokemonId) {
    if (isFavorite(pokemonId)) {
        removeFavorite(pokemonId);
        return false;
    } else {
        addFavorite(pokemonId);
        return true;
    }
}

// Update heart icon appearance based on favorite state
function updateHeartIcon(heartElement, pokemonId) {
    if (isFavorite(pokemonId)) {
        heartElement.innerHTML = '<span class="icon heart-icon favorite"></span>';
        heartElement.classList.add('filled');
    } else {
        heartElement.innerHTML = '<span class="icon heart-icon not-favorite"></span>';
        heartElement.classList.remove('filled');
    }
}

// Toggle favorite and animate heart with color
function toggleFavoriteWithAnimation(heartElement, pokemonId) {
    const isFav = toggleFavorite(pokemonId);
    
    // Get the extracted color from the card's ID element
    const card = heartElement.closest('.pokemon-card');
    const idElement = card?.querySelector('.pokemon-id');
    
    // Update heart appearance
    if (isFav) {
        heartElement.innerHTML = '<span class="icon heart-icon favorite"></span>';
        heartElement.classList.add('filled');
    } else {
        heartElement.innerHTML = '<span class="icon heart-icon not-favorite"></span>';
        heartElement.classList.remove('filled');
    }
    
    // Animate
    heartElement.style.animation = 'none';
    void heartElement.offsetWidth; // Trigger reflow
    heartElement.style.animation = 'heartPulse 0.4s ease-out';
    
    // If filtering by favorites, re-display to reflect the change
    if (favoritesFilter && favoritesFilter.checked) {
        displayPage();
    }
}

// Toggle moves accordion visibility with smooth animations and scroll
function toggleMovesAccordion(contentId) {
    const content = document.getElementById(contentId);
    if (!content) return;
    
    const isHidden = content.style.display === 'none' || !content.offsetHeight;
    
    if (isHidden) {
        // Opening the accordion
        content.style.display = 'block';
        content.style.maxHeight = '0px';
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.4s ease-out';
        
        // Trigger reflow to apply transition
        void content.offsetHeight;
        
        // Set to actual content height
        const scrollHeight = content.scrollHeight;
        content.style.maxHeight = scrollHeight + 'px';
        
        // After animation completes, restore original overflow
        setTimeout(() => {
            content.style.overflow = 'auto';
        }, 400);
        
        // Scroll the content into view smoothly
        setTimeout(() => {
            content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        // Closing the accordion
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.4s ease-out';
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Trigger reflow
        void content.offsetHeight;
        
        // Collapse to 0
        content.style.maxHeight = '0px';
        
        // Hide after animation
        setTimeout(() => {
            content.style.display = 'none';
            content.style.maxHeight = '';
            content.style.overflow = 'auto';
            content.style.transition = '';
        }, 400);
    }
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

// Map generation to region name
function getRegionFromGeneration(generation) {
    const regionMap = {
        '1': 'Kanto',
        '2': 'Johto',
        '3': 'Hoenn',
        '4': 'Sinnoh',
        '5': 'Unova',
        '6': 'Kalos',
        '7': 'Alola',
        '8': 'Galar',
        '9': 'Paldea'
    };
    return regionMap[generation] || '';
}// Enrich Pokemon data with type, generation, and category info
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
                    // For mega, check if pokemon name contains '-mega'
                    if (!pokemon.name.includes('-mega')) {
                        matches = false;
                    }
                } else if (activeFilters.category === 'gmax') {
                    // For gmax, check if pokemon name contains '-gmax' or '-gigantamax'
                    if (!pokemon.name.includes('-gmax') && !pokemon.name.includes('-gigantamax')) {
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
    const filterBadgeEl = document.getElementById('filterBadge');
    
    if (filterCountEl && filterBadgeEl) {
        if (activeCount > 0) {
            filterCountEl.textContent = activeCount;
            filterBadgeEl.style.display = 'flex';
        } else {
            filterBadgeEl.style.display = 'none';
        }
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
    if (favoritesFilter) {
        favoritesFilter.checked = false;
    }
    isSearching = false;
    searchInput.value = '';
    updateFilterBadge();
    displayPage();
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
    loadFavorites(); // Load saved favorites from localStorage
    await initializeFilters();
    await loadPokemonList();
    
    // Wire up view toggle button (disabled for now - keeping code for future)
    // if (viewToggleBtn) {
    //     viewToggleBtn.addEventListener('click', toggleViewMode);
    // }
    
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
    if (showRegionalVariantsToggle) {
        showRegionalVariantsToggle.addEventListener('change', (e) => {
            showRegionalVariants = e.target.checked;
            // Re-render the current Pokemon list without reloading
            displayPage();
        });
    }
    // Wire up filters modal
    // Helper function to close modal with animation
    function closeModal(modal, modalContent) {
        modalContent.style.animation = 'slideDownOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        modal.style.animation = 'backdropFadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => {
            modal.style.display = 'none';
            // Reset animations for next open, but keep display:none
            void modalContent.offsetWidth; // Trigger reflow
            modalContent.style.animation = '';
            modal.style.animation = '';
        }, 420);
    }

    if (openFiltersBtn) {
        openFiltersBtn.addEventListener('click', () => {
            filtersModal.style.display = 'flex';
        });
    }
    if (closeFiltersBtn) {
        closeFiltersBtn.addEventListener('click', () => {
            closeModal(filtersModal, filtersModal.querySelector('.modal-content'));
        });
    }
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            applyFilters().then(() => {
                closeModal(filtersModal, filtersModal.querySelector('.modal-content'));
            });
        });
    }
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            resetFilters().then(() => {
                closeModal(filtersModal, filtersModal.querySelector('.modal-content'));
            });
        });
    }
    // Wire up favorites filter checkbox
    if (favoritesFilter) {
        favoritesFilter.addEventListener('change', () => {
            displayPage();
        });
    }
    // Wire up settings modal
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
        });
    }
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            closeModal(settingsModal, settingsModal.querySelector('.modal-content'));
        });
    }
    
    // View toggle buttons
    if (viewToggleList) {
        viewToggleList.addEventListener('click', () => {
            isListView = true;
            pokemonContainer.classList.add('list-view');
            viewToggleList.classList.add('active');
            viewToggleGrid.classList.remove('active');
            localStorage.setItem('pokemonViewMode', 'list');
            displayPage();
        });
    }
    
    if (viewToggleGrid) {
        viewToggleGrid.addEventListener('click', () => {
            isListView = false;
            pokemonContainer.classList.remove('list-view');
            viewToggleGrid.classList.add('active');
            viewToggleList.classList.remove('active');
            localStorage.setItem('pokemonViewMode', 'grid');
            displayPage();
        });
    }
    
    // Global modal handlers - click outside or ESC to close
    window.addEventListener('click', (event) => {
        if (event.target === filtersModal) {
            closeModal(filtersModal, filtersModal.querySelector('.modal-content'));
        }
        if (event.target === settingsModal) {
            closeModal(settingsModal, settingsModal.querySelector('.modal-content'));
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (filtersModal.style.display === 'flex') {
                closeModal(filtersModal, filtersModal.querySelector('.modal-content'));
            }
            if (settingsModal.style.display === 'flex') {
                closeModal(settingsModal, settingsModal.querySelector('.modal-content'));
            }
        }
    });

    displayPage();
}

// Load the list of all Pokemon
async function loadPokemonList() {
    try {
        // Check if we already have all Pokemon cached in memory
        if (allPokemon.length > 0) {
            // We already have the data, skip loading
            return;
        }
        
        // Try to load from localStorage first
        const cachedData = localStorage.getItem(STORAGE_KEYS.POKEMON_LIST);
        const cacheVersion = localStorage.getItem(STORAGE_KEYS.CACHE_VERSION);
        
        if (cachedData && cacheVersion === STORAGE_KEYS.CACHE_VERSION) {
            try {
                const parsedData = JSON.parse(cachedData);
                allPokemon = parsedData;
                totalPokemonCount = allPokemon.length;
                
                // Rebuild pokemonDataCache from the cached data
                // This is necessary so types and other data display correctly
                allPokemon.forEach(pokemon => {
                    const id = pokemon.url.split('/').filter(Boolean).pop();
                    if (!pokemonDataCache[id]) {
                        pokemonDataCache[id] = {
                            types: pokemon.types || [],
                            generation: pokemon.generation || '',
                            isLegendary: pokemon.isLegendary || false,
                            isMythical: pokemon.isMythical || false,
                            isBaby: pokemon.isBaby || false,
                            baseNationalDexNumber: pokemon.baseNationalDexNumber || parseInt(id)
                        };
                    }
                });
                
                // Load from cache - show immediately
                hideLoadingScreen();
                displayPage();
                
                // Verify cache is fresh by checking API in background (optional - remove if too slow)
                // skipBackgroundVerification = true;
                return;
            } catch (e) {
                console.warn('Failed to parse cached Pokemon data:', e);
                localStorage.removeItem(STORAGE_KEYS.POKEMON_LIST);
            }
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
        
        // Enrich allPokemon with metadata for caching
        const enrichedPokemon = allPokemon.map(pokemon => {
            const id = pokemon.url.split('/').filter(Boolean).pop();
            const cache = pokemonDataCache[id];
            return {
                ...pokemon,
                types: cache?.types || [],
                generation: cache?.generation || '',
                isLegendary: cache?.isLegendary || false,
                isMythical: cache?.isMythical || false,
                isBaby: cache?.isBaby || false,
                baseNationalDexNumber: cache?.baseNationalDexNumber || parseInt(id)
            };
        });
        
        // Cache to localStorage
        try {
            localStorage.setItem(STORAGE_KEYS.POKEMON_LIST, JSON.stringify(enrichedPokemon));
            localStorage.setItem(STORAGE_KEYS.CACHE_VERSION, STORAGE_KEYS.CACHE_VERSION);
        } catch (e) {
            console.warn('Failed to cache Pokemon list to localStorage:', e);
            // Continue anyway - app will still work, just slower on reload
        }
        
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
        
        // Hide Megas if toggle is off AND not filtering by mega
        if (!showMegaEvolutions && lowerName.includes('-mega') && activeFilters.category !== 'mega') {
            return false;
        }
        
        // Hide Gmaxes if toggle is off AND not filtering by gmax
        if (!showGigantamaxForms && (lowerName.includes('-gmax') || lowerName.includes('-gigantamax')) && activeFilters.category !== 'gmax') {
            return false;
        }
        
        // Hide regional variants if toggle is off
        if (!showRegionalVariants && (lowerName.includes('-alola') || lowerName.includes('-galar') || 
                                       lowerName.includes('-hisui') || lowerName.includes('-paldea'))) {
            return false;
        }
        
        return true;
    });
    
    // Apply favorites filter if enabled
    if (favoritesFilter && favoritesFilter.checked) {
        pagePokemon = pagePokemon.filter(pokemon => {
            const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
            return isFavorite(pokemonId);
        });
    }
    
    pokemonContainer.innerHTML = '';
    visibleStart = 0;
    
    // Only render the first batch of Pokemon
    const endIndex = Math.min(visibleStart + visibleCount, pagePokemon.length);
    const visiblePokemon = pagePokemon.slice(visibleStart, endIndex);
    
    visiblePokemon.forEach((pokemon, index) => {
        const card = createPokemonCard(pokemon);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'none';
        pokemonContainer.appendChild(card);
        
        // Stagger animation
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 20);
        
        // After stagger completes, remove transition
        setTimeout(() => {
            card.style.transition = 'none';
        }, (index * 20) + 400);
    });
    
    // Setup intersection observer to load more when scrolling
    setupIntersectionObserver(pagePokemon);
    
    // Setup card entrance animations
    setTimeout(() => setupCardAnimations(), 300);
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
        card.style.transition = 'none';
        pokemonContainer.appendChild(card);
        
        // Stagger animation
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 20);
        
        // After stagger completes, remove transition
        setTimeout(() => {
            card.style.transition = 'none';
        }, (index * 20) + 400);
    });
    
    // Setup animations for the new cards
    setTimeout(() => setupCardAnimations(), 100);
    
    // Re-observe the new last child
    if (intersectionObserver && pokemonContainer.lastChild) {
        intersectionObserver.observe(pokemonContainer.lastChild);
    }
}

// Toggle between grid and list view
function toggleViewMode() {
    isListView = !isListView;
    pokemonContainer.classList.toggle('list-view', isListView);
    
    // Update button icon - show what you're switching TO
    if (viewToggleIcon) {
        viewToggleIcon.textContent = isListView ? '⊞' : '≡';
    }
    
    // Save preference to localStorage
    localStorage.setItem('pokemonViewMode', isListView ? 'list' : 'grid');
    
    // Redraw all cards in new view
    displayPage();
}

// Load saved view preference
function loadViewPreference() {
    const savedMode = localStorage.getItem('pokemonViewMode');
    if (savedMode === 'list' || !savedMode) {
        // Default to list view if no preference is saved
        isListView = true;
        pokemonContainer.classList.add('list-view');
        if (viewToggleIcon) {
            viewToggleIcon.textContent = '⊞'; // Grid icon - shows what you can switch to
        }
        if (viewToggleList) {
            viewToggleList.classList.add('active');
        }
        if (viewToggleGrid) {
            viewToggleGrid.classList.remove('active');
        }
    } else if (savedMode === 'grid') {
        // Grid view
        isListView = false;
        pokemonContainer.classList.remove('list-view');
        if (viewToggleIcon) {
            viewToggleIcon.textContent = '≡'; // List icon - shows what you can switch to
        }
        if (viewToggleGrid) {
            viewToggleGrid.classList.add('active');
        }
        if (viewToggleList) {
            viewToggleList.classList.remove('active');
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

// Convert hex color to RGB object
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 246, g: 246, b: 246 };
}

// Manual color overrides for specific Pokemon forms
const pokemonColorOverrides = {
    'blastoise': '#8EA9CF',
    'electabuzz': '#F7D02C',
    'electivire': '#EDCC81',
    'electrode': '#e3928f',
    'electrode-hisui': '#d05915',
    'nidoran-m': '#CBA1C9',
    'pinsir': '#b6a6a4',
};

function getManualColorOverride(pokemon) {
    // Check by exact name first (handles all forms/variations)
    const nameLower = pokemon.name.toLowerCase();
    if (pokemonColorOverrides[nameLower]) {
        return pokemonColorOverrides[nameLower];
    }
    return null;
}

// Calculate relative luminance for WCAG contrast
function getLuminance(r, g, b) {
    // Convert to sRGB
    const [rs, gs, bs] = [r, g, b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    // Calculate luminance
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate WCAG contrast ratio
function getContrastRatio(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

// Determine if text color should be white or black based on background
function getOptimalTextColor(backgroundColor) {
    const bgRgb = hexToRgb(backgroundColor);
    const whiteLuminance = { r: 255, g: 255, b: 255 };
    const blackLuminance = { r: 0, g: 0, b: 0 };
    
    const whiteContrast = getContrastRatio(bgRgb, whiteLuminance);
    const blackContrast = getContrastRatio(bgRgb, blackLuminance);
    
    // WCAG AA standard requires 4.5:1 for normal text
    // Use white text if contrast with white is better and meets minimum
    if (whiteContrast >= 4.5 && whiteContrast > blackContrast) {
        return '#ffffff';
    }
    
    return '#000000';
}
// Extract dominant color using Vibrant.js
async function getDominantColorFromImage(imageUrl) {
    return new Promise((resolve) => {
        try {
            if (typeof Vibrant !== 'undefined') {
                new Vibrant(imageUrl, {
                    colorCount: 64,
                    quality: 5
                }).getPalette((err, palette) => {
                    if (err || !palette) {
                        resolve('#ffffff');
                        return;
                    }
                    
                    // Try vibrant first, then fall back to other colors
                    if (palette.Vibrant) {
                        const rgb = palette.Vibrant.getRgb();
                        const hex = '#' + rgb.map(x => {
                            const hx = Math.round(x).toString(16);
                            return hx.length === 1 ? '0' + hx : hx;
                        }).join('').toUpperCase();
                        resolve(hex);
                    } else if (palette.DarkVibrant) {
                        const rgb = palette.DarkVibrant.getRgb();
                        const hex = '#' + rgb.map(x => {
                            const hx = Math.round(x).toString(16);
                            return hx.length === 1 ? '0' + hx : hx;
                        }).join('').toUpperCase();
                        resolve(hex);
                    } else if (palette.LightVibrant) {
                        const rgb = palette.LightVibrant.getRgb();
                        const hex = '#' + rgb.map(x => {
                            const hx = Math.round(x).toString(16);
                            return hx.length === 1 ? '0' + hx : hx;
                        }).join('').toUpperCase();
                        resolve(hex);
                    } else {
                        resolve('#ffffff');
                    }
                });
            } else {
                // Vibrant.js not available, use fallback
                resolve('#ffffff');
            }
        } catch (error) {
            console.error('Error in getDominantColorFromImage:', error);
            resolve('#ffffff');
        }
    });
}

// Canvas-based color extraction with center bias (second fallback)
function canvasColorExtractionWithCenterBias(imageUrl) {
    return new Promise((resolve) => {
        try {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            
            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 150;
                    canvas.height = 150;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 150, 150);
                    
                    const imageData = ctx.getImageData(0, 0, 150, 150);
                    const data = imageData.data;
                    
                    // Collect colors with frequency scoring
                    const colorMap = {};
                    
                    for (let i = 0; i < data.length; i += 4) {
                        const pixelIndex = i / 4;
                        const x = pixelIndex % 150;
                        const y = Math.floor(pixelIndex / 150);
                        
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];
                        
                        // Skip transparent pixels
                        if (a < 128) {
                            continue;
                        }
                        
                        // Calculate saturation (color intensity)
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        const delta = max - min;
                        const saturation = max > 0 ? delta / max : 0;
                        
                        // Skip if it's a near-white pixel (very low saturation and very high brightness)
                        if (saturation < 0.05 && max > 240) {
                            continue;
                        }
                        
                        // Skip very dark pixels
                        if (max < 50) {
                            continue;
                        }
                        
                        // Only consider colors that are saturated enough
                        if (saturation > 0.1) {
                            // Quantize to reduce similar colors
                            const quantizedR = Math.round(r / 10) * 10;
                            const quantizedG = Math.round(g / 10) * 10;
                            const quantizedB = Math.round(b / 10) * 10;
                            const hex = '#' + [quantizedR, quantizedG, quantizedB].map(x => {
                                const clamped = Math.min(255, Math.max(0, x));
                                const h = clamped.toString(16).toUpperCase();
                                return h.length === 1 ? '0' + h : h;
                            }).join('');
                            
                            // Boost scoring for center pixels (where Pokemon body typically is)
                            const centerX = 75;
                            const centerY = 75;
                            const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                            const centerBoost = Math.max(0, 1 - (dist / 60));
                            
                            // Score: saturation * frequency * center boost
                            const score = saturation * (1 + centerBoost);
                            colorMap[hex] = (colorMap[hex] || 0) + score;
                        }
                    }
                    
                    // Find the color with the highest combined score
                    let bestColor = '#ffffff';
                    let bestScore = 0;
                    
                    for (const [color, score] of Object.entries(colorMap)) {
                        if (score > bestScore) {
                            bestScore = score;
                            bestColor = color;
                        }
                    }
                    
                    resolve(bestColor);
                } catch (error) {
                    console.error('Canvas with center bias error:', error);
                    resolve('#ffffff');
                }
            };
            
            img.onerror = () => resolve('#ffffff');
            img.src = imageUrl;
        } catch (error) {
            console.error('Error in canvasColorExtractionWithCenterBias:', error);
            resolve('#ffffff');
        }
    });
}

// Simple canvas-based color averaging (final fallback)
function simpleCanvasAveraging(imageUrl) {
    return new Promise((resolve) => {
        try {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            
            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 100;
                    canvas.height = 100;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 100, 100);
                    
                    const imageData = ctx.getImageData(0, 0, 100, 100);
                    const data = imageData.data;
                    
                    let r = 0, g = 0, b = 0, count = 0;
                    
                    // Sample center 60x60 pixels, skipping white/transparent
                    for (let i = 0; i < data.length; i += 4) {
                        const pixelIndex = i / 4;
                        const x = pixelIndex % 100;
                        const y = Math.floor(pixelIndex / 100);
                        
                        // Only sample center
                        if (x < 20 || x > 80 || y < 20 || y > 80) continue;
                        
                        const a = data[i + 3];
                        if (a < 128) continue;
                        
                        const pr = data[i];
                        const pg = data[i + 1];
                        const pb = data[i + 2];
                        
                        // Skip near-white
                        if (pr > 240 && pg > 240 && pb > 240) continue;
                        
                        r += pr;
                        g += pg;
                        b += pb;
                        count++;
                    }
                    
                    if (count === 0) {
                        resolve('#ffffff');
                        return;
                    }
                    
                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);
                    
                    const hex = '#' + [r, g, b].map(x => {
                        const h = x.toString(16);
                        return h.length === 1 ? '0' + h : h;
                    }).join('').toUpperCase();
                    
                    resolve(hex);
                } catch (error) {
                    console.error('Simple averaging error:', error);
                    resolve('#ffffff');
                }
            };
            
            img.onerror = () => resolve('#ffffff');
            img.src = imageUrl;
        } catch (error) {
            console.error('Error in simpleCanvasAveraging:', error);
            resolve('#ffffff');
        }
    });
}

// Apply gradient background to card based on Pokemon type
async function applyCardGradient(card, pokemonId, imageUrl, types) {
    // Check if color is already cached
    let dominantColor = pokemonColorCache[pokemonId];
    
    if (!dominantColor) {
        // Extract color from image
        dominantColor = await getDominantColorFromImage(imageUrl);
        
        // First fallback: try canvas with center bias
        if (dominantColor === '#ffffff' || dominantColor === '#f6f6f6') {
            dominantColor = await canvasColorExtractionWithCenterBias(imageUrl);
        }
        
        // Second fallback: try simple averaging
        if (dominantColor === '#ffffff' || dominantColor === '#f6f6f6') {
            dominantColor = await simpleCanvasAveraging(imageUrl);
        }
        
        // Cache the color for future use
        pokemonColorCache[pokemonId] = dominantColor;
    }
    
    // Build gradient using type colors
    const typeColors = {
        'normal': '#999999',
        'fire': '#ED6B3A',
        'water': '#578AC9',
        'electric': '#F8DC4A',
        'grass': '#6CB645',
        'ice': '#70BAE9',
        'fighting': '#DB963B',
        'poison': '#7B57A1',
        'ground': '#A47C41',
        'flying': '#8FB8E4',
        'psychic': '#EA797B',
        'bug': '#9EC14D',
        'rock': '#BCB990',
        'ghost': '#6A486F',
        'dragon': '#5B70B3',
        'dark': '#595566',
        'steel': '#6D94A5',
        'fairy': '#DFB8D7'
    };
    
    // Apply neutral dark gradient to card
    card.style.background = `linear-gradient(90deg, #111111 0%, #333333 100%)`;
    
    // Create subtle type-color glow with 135deg gradient (diagonal)
    if (types.length === 2) {
        const type1Color = typeColors[types[0]] || '#A8A878';
        const type2Color = typeColors[types[1]] || '#A8A878';
        card.style.background = `linear-gradient(135deg, rgba(${parseInt(type1Color.slice(1,3),16)}, ${parseInt(type1Color.slice(3,5),16)}, ${parseInt(type1Color.slice(5,7),16)}, 0.65) 15%, rgba(${parseInt(type2Color.slice(1,3),16)}, ${parseInt(type2Color.slice(3,5),16)}, ${parseInt(type2Color.slice(5,7),16)}, 0.65) 65%), rgb(246, 246, 246)`;
        card.style.boxShadow = `rgba(255, 255, 255, 0.45) 0px 5px 5px inset, #000000 0px 2px 2px`;
    } else if (types.length === 1) {
        const type1Color = typeColors[types[0]] || '#A8A878';
        card.style.background = `linear-gradient(135deg, rgba(${parseInt(type1Color.slice(1,3),16)}, ${parseInt(type1Color.slice(3,5),16)}, ${parseInt(type1Color.slice(5,7),16)}, 0.65) 15%, rgba(${parseInt(type1Color.slice(1,3),16)}, ${parseInt(type1Color.slice(3,5),16)}, ${parseInt(type1Color.slice(5,7),16)}, 0.65) 65%), rgb(246, 246, 246)`;
        card.style.boxShadow = `rgba(255, 255, 255, 0.45) 0px 5px 5px inset, #000000 0px 2px 2px`;
    } else {
        card.style.background = `linear-gradient(90deg, #111111 0%, #333333 100%)`;
    }
    
    // Apply optimal text color to Pokemon name
    const nameElement = card.querySelector('.pokemon-name');
    if (nameElement) {
        nameElement.style.color = '#000000';
    }
}

// Store card animation data for morph effect
let lastClickedCard = null;

// Create a Pokemon card element
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    
    // Don't apply initial blur - let intersection observer handle it
    // This prevents search results from appearing blurred when they're already in view
    card.style.transform = 'scale(1)';
    card.style.opacity = '1';
    card.style.filter = 'blur(0px)';

    // Extract Pokemon ID from URL
    const id = pokemon.url.split('/').filter(Boolean).pop();
    
    // Get the base National Dex number for display (for forms like Mega, Regional variants)
    const baseNationalDex = pokemonDataCache[id]?.baseNationalDexNumber || parseInt(id);
    
    // Get types from cache
    const types = pokemonDataCache[id]?.types || [];
    const typesHtml = types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('');
    
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const displayName = formatPokemonName(pokemon.name);
    
    if (isListView) {
        // List view layout
        card.innerHTML = `
            <div>
                <div class="pokemon-id">#${baseNationalDex.toString().padStart(3, '0')}</div>
                <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}" data-fallback="${fallbackUrl}">
                <div class="pokemon-info">
                    <div class="pokemon-name">${displayName}</div>
                    <div class="pokemon-types">${typesHtml}</div>
                </div>
            </div>
            <div class="favorite-heart" data-pokemon-id="${id}"><span class="icon heart-icon"></span></div>
        `;
    } else {
        // Grid view layout
        card.innerHTML = `
            <div class="pokemon-id">#${baseNationalDex.toString().padStart(3, '0')}</div>
            <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}" data-fallback="${fallbackUrl}">
            <div class="pokemon-name">${displayName}</div>
            <div class="pokemon-types">${typesHtml}</div>
            <div class="favorite-heart" data-pokemon-id="${id}"><span class="icon heart-icon"></span></div>
        `;
    }

    // Load image with caching
    const img = card.querySelector('img');
    img.addEventListener('error', function() {
        this.src = this.dataset.fallback;
    });
    
    // Apply a default light gradient immediately to prevent flicker
    card.style.background = `linear-gradient(90deg, rgb(255, 255, 255) 20%, rgb(230, 230, 230) 80%)`;
    
    // Update heart icon state based on favorites
    const heart = card.querySelector('.favorite-heart');
    updateHeartIcon(heart, id);
    
    // Add heart click handler
    heart.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        toggleFavoriteWithAnimation(heart, id);
    });
    
    // Use cached image if available
    fetchImageWithCache(imageUrl).then(cachedUrl => {
        if (cachedUrl && img.src === imageUrl) {
            img.src = cachedUrl;
        }
    });
    
    // Extract dominant color from image and apply it as a gradient background
    img.addEventListener('load', async function() {
        const imageToAnalyze = this.src || imageUrl;
        const pokemonId = pokemon.id || pokemon.url.split('/').filter(Boolean).pop();
        await applyCardGradient(card, pokemonId, imageToAnalyze, types);
    });
    
    // Handle case where image is cached and loads before event listener is attached
    if (img.complete && img.naturalHeight !== 0) {
        const pokemonId = pokemon.id || pokemon.url.split('/').filter(Boolean).pop();
        applyCardGradient(card, pokemonId, img.src || imageUrl, types);
    }

    card.addEventListener('click', () => {
        lastClickedCard = card;
        showPokemonDetails(pokemon);
    });
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
        
        // Calculate morph animation from card to modal
        let cardX = 0, cardY = 0, cardScale = 1;
        if (lastClickedCard) {
            const cardRect = lastClickedCard.getBoundingClientRect();
            const containerRect = pokemonContainer.getBoundingClientRect();
            
            // Account for container scroll position
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const modalCenterX = window.innerWidth / 2;
            const modalCenterY = window.innerHeight / 2;
            
            // Calculate translate to move from card center to modal center
            cardX = cardCenterX - modalCenterX;
            cardY = cardCenterY - modalCenterY;
            
            // Calculate scale more accurately
            // Modal content is roughly 550px wide on desktop, card is around 200px
            const estimatedModalWidth = Math.min(window.innerWidth * 0.55, 550);
            cardScale = Math.max(0.15, cardRect.width / estimatedModalWidth);
            
            // Set CSS variables for animation
            modal.style.setProperty('--card-x', `${cardX}px`);
            modal.style.setProperty('--card-y', `${cardY}px`);
            modal.style.setProperty('--card-scale', cardScale);
        }
        
        const modalImage = document.getElementById('modalImage');
        const modalName = document.getElementById('modalName');
        const modalId = document.getElementById('modalId');
        const modalRegion = document.getElementById('modalRegion');
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
        
        // Set region display
        const generation = pokemonDataCache[id]?.generation || getGenerationFromId(id);
        const region = getRegionFromGeneration(generation);
        modalRegion.innerHTML = `<span class="icon location"></span> ${region} Region`;

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

        // Setup heart icon in modal header
        let modalHeart = document.querySelector('.modal-favorite-heart');
        if (!modalHeart) {
            const modalHeader = document.querySelector('.modal-header');
            modalHeart = document.createElement('div');
            modalHeart.className = 'modal-favorite-heart';
            modalHeader.appendChild(modalHeart);
        }
        
        updateHeartIcon(modalHeart, id);
        modalHeart.dataset.pokemonId = id;
        modalHeart.onclick = (e) => {
            e.stopPropagation();
            toggleFavoriteWithAnimation(modalHeart, id);
            
            // Also update the card heart if it exists
            if (lastClickedCard) {
                const cardHeart = lastClickedCard.querySelector('.favorite-heart');
                if (cardHeart) {
                    updateHeartIcon(cardHeart, id);
                }
            }
        };

        // Type colors for modal badges
        const typeColors = {
            'normal': '#999999',
            'fire': '#ED6B3A',
            'water': '#578AC9',
            'electric': '#F8DC4A',
            'grass': '#6CB645',
            'ice': '#70BAE9',
            'fighting': '#DB963B',
            'poison': '#7B57A1',
            'ground': '#A47C41',
            'flying': '#8FB8E4',
            'psychic': '#EA797B',
            'bug': '#9EC14D',
            'rock': '#BCB990',
            'ghost': '#6A486F',
            'dragon': '#5B70B3',
            'dark': '#595566',
            'steel': '#6D94A5',
            'fairy': '#DFB8D7'
        };

        // Display types
        const typesHtml = data.types.map(typeObj => {
            const typeName = typeObj.type.name;
            const typeColor = typeColors[typeName] || '#667eea';
            return `<span class="modal-type-badge" style="background-color: ${typeColor};">
                <span class="type-badge type-${typeName}"></span>
                <span>${typeName}</span>
            </span>`;
        }).join('');
        modalTypes.innerHTML = typesHtml;

        // Display height and weight
        const heightInMeters = data.height / 10;
        const weightInKg = data.weight / 10;
        const modalHeightWeight = document.getElementById('modalHeightWeight');
        modalHeightWeight.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="display: grid; grid-template-columns: max-content max-content; gap: .5rem;">
                    <div style="font-weight: bold; color: #FFF; font-size: 14px; margin-bottom: 5px;"><span class="icon height" style="margin-right:4px;"></span> Height:</div>
                    <div style="color: #CCC; font-size: 14px;">${heightInMeters.toFixed(1)} m</div>
                </div>
                <div style="display: grid; grid-template-columns: max-content max-content; gap: .5rem;">
                    <div style="font-weight: bold; color: #FFF; font-size: 14px; margin-bottom: 5px;"><span class="icon weight" style="margin-right:4px;"></span> Weight:</div>
                    <div style="color: #CCC; font-size: 14px;">${weightInKg.toFixed(1)} kg</div>
                </div>
            </div>
        `;

        // Display gender ratio
        const speciesUrl = data.species.url;
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        
        const modalGender = document.getElementById('modalGender');
        let genderHtml = '';
        
        if (speciesData.gender_rate === -1) {
            genderHtml = '<div style="color: #CCC; font-size: 14px;">Genderless</div>';
        } else {
            const femalePercent = (speciesData.gender_rate / 8) * 100;
            const malePercent = 100 - femalePercent;
            
            genderHtml = `
                <div>
                    <div style="font-weight: bold; color: #FFF; font-size: 13px; margin-bottom: 8px;">Gender</div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="flex: 1; height: 16px; border-radius: 8px; overflow: hidden; display: flex;">
                            <div style="width: ${malePercent}%; background-color: #6BA3FF; transition: width 0.3s ease;"></div>
                            <div style="width: ${femalePercent}%; background-color: #FF6B9D; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 12px;">
                        <span style="color: #6BA3FF;">♂ ${malePercent.toFixed(1)}%</span>
                        <span style="color: #FF6B9D;">♀ ${femalePercent.toFixed(1)}%</span>
                    </div>
                </div>
            `;
        }
        
        // Set initial state - hidden with no opacity
        modalGender.style.opacity = '0';
        modalGender.style.transition = 'opacity 0.4s ease-in-out';
        modalGender.innerHTML = genderHtml;
        
        // Fade in after image loads
        modalImage.onload = () => {
            modalGender.style.opacity = '1';
        };
        // Also fade in after a delay if image fails or takes too long
        setTimeout(() => {
            modalGender.style.opacity = '1';
        }, 400);

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
                        <div style="font-weight: bold; color: #FFF; font-size: 13px;">${displayName}</div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div style="font-weight: bold; color: #FFF; text-align: right; font-size: 13px;">${stat.base_stat}</div>
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

        // Build and display moves accordion
        const levelMoves = [];
        const levelMoveMap = new Map(); // Track moves by name to avoid duplicates
        
        // Organize level-up moves, filtering duplicates
        data.moves.forEach(moveObj => {
            moveObj.version_group_details.forEach(detail => {
                if (detail.move_learn_method.name === 'level-up') {
                    const moveName = moveObj.move.name;
                    const level = detail.level_learned_at;
                    
                    // Only add if we haven't seen this move before, or keep the lowest level
                    if (!levelMoveMap.has(moveName) || levelMoveMap.get(moveName) > level) {
                        levelMoveMap.set(moveName, level);
                    }
                }
            });
        });
        
        // Convert map to array
        levelMoveMap.forEach((level, name) => {
            levelMoves.push({
                name: name,
                level: level
            });
        });
        
        // Sort level moves by level
        levelMoves.sort((a, b) => a.level - b.level);
        
        const modalMoves = document.getElementById('modalMoves');
        const movesToggleId = `moves-toggle-${id}`;
        const movesContentId = `moves-content-${id}`;
        
        let movesHtml = `
            <div style="border-top: 1px solid #444; padding-top: 15px; padding-bottom: 10px;">
                <button onclick="toggleMovesAccordion('${movesContentId}')" style="
                    width: 100%;
                    background-color: #333333;
                    color: #FFF;
                    border: 1px solid #555555;
                    padding: 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    text-align: left;
                    transition: all 0.3s ease;
                " onmouseover="this.style.backgroundColor='#444444'" onmouseout="this.style.backgroundColor='#333333'">
                    Moves ${levelMoves.length > 0 ? `(${levelMoves.length})` : ''}
                </button>
            </div>
            <div id="${movesContentId}" style="display: none;">
        `;
        
        // Level moves section
        if (levelMoves.length > 0) {
            levelMoves.forEach(move => {
                movesHtml += `
                    <div style="display: flex; justify-content: space-between; padding: 6px; background-color: #2a2a2a; border-radius: 4px; margin-bottom: 4px; font-size: 13px;">
                        <span style="color: #CCC; text-transform: capitalize;">${move.name.replace('-', ' ')}</span>
                        <span style="color: #999; font-weight: bold;">Lv. ${move.level}</span>
                    </div>
                `;
            });
            movesHtml += '</div></div>';
        }
        
        movesHtml += `
                </div>
            </div>
        `;
        
        modalMoves.innerHTML = movesHtml;

        modal.style.display = 'block';
        
        // Trigger opening animation class for staggered content fades
        modal.classList.add('opening');
        
        // Apply dynamic color to Pokemon modal close button
        const pokemonCloseBtn = document.getElementById('pokemonModalClose');
        if (pokemonCloseBtn) {
            // Get the extracted color from the card's ID element or extract it
            let modalColor = null;
            
            // Try to get color from manual overrides first
            modalColor = getManualColorOverride(pokemon);
            
            if (!modalColor) {
                // Extract color from the image
                const imageToAnalyze = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
                modalColor = await getDominantColorFromImage(imageToAnalyze);
                
                // Fallbacks
                if (modalColor === '#ffffff' || modalColor === '#f6f6f6') {
                    modalColor = await canvasColorExtractionWithCenterBias(imageToAnalyze);
                }
                if (modalColor === '#ffffff' || modalColor === '#f6f6f6') {
                    modalColor = await simpleCanvasAveraging(imageToAnalyze);
                }
            }
            
            // Set the CSS variable for the extracted color
            modal.style.setProperty('--extracted-color', modalColor);
            
            // Apply gradient to modal header using extracted color
            const headerGradient = document.querySelector('.modal-header-gradient');
            if (headerGradient) {
                headerGradient.style.background = `linear-gradient(180deg, ${modalColor} 0%, #222222 100%)`;
            }
        }
        
        // Set Settings/Filters close buttons to dark gray
        const settingsClose = document.querySelector('.close-settings');
        const filtersClose = document.querySelector('.close-filters');
        if (settingsClose) {
            settingsClose.style.color = '#222222';
            settingsClose.style.filter = 'none';
        }
        if (filtersClose) {
            filtersClose.style.color = '#222222';
            filtersClose.style.filter = 'none';
        }
        
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
                    
                    // Enrich the search results with Pokemon data (including baseNationalDexNumber)
                    await Promise.all(results.map(pokemon => enrichPokemonData(pokemon)));
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
// Debounce timer for live search
let searchDebounceTimer;

// Live search event listener - search as user types
searchInput.addEventListener('input', () => {
    // Show/hide clear button based on input value
    if (searchInput.value.trim()) {
        clearSearchBtn.classList.add('visible');
    } else {
        clearSearchBtn.classList.remove('visible');
    }
    
    // Clear the previous debounce timer
    clearTimeout(searchDebounceTimer);
    
    // Set a new debounce timer (wait 300ms after user stops typing)
    searchDebounceTimer = setTimeout(() => {
        handleSearch();
    }, 300);
});

// Clear search button click handler
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    isSearching = false;
    filteredPokemon = [];
    displayPage();
});



// Modal event listeners
closeBtn.addEventListener('click', () => {
    closePokemonModal();
});

function closePokemonModal() {
    const modalContent = document.querySelector('.modal-content');
    const modalBackdrop = document.querySelector('.modal');
    
    // Remove opening class to stop staggered animations
    modal.classList.remove('opening');
    
    // Apply both animations with proper timing
    // The backdrop fade needs to complete fully (0.6s)
    modalContent.style.animation = `morphOut 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
    modalBackdrop.style.animation = `backdropFadeOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
    
    // Wait for animations to fully complete before hiding
    setTimeout(() => {
        modal.style.display = 'none';
        
        // Reset CSS variables AFTER modal is hidden
        // Only then clear animations for next open
        modal.style.removeProperty('--card-x');
        modal.style.removeProperty('--card-y');
        modal.style.removeProperty('--card-scale');
        modalContent.style.animation = '';
        modalBackdrop.style.animation = '';
        
        lastClickedCard = null;
    }, 650);
}

function closeFiltersModalFunc() {
    filtersModal.style.display = 'none';
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closePokemonModal();
    }
    if (event.target === filtersModal) {
        closeFiltersModalFunc();
    }
});

// Close modal on ESC key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closePokemonModal();
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
            background: linear-gradient(135deg, #000000 0%, #222222 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Poppins', sans-serif;
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
                        background: #ef3b3b;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <p id="loading-text" style="color: white; font-size: 18px; margin-top: 20px;">Loading Pokémon...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
}


function hideLoadingScreen() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        // Wait 2 additional seconds to ensure all content has loaded
        setTimeout(() => {
            // Add CSS transition for fade-out
            overlay.style.transition = 'opacity 0.6s ease-out';
            overlay.style.opacity = '0';
            
            // Remove from DOM after fade is complete
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 600);
        }, 2000);
    }
}

function showError(message) {
    errorContainer.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => {
        errorContainer.innerHTML = '';
    }, 5000);
}

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/pokedex/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Global card animation observer
let cardAnimationObserver = null;

// Setup card entrance animations
function setupCardAnimations() {
    const cards = document.querySelectorAll('.pokemon-card, .pokemon-list-item');
    
    // Create observer only once
    if (!cardAnimationObserver) {
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        };
        
        cardAnimationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                const ratio = entry.intersectionRatio;
                
                // Calculate scale and opacity based on visibility ratio
                const scale = 0.9 + (ratio * 0.1);
                const opacity = 0.3 + (ratio * 0.7);
                
                // Calculate blur based on visibility (4px blur when out of view, 0px when in focus)
                const blur = (1 - ratio) * 4;
                
                // Apply the scale and fade smoothly with blur for depth of field effect
                let transform = `scale(${scale})`;
                
                card.style.transform = transform;
                card.style.opacity = opacity;
                card.style.filter = `blur(${blur}px)`;
                
                // Use a smooth transition for scroll animations
                card.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out, filter 0.15s ease-out';
            });
        }, observerOptions);
    }
    
    // Observe all cards (including new ones)
    cards.forEach(card => {
        // Only observe if not already observing
        if (!card.dataset.observed) {
            cardAnimationObserver.observe(card);
            card.dataset.observed = 'true';
        }
    });
}

// Start the app
init();
setupCardAnimations();
