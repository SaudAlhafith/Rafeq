const API_KEY = 'AIzaSyDKC-njsEW2j32V9qt9260SGT7fw9zP1IM';

function searchYouTube() {
    const query = document.getElementById('searchQuery').value;

    fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=playlist&part=snippet&maxResults=10&q=${query}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayResults(items) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // clear previous results

    items.forEach(item => {
        const playlistId = item.id.playlistId;
        const title = item.snippet.title;
        const channelTitle = item.snippet.channelTitle;
        const publishTime = item.snippet.publishTime;

        resultsDiv.innerHTML += `
            <div class="card">
                <h3>${title}</h3>
                <p>Channel: ${channelTitle}</p>
                <p>Published: ${publishTime}</p>
                <a href="https://www.youtube.com/playlist?list=${playlistId}" target="_blank">View Playlist</a>
            </div>
        `;
    });
}

