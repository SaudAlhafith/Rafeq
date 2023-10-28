
const API_KEY = 'AIzaSyDKC-njsEW2j32V9qt9260SGT7fw9zP1IM';


var label = document.getElementById('language-label');

function isArabic(text) {
    var arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
}

function clearResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // clear previous results
}

function translateText(text, targetLanguage, callback) {
    // Check if translation exists in the courseTranslations dictionary
    let translatedText = courseTranslations[text];

    if (!translatedText) {
        showWarning("الرجاء إدخال اسم مادة صحيح.");
        return;
    }

    // If translation exists, and target language is English, use the provided translation
    if (translatedText && targetLanguage === 'en') {
        callback(translatedText);
        return;
    } 

    // If translation doesn't exist, or target language is Arabic, return the original text
    if (!translatedText || targetLanguage === 'ar') {
        callback(text);
        return;
    }
}


function toggleLanguage() {
    if (label.textContent === 'Eng') {
        label.textContent = 'عربي';
    } else {
        label.textContent = 'Eng';
    }
}



function searchYouTube() {
    const searchCode = document.getElementById('searchCode').value;
    let searchCourse = document.getElementById('searchCourse').value;
    let searchLesson = document.getElementById('searchLesson').value;

    var contentType = "playlist";
    var searchQuery = "";

    if (searchCode == "") {
        showWarning("الرجاء إدخال رمز المادة.");
        clearResults()
        return;
    }
    if (searchCourse == "") {
        showWarning("الرجاء إدخال اسم المادة.");
        clearResults()
        return;
    }

    if (searchLesson != "") {
        if (isArabic(searchLesson) && label.textContent === 'Eng') {
            showWarning("الرجاء إدخال اسم الدرس باللغة الإنجليزية.");
            clearResults()
            return;
        } else if (!isArabic(searchLesson) && label.textContent === 'عربي') {
            showWarning("الرجاء إدخال اسم الدرس باللغة العربية.");
            clearResults()
            return;
        }
        contentType = "video";
    }

    hideWarning()

    // Handle translation for course and lesson separately
    translateIfNeeded(searchCourse, translatedCourse => {
        if (searchLesson) {
            translateIfNeeded(searchLesson, translatedLesson => {
                searchQuery = translatedCourse + " " + translatedLesson;
                executeSearch(searchQuery, contentType);
            });
        } else {
            searchQuery = translatedCourse;
            executeSearch(searchQuery, contentType);
        }
    });
}

function translateIfNeeded(text, callback) {
    if ((label.textContent === 'Eng' && isArabic(text)) || (label.textContent === 'عربي' && !isArabic(text))) {
        const targetLanguage = label.textContent === 'Eng' ? 'en' : 'ar';
        translateText(text, targetLanguage, translatedText => {
            callback(translatedText);
        });
    } else {
        callback(text);
    }
}

function executeSearch(query, contentType) {
    // This is where you execute your search using the query
    // alert("Searching with query: " + query);
    fetchYouTubeData(query, contentType);
}


function fetchYouTubeData(query, contentType) {
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=${contentType}&part=snippet&maxResults=10&q=${query}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items, contentType);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = date.toLocaleString('default', { day: '2-digit' })
    const month = date.toLocaleString('default', { month: '2-digit' }).toLowerCase();
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


function displayResults(items, type) {
    
    const resultsDiv = document.getElementById('results');
    clearResults()

    items.forEach(item => {
        let id, linkURL, thumbnailURL;

        const title = item.snippet.title;
        const channelTitle = item.snippet.channelTitle;
        const publishTime = formatDate(item.snippet.publishTime);
        thumbnailURL = item.snippet.thumbnails.medium.url;

        if (type === 'playlist') {
            id = item.id.playlistId;
            linkURL = `https://www.youtube.com/playlist?list=${id}`;
        } else if (type === 'video') {
            id = item.id.videoId;
            linkURL = `https://www.youtube.com/watch?v=${id}`;
        }

        resultsDiv.innerHTML += `
            <div class="card">
                <img src="${thumbnailURL}" alt="${title} thumbnail" class="thumbnail">
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
    warningDiv.innerHTML = `
        ${message}
        <i class="material-icons">warning</i> 
    `; // Set the warning message
    warningDiv.style.display = 'block'; // Display the warning
}

function hideWarning() {
    const warningDiv = document.getElementById('warning');
    warningDiv.style.display = 'none'; // Hide the warning
}
