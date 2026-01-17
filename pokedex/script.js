const ITEMS_PER_PAGE = 20;
let currentPage = 0;
let allPokemon = [];
let filteredPokemon = [];
let isSearching = false;

const pokemonContainer = document.getElementById('pokemonContainer');
const loadingContainer = document.getElementById('loadingContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const modal = document.getElementById('pokemonModal');
const closeBtn = document.querySelector('.close');
const errorContainer = document.getElementById('errorContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// Initialize the app
async function init() {
    await loadPokemonList();
    displayPage();
}

// Load the list of all Pokemon
async function loadPokemonList() {
    try {
        showLoading();
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        allPokemon = data.results;
        hideLoading();
    } catch (error) {
        showError('Failed to load Pokemon list');
        hideLoading();
    }
}

// Display current page of Pokemon
function displayPage() {
    const startIdx = currentPage * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const pagePokemon = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;
    const pokemontodisplay = pagePokemon.slice(startIdx, endIdx);

    pokemonContainer.innerHTML = '';

    pokemontodisplay.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        pokemonContainer.appendChild(card);
    });

    updatePaginationButtons(pagePokemon.length);
}

// Create a Pokemon card element
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    // Extract Pokemon ID from URL
    const id = pokemon.url.split('/').filter(Boolean).pop();

    card.innerHTML = `
        <div class="pokemon-id">#${id.padStart(3, '0')}</div>
        <img class="pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${pokemon.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png'">
        <div class="pokemon-name">${pokemon.name}</div>
    `;

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
        const modalEffectiveness = document.getElementById('modalEffectiveness');

        modalImage.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
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

        // Fetch and display type effectiveness
        const typeEffectiveness = await getTypeEffectiveness(data.types);
        modalEffectiveness.innerHTML = typeEffectiveness;

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error in showPokemonDetails:', error);
        showError('Failed to load Pokemon details');
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
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        isSearching = false;
        filteredPokemon = [];
        currentPage = 0;
        displayPage();
        return;
    }

    isSearching = true;
    filteredPokemon = allPokemon.filter(pokemon => {
        const id = pokemon.url.split('/').filter(Boolean).pop();
        return pokemon.name.toLowerCase().includes(query) || id.includes(query);
    });

    currentPage = 0;
    displayPage();
}

// Pagination
function updatePaginationButtons(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages - 1;
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        displayPage();
        window.scrollTo(0, 0);
    }
});

nextBtn.addEventListener('click', () => {
    const pagePokemon = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;
    const totalPages = Math.ceil(pagePokemon.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages - 1) {
        currentPage++;
        displayPage();
        window.scrollTo(0, 0);
    }
});

// Search event listeners
searchBtn.addEventListener('click', handleSearch);
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    isSearching = false;
    filteredPokemon = [];
    currentPage = 0;
    displayPage();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Modal event listeners
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal on ESC key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modal.style.display = 'none';
    }
});

// Utility functions
function showLoading() {
    loadingContainer.style.display = 'block';
}

function hideLoading() {
    loadingContainer.style.display = 'none';
}

function showError(message) {
    errorContainer.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => {
        errorContainer.innerHTML = '';
    }, 5000);
}

// Start the app
init();
