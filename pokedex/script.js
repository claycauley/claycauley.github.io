const INITIAL_LOAD = 50; // Start with 50 visible on page load
const LOAD_MORE_COUNT = 50; // Load 50 more as you scroll
const MILESTONE_151 = 151; // Show button at 151
const SCROLL_TRIGGER_THRESHOLD = 0.5; // Load when 50% of next batch is visible
const DB_NAME = 'PokedexDB';
const DB_VERSION = 1;
const IMAGE_STORE = 'pokemonImages';

let allPokemon = [];
let filteredPokemon = [];
let isSearching = false;
let nextOffset = INITIAL_LOAD;
let totalPokemonCount = 0;
let isLoadingMore = false; // prevent multiple simultaneous requests
let intersectionObserver = null;
let skeletonPlaceholders = []; // Track skeleton elements for intersection
let sentinelElement = null; // Element to trigger loading on intersection
let db = null; // IndexedDB instance
let isListView = false; // Track current view mode

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

// Initialize the app
async function init() {
    await initDB();
    loadViewPreference();
    await loadPokemonList();
    // Wire up load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePokemonManual);
    }
    // Wire up view toggle button
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', toggleViewMode);
    }
    displayPage();
    setupIntersectionObserver();
}

// Load the list of all Pokemon
async function loadPokemonList() {
    try {
        showLoadingScreen();
        // Fetch the initial list info and first batch
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${INITIAL_LOAD}&offset=0`);
        const data = await response.json();
        totalPokemonCount = data.count || 0;
        allPokemon = data.results;
        nextOffset = INITIAL_LOAD;
        
        // Display the initial batch
        displayPage();
        
        // Setup observer for lazy loading after initial display
        await new Promise(resolve => setTimeout(resolve, 100));
        setupIntersectionObserver();
        
        hideLoadingScreen();
    } catch (error) {
        showError('Failed to load Pokemon list');
        hideLoadingScreen();
    }
}

// Load the next batch of Pokemon
async function loadNextBatch() {
    if (isLoadingMore || allPokemon.length >= totalPokemonCount) return;
    
    isLoadingMore = true;
    try {
        // Add skeleton placeholders first
        const skeletonsToAdd = LOAD_MORE_COUNT;
        const skeletonRefs = [];
        
        for (let i = 0; i < skeletonsToAdd; i++) {
            const skeleton = createSkeletonCard();
            pokemonContainer.appendChild(skeleton);
            skeletonRefs.push(skeleton);
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LOAD_MORE_COUNT}&offset=${nextOffset}`);
        if (!response.ok) throw new Error('Failed to load more');
        
        const data = await response.json();
        if (!Array.isArray(data.results) || data.results.length === 0) {
            // Remove unused skeletons if no results
            skeletonRefs.forEach(s => s.remove());
            return;
        }

        // Replace skeletons with actual cards
        allPokemon = allPokemon.concat(data.results);
        nextOffset += data.results.length;
        
        data.results.forEach((pokemon, index) => {
            const skeleton = skeletonRefs[index];
            if (skeleton && skeleton.parentNode) {
                const card = createPokemonCard(pokemon);
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                skeleton.parentNode.replaceChild(card, skeleton);
                
                // Animate in
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 30);
            }
        });

        // Update button visibility
        updateLoadMoreButtonVisibility();
        
        // Re-add sentinel and setup observer for next batch
        if (sentinelElement && sentinelElement.parentNode) {
            sentinelElement.remove();
        }
        sentinelElement = document.createElement('div');
        sentinelElement.id = 'load-sentinel';
        sentinelElement.style.height = '20px';
        pokemonContainer.appendChild(sentinelElement);
        
        setupIntersectionObserver();
        
    } catch (error) {
        console.error('Error loading more Pokemon:', error);
        showError('Failed to load more Pokémon');
    } finally {
        isLoadingMore = false;
    }
}

// Setup intersection observer for lazy loading as user scrolls
function setupIntersectionObserver() {
    if (intersectionObserver) {
        intersectionObserver.disconnect();
    }
    
    // Don't set up observer if searching
    if (isSearching) {
        return;
    }
    
    const options = {
        root: null,
        rootMargin: '200px',
        threshold: 0.01
    };
    
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If sentinel is visible and we haven't loaded everything and not searching
            if (entry.isIntersecting && entry.target.id === 'load-sentinel' && !isLoadingMore && !isSearching && allPokemon.length < totalPokemonCount) {
                loadNextBatch();
            }
        });
    }, options);
    
    // Observe the sentinel element
    if (sentinelElement) {
        intersectionObserver.observe(sentinelElement);
    }
}

