const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');
const searchInput = document.getElementById('searchInput');
const resultContainer = document.getElementById('resultContainer'); // Ensure this ID exists in your HTML
  
function handleSearch() {
    const rawInput = searchInput.value.toLowerCase().trim();
    resultContainer.innerHTML = ''; // Clear the stage for new results

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let matches = [];

            // 1. Keyword mapping for beaches, temples, and countries
            if (rawInput === 'beach' || rawInput === 'beaches') {
                matches = data.beaches;
            } else if (rawInput === 'temple' || rawInput === 'temples') {
                matches = data.temples;
            } else if (rawInput === 'country' || rawInput === 'countries') {
                // Collects two recommendations from the first country available
                matches = data.countries[0].cities; 
            } else {
                // 2. Specific Country Name handling (e.g., "Japan")
                const countryMatch = data.countries.find(c => c.name.toLowerCase() === rawInput);
                if (countryMatch) matches = countryMatch.cities;
            }

            // 3. Render the results
            if (matches.length > 0) {
                displayResults(matches);
            } else {
                resultContainer.innerHTML = '<p class="error">Keyword not found. Please try "beaches", "temples", or a country.</p>';
            }
        })
        .catch(err => console.error("Data retrieval error:", err));
}

/**
 * Updated Display function to include local time.
 */
function displayResults(results) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Clear previous results

    results.forEach(place => {
        // Define formatting options
        const options = { 
            timeZone: place.timeZone, // Dynamically pulled from your JSON
            hour12: true, 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric' 
        };

        // Generate the time string
        const localTime = new Date().toLocaleTimeString('en-US', options);

        const card = document.createElement('div');
        card.classList.add('result-card');
        card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}">
            <div class="card-content">
                <h3>${place.name}</h3>
                <p class="time-display"><strong>Local Time:</strong> ${localTime}</p>
                <p>${place.description}</p>
                <button class="visit-btn">Visit</button>
            </div>
        `;
        resultContainer.appendChild(card);
    });
}

btnSearch.addEventListener('click', handleSearch);

btnReset.addEventListener('click', () => {
    searchInput.value = '';
    resultContainer.innerHTML = '';
});


/**
 * Function to clear search results and reset the input field.
 * This restores the UI to its initial state.
 */
function clearResults() {
    // Clear the text inside the search box
    searchInput.value = '';

    // Remove all dynamically generated cards from the results container
    resultContainer.innerHTML = '';

    // Log the action for debugging purposes
    console.log("Search results and input have been cleared.");
}

// 2. Attach the Event Listener to the Reset Button
btnReset.addEventListener('click', clearResults);


/**
 * Formats the current time for a specific time zone.
 * @param {string} timeZone - The IANA time zone string (e.g., 'America/New_York').
 */
function getLocalTime(timeZone) {
    const options = {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
}














function searchCondition() {
    const input = searchInput.value.toLowerCase();
    resultContainer.innerHTML = ''; // Clear previous results

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log("Data fetched successfully:", data); // Verifies access in console

            // Keyword Logic: Check if input matches categories
            if (input.includes('beach')) {
                displayResults(data.beaches);
            } else if (input.includes('temple')) {
                displayResults(data.temples);
            } else if (input.includes('country') || input.includes('australia') || input.includes('japan') || input.includes('brazil')) {
                // If it's a country, we need to show the cities within it
                const country = data.countries.find(item => item.name.toLowerCase().includes(input));
                if (country) {
                    displayResults(country.cities);
                } else {
                    // Fallback to showing all cities from all countries if "country" is typed
                    const allCities = data.countries.flatMap(c => c.cities);
                    displayResults(allCities);
                }
            } else {
                resultContainer.innerHTML = '<p>No results found. Try "beaches", "temples", or a country name.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayResults(results) {
    results.forEach(place => {
        const div = document.createElement('div');
        div.classList.add('result-card');
        div.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <button class="visit-btn">Visit</button>
        `;
        resultContainer.appendChild(div);
    });
}

function resetSearch() {
    searchInput.value = '';
    resultContainer.innerHTML = '';
    console.log("Search reset cleared.");
}

btnSearch.addEventListener('click', searchCondition);
btnReset.addEventListener('click', resetSearch);