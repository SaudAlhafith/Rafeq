const API_KEY = 'AIzaSyDKC-njsEW2j32V9qt9260SGT7fw9zP1IM';

function translateText(text, targetLanguage, callback) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

    const data = {
        q: text,
        target: targetLanguage,
        source: 'ar'  // Source language set to Arabic, but can be changed
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.translations && data.data.translations.length > 0) {
            callback(data.data.translations[0].translatedText);
        }
    })
    .catch(error => {
        console.error('Error translating text:', error);
    });
}

// Usage:
translateText('مرحبا', 'en', translatedText => {
    console.log(translatedText);  // Outputs: "Hello"
});


function searchYouTube() {
    const searchCode = document.getElementById('searchCode').value;
    const searchCourse = document.getElementById('searchCourse').value;
    const searchLesson = document.getElementById('searchLesson').value;

    var contentType = "playlist"; 
    var searchQuery = "";

    if(searchCourse == ""){
        showWarning("الرجاء إدخال اسم المادة.")
        return;
    }
    if(searchCode == ""){
        showWarning("الرجاء إدخال رمز المادة.")
        return;
    }

    if(searchlesson != ""){
        searchQuery = searchCourse + " " + searchLesson;
        contentType = "video";
    }

    hideWarning()

    fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=${contentType}&part=snippet&maxResults=10&q=${query}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayResults(items, type) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // clear previous results

    items.forEach(item => {
        let id, linkURL;
        
        const title = item.snippet.title;
        const channelTitle = item.snippet.channelTitle;
        const publishTime = item.snippet.publishTime;

        if (type === 'playlist') {
            id = item.id.playlistId;
            linkURL = `https://www.youtube.com/playlist?list=${id}`;
        } else if (type === 'video') {
            id = item.id.videoId;
            linkURL = `https://www.youtube.com/watch?v=${id}`;
        }

        resultsDiv.innerHTML += `
            <div class="card">
                <h3>${title}</h3>
                <p>Channel: ${channelTitle}</p>
                <p>Published: ${publishTime}</p>
                <a href="${linkURL}" target="_blank">View ${type.charAt(0).toUpperCase() + type.slice(1)}</a>
            </div>
        `;
    });
}


function showWarning(message) {
    const warningDiv = document.getElementById('warning');
    warningDiv.textContent = message; // Set the warning message
    warningDiv.style.display = 'block'; // Display the warning
}

function hideWarning() {
    const warningDiv = document.getElementById('warning');
    warningDiv.style.display = 'none'; // Hide the warning
}