// Manual load more button click
async function loadMorePokemonManual() {
    if (isLoadingMore || allPokemon.length >= totalPokemonCount) return;
    await loadNextBatch();
}


// Helper function to update button visibility
function updateLoadMoreButtonVisibility() {
    if (!loadMoreBtn) return;
    
    // Show button if we've reached 151 and haven't loaded all
    if (allPokemon.length >= MILESTONE_151 && allPokemon.length < totalPokemonCount) {
        loadMoreBtn.style.display = 'inline-block';
        loadMoreBtn.textContent = `Load More Pokémon (${allPokemon.length}/${totalPokemonCount})`;
    } else if (allPokemon.length >= totalPokemonCount) {
        // Hide button when all loaded
        loadMoreBtn.style.display = 'none';
    } else {
        // Hide button before 151
        loadMoreBtn.style.display = 'none';
    }
}

// Display current page of Pokemon
function displayPage() {
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
        }, index * 20);
    });
    
    // Add sentinel element at the bottom to trigger lazy loading (only if not searching)
    if (!isSearching) {
        if (sentinelElement) {
            sentinelElement.remove();
        }
        sentinelElement = document.createElement('div');
        sentinelElement.id = 'load-sentinel';
        sentinelElement.style.height = '20px';
        pokemonContainer.appendChild(sentinelElement);
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
    
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    if (isListView) {
        // List view layout
        card.innerHTML = `
            <div>
                <div class="pokemon-id">#${id.padStart(3, '0')}</div>
                <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}" data-fallback="${fallbackUrl}">
            </div>
            <div class="pokemon-name">${pokemon.name}</div>
        `;
    } else {
        // Grid view layout
        card.innerHTML = `
            <div class="pokemon-id">#${id.padStart(3, '0')}</div>
            <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}" data-fallback="${fallbackUrl}">
            <div class="pokemon-name">${pokemon.name}</div>
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
        modalName.textContent = data.name;
        modalId.textContent = `#${id.toString().padStart(3, '0')}`;

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

        // Fetch and display games
        const games = await getGamesList(data.species.url);
        const modalGames = document.getElementById('modalGames');
        if (modalGames) {
            modalGames.innerHTML = games;
        }

        // Fetch and display evolutions
        const evolutions = await getEvolutions(data.species.url);
        modalEvolutions.innerHTML = evolutions;

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

// Get games list for a Pokemon
async function getGamesList(speciesUrl) {
    try {
        const speciesResponse = await fetch(speciesUrl);
        if (!speciesResponse.ok) return '';
        
        const speciesData = await speciesResponse.json();
        
        // Get encounters to find games
        if (!speciesData.id) return '';
        
        const encountersUrl = `https://pokeapi.co/api/v2/pokemon/${speciesData.id}/encounters`;
        const encountersResponse = await fetch(encountersUrl);
        if (!encountersResponse.ok) return '';
        
        const encounters = await encountersResponse.json();
        
        // Extract unique games from encounters
        const games = new Set();
        encounters.forEach(encounter => {
            if (encounter.version_details) {
                encounter.version_details.forEach(versionDetail => {
                    games.add(versionDetail.version.name);
                });
            }
        });
        
        if (games.size === 0) return '';
        
        // Map of games to their release order (more granular for accurate chronological sorting)
        const gameReleaseOrder = {
            // Gen I (1996)
            'red': 1.1, 'blue': 1.2, 
            // Gen I Enhanced (1998)
            'yellow': 1.3,
            // Gen II (1999)
            'gold': 2.1, 'silver': 2.2, 
            // Gen II Enhanced (2000)
            'crystal': 2.3,
            // Gen III (2002)
            'ruby': 3.1, 'sapphire': 3.2, 
            // Gen III Enhanced (2004)
            'emerald': 3.3, 'fire-red': 3.4, 'leaf-green': 3.5,
            // Gen IV (2006)
            'diamond': 4.1, 'pearl': 4.2, 
            // Gen IV Enhanced (2008)
            'platinum': 4.3,
            // Gen IV Remakes (2009-2010)
            'heart-gold': 4.4, 'soul-silver': 4.5,
            // Gen V (2010)
            'black': 5.1, 'white': 5.2, 
            // Gen V Enhanced (2012)
            'black-2': 5.3, 'white-2': 5.4,
            // Gen VI (2013)
            'x': 6.1, 'y': 6.2, 
            // Gen VI Remakes (2014)
            'omega-ruby': 6.3, 'alpha-sapphire': 6.4,
            // Gen VII (2016)
            'sun': 7.1, 'moon': 7.2, 
            // Gen VII Enhanced (2017)
            'ultra-sun': 7.3, 'ultra-moon': 7.4,
            // Gen VII Remakes (2018)
            'lets-go-pikachu': 7.5, 'lets-go-eevee': 7.6,
            // Gen VIII (2019)
            'sword': 8.1, 'shield': 8.2,
            // Gen VIII Remakes (2021)
            'brilliant-diamond': 8.3, 'shining-pearl': 8.4,
            // Gen VIII Spinoff (2021)
            'legends-arceus': 8.5,
            // Gen IX (2022)
            'scarlet': 9.1, 'violet': 9.2
        };
        
        // Map of game IDs to proper display names
        const gameDisplayNames = {
            'red': 'Red',
            'blue': 'Blue',
            'yellow': 'Yellow',
            'gold': 'Gold',
            'silver': 'Silver',
            'crystal': 'Crystal',
            'ruby': 'Ruby',
            'sapphire': 'Sapphire',
            'emerald': 'Emerald',
            'fire-red': 'FireRed',
            'firered': 'FireRed',
            'leaf-green': 'LeafGreen',
            'leafgreen': 'LeafGreen',
            'diamond': 'Diamond',
            'pearl': 'Pearl',
            'platinum': 'Platinum',
            'heart-gold': 'HeartGold',
            'heartgold': 'HeartGold',
            'soul-silver': 'SoulSilver',
            'soulssilver': 'SoulSilver',
            'black': 'Black',
            'white': 'White',
            'black-2': 'Black 2',
            'black2': 'Black 2',
            'white-2': 'White 2',
            'white2': 'White 2',
            'x': 'X',
            'y': 'Y',
            'omega-ruby': 'Omega Ruby',
            'omegaruby': 'Omega Ruby',
            'alpha-sapphire': 'Alpha Sapphire',
            'alphasapphire': 'Alpha Sapphire',
            'sun': 'Sun',
            'moon': 'Moon',
            'ultra-sun': 'Ultra Sun',
            'ultrasun': 'Ultra Sun',
            'ultra-moon': 'Ultra Moon',
            'ultramoon': 'Ultra Moon',
            'lets-go-pikachu': "Let's Go Pikachu",
            'letsgopikachu': "Let's Go Pikachu",
            'lets-go-eevee': "Let's Go Eevee",
            'letsgoeevee': "Let's Go Eevee",
            'sword': 'Sword',
            'shield': 'Shield',
            'brilliant-diamond': 'Brilliant Diamond',
            'brilliantdiamond': 'Brilliant Diamond',
            'shining-pearl': 'Shining Pearl',
            'shiningpearl': 'Shining Pearl',
            'legends-arceus': 'Legends: Arceus',
            'legendsarceus': 'Legends: Arceus',
            'scarlet': 'Scarlet',
            'violet': 'Violet'
        };
        
        // Sort and format game names by release order
        const sortedGames = Array.from(games)
            .sort((a, b) => {
                const orderA = gameReleaseOrder[a] ?? 999;
                const orderB = gameReleaseOrder[b] ?? 999;
                return orderA - orderB;
            })
            .map(game => {
                // Try to find display name with both hyphenated and non-hyphenated versions
                const displayName = gameDisplayNames[game] || gameDisplayNames[game.replace(/-/g, '')] || game
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                return displayName;
            });
        
        let html = '<div class="games-section"><strong>Available in Games:</strong><div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">';
        html += sortedGames.map(game => 
            `<span class="game-badge">${game}</span>`
        ).join('');
        html += '</div></div>';
        
        return html;
    } catch (error) {
        console.error('Error fetching games:', error);
        return '';
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
    searchInput.value = '';
    isSearching = false;
    filteredPokemon = [];
    displayPage();
    setupIntersectionObserver();
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

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal on ESC key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
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
            <div style="text-align: center;">
                <h1 style="color: white; font-size: 48px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🔴 Pokédex</h1>
                <div style="
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                "></div>
                <p style="color: white; font-size: 18px; margin-top: 20px;">Loading Pokémon...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
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
