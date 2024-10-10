const content = document.querySelector(".content"),
    Playimage = content.querySelector(".music-image img"),
    musicName = content.querySelector(".music-titles .name"),
    musicArtist = content.querySelector(".music-titles .artist"),
    Audio = document.querySelector(".main-song"),
    playBtn = content.querySelector(".play-pause"),
    playBtnIcon = content.querySelector(".play-pause span"),
    prevBtn = content.querySelector("#prev"),
    nextBtn = content.querySelector("#next"),
    progressBar = content.querySelector(".progress-bar"),
    progressDetails = content.querySelector(".progress-details"),
    repeatBtn = content.querySelector("#repeat"),
    Shuffle = content.querySelector("#shuffle"),
    volumeSlider = document.getElementById('volume-slider'),
    muteButton = document.getElementById('mute'),
    form = document.getElementById('toForm'),
    modal = document.getElementById('id01'),
    overlay = document.getElementById('overlay'); // Ensure there's an overlay element

let index = 1;

window.addEventListener("load", () => {
    loadData(index);
    Audio.play();
    displayTrackList();
});

function loadData(indexValue) {
    musicName.innerHTML = songs[indexValue - 1].name;
    musicArtist.innerHTML = songs[indexValue - 1].artist;
    Playimage.src = "images/" + songs[indexValue - 1].img + ".jpg";
    Audio.src = "music/" + songs[indexValue - 1].audio + ".mp3";
}

playBtn.addEventListener("click", () => {
    const isMusicPaused = content.classList.contains("paused");
    if (isMusicPaused) {
        pauseSong();
    } else {
        playSong();
    }
});

function playSong() {
    content.classList.add("paused");
    playBtnIcon.innerHTML = "pause";
    Audio.play();
}

function pauseSong() {
    content.classList.remove("paused");
    playBtnIcon.innerHTML = "play_arrow";
    Audio.pause();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

function nextSong() {
    index++;
    if (index > songs.length) {
        index = 1;
    }
    loadData(index);
    playSong();
}

function prevSong() {
    index--;
    if (index <= 0) {
        index = songs.length;
    }
    loadData(index);
    playSong();
}

Audio.addEventListener("timeupdate", (e)=>{
    const initialTime = e.target.currentTime;
    const finalTime = e.target.duration;
    let BarWidth = (initialTime / finalTime) * 100;
    progressBar.style.width = BarWidth+"%";

    progressDetails.addEventListener("click", (e)=>{
        let progressValue = progressDetails.clientWidth;
        let clickedOffsetX = e.offsetX;
        let MusicDuration = Audio.duration;

        Audio.currentTime = (clickedOffsetX / progressValue) * MusicDuration;
    });

    //timer-logic
    Audio.addEventListener("loadeddata", ()=>{
        let finalTimeData = content.querySelector(".final");

        //update-finalDuration
        let AudioDuration = Audio.duration;
        let finalMinutes = Math.floor(AudioDuration / 60);
        let finalSeconds = Math.floor(AudioDuration % 60);
        if(finalSeconds < 10){
            finalSeconds = "0"+finalSeconds;
        }
        finalTimeData.innerText = finalMinutes+":"+finalSeconds;
    });

    //update current duration
    let currentTimeData = content.querySelector(".current");
    let CurrentTime = Audio.currentTime;
    let currentMinutes = Math.floor(CurrentTime / 60);
    let currentSeconds = Math.floor(CurrentTime % 60);
    if(currentSeconds < 10){
    currentSeconds = "0"+currentSeconds;
    }
    currentTimeData.innerText = currentMinutes+":"+currentSeconds

    //repeat button logic
    repeatBtn.addEventListener("click", ()=>{
        Audio.currentTime = 0;
    });
});

Shuffle.addEventListener("click", () => {
    let randIndex = Math.floor(Math.random() * songs.length) + 1;
    loadData(randIndex);
    playSong();
});

Audio.addEventListener("ended", () => {
    index++;
    if (index > songs.length) {
        index = 1;
    }
    loadData(index);
    playSong();
});

function displayTrackList() {
    const trackListContainer = document.getElementById("track-list-container");
    trackListContainer.innerHTML = "";

    songs.forEach((song, idx) => {
        const listItem = document.createElement("li");

        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("image-wrapper");

        const image = document.createElement("img");
        image.src = `images/${song.img}.jpg`;
        image.title = song.name;
        image.classList.add("song-image");

        imageWrapper.appendChild(image);
        listItem.appendChild(imageWrapper);

        const songInfo = document.createElement("div");
        songInfo.classList.add("song-info");

        const songTitle = document.createElement("p");
        songTitle.textContent = song.name;
        songTitle.classList.add("song-title");

        const songArtist = document.createElement("p");
        songArtist.textContent = song.artist;
        songArtist.classList.add("song-artist");

        const songDuration = document.createElement("p");
        songDuration.textContent = formatTime(song.duration);
        songDuration.classList.add("song-duration");
        songInfo.appendChild(songTitle);
        songInfo.appendChild(songArtist);
        songInfo.appendChild(songDuration);

        listItem.appendChild(songInfo);

        listItem.addEventListener("click", () => {
            index = idx + 1;
            loadData(index);
            playSong();
        });

        trackListContainer.appendChild(listItem);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function toggleMute() {
    if (Audio.muted) {
        Audio.muted = false;
        muteButton.innerHTML = 'volume_off';  
        volumeSlider.value = Audio.volume;   
    } else {
        Audio.muted = true;
        muteButton.innerHTML = 'volume_mute';  
        volumeSlider.value = 0;   
    }
}

volumeSlider.addEventListener('input', function() {
    Audio.volume = volumeSlider.value;
    if (volumeSlider.value == '0') {
        muteButton.innerHTML = 'volume_up';
    } else {
        muteButton.innerHTML = 'volume_off';
    }
});

function openModal() {
    modal.style.display = 'block';
    overlay.style.display = 'block'; 
    setTimeout(() => {
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        document.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

function closeModal() {
    modal.style.backgroundColor = 'rgba(0,0,0,0)'; 
    document.querySelector('.modal-content').style.opacity = '0'; 
    
    setTimeout(() => {
        modal.style.display = 'none'; 
        overlay.style.display = 'none'; 
        form.style.display = 'none';
    }, 300); 
}

function closeModalOnly() {
    modal.style.display = 'none';  
    overlay.style.display = 'block'; 
    form.style.display = 'block'; 
}


document.getElementById('logIn').addEventListener('click', openModal);

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    handleLoginSuccess(); 
});

function handleLoginSuccess() {
    
    document.getElementById('toForm').style.display = 'none';
    document.querySelector('.content').classList.remove('hidden');
    closeModal(); 
}

function showSignUp() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('sign-up-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('sign-up-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function signUp() {
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    
    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        alert('Sign Up successful! You can now log in.');
        showLogin();
    } else {
        alert('Please fill in all the fields.');
    }
}

function login() {
    const userInput = document.getElementById('login-username-email').value;
    const password = document.getElementById('login-password').value;
    
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    
    if ((userInput === storedUsername || userInput === storedEmail) && password === storedPassword) {
        alert('Login successful!');
        closeModal();
    } else {
        alert('Invalid credentials.');
    }
}

document.getElementById('logoutBtn').addEventListener('click', function() {

    alert("You have been logged out!");
    
    location.reload();
});