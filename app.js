function sendSOS() {
  if (navigator.geolocation) {
    document.getElementById('sosStatus') && (document.getElementById('sosStatus').textContent = 'Sending SOS...');
    
    navigator.geolocation.getCurrentPosition(
      position => {
        const data = {
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
          time: new Date().toLocaleTimeString()
        };
        
        // Create a shareable message
        const message = `📍 SOS Alert!\nLatitude: ${data.latitude}\nLongitude: ${data.longitude}\nTime: ${data.time}`;
        
        // For mobile, provide option to share
        if (navigator.share) {
          navigator.share({
            title: 'SOS Emergency Alert',
            text: message,
            url: `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
          }).then(() => {
            if (document.getElementById('sosStatus')) {
              document.getElementById('sosStatus').textContent = 'SOS shared successfully!';
            } else {
              alert('SOS shared successfully!');
            }
          }).catch(error => {
            alert(`📍 SOS Alert!\nLatitude: ${data.latitude}\nLongitude: ${data.longitude}\nTime: ${data.time}`);
          });
        } else {
          // Fallback for browsers without Web Share API
          alert(`📍 SOS Alert!\nLatitude: ${data.latitude}\nLongitude: ${data.longitude}\nTime: ${data.time}`);
        }
      },
      error => {
        if (document.getElementById('sosStatus')) {
          document.getElementById('sosStatus').textContent = 'Error retrieving location.';
        } else {
          alert("Unable to retrieve your location. Please try again.");
        }
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function startFakeCall() {
  // Show call screen
  const callScreen = document.getElementById("callScreen");
  if (callScreen) {
    // Update status bar time
    updateStatusBarTime();
    
    // Show calling status
    callScreen.querySelector('h2').textContent = "Incoming Call";
    callScreen.querySelector('p').textContent = "Mom";
    
    // Set the call timer text
    document.getElementById('callTimer').textContent = "Calling...";
    
    // Update carrier name based on time (just to randomize a bit)
    const carriers = ["Verizon", "AT&T", "T-Mobile", "Sprint", "Carrier"];
    const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
    document.querySelector('.call-carrier').textContent = randomCarrier;
    
    // Make sure display style is set properly to flex
    callScreen.style.display = "flex";
    
    // Apply additional styles to ensure full coverage
    document.body.style.overflow = "hidden"; // Prevent background scrolling
    
    // Hide the call controls initially (shown after "answering")
    const callControls = document.querySelector('.call-controls');
    if (callControls) {
      callControls.style.display = 'none';
    }
    
    // Setup animation for the call buttons (simulate ringing)
    const acceptBtn = document.querySelector('.accept-btn');
    if (acceptBtn) {
      acceptBtn.classList.add('ringing');
    }
    
    // Vibrate for mobile devices if supported
    if (navigator.vibrate) {
      // Vibrate pattern for incoming call (vibrate-pause-vibrate)
      let vibrateInterval = setInterval(function() {
        navigator.vibrate([400, 200, 400]);
      }, 1200);
      
      // Store the interval ID to clear it later
      callScreen.setAttribute('data-vibrate-interval', vibrateInterval);
    }
    
    // Play ringtone if possible
    tryPlayRingtone();
    
    // Add event listener for the accept button to change mode
    const acceptButton = callScreen.querySelector('.accept-btn');
    if (acceptButton) {
      acceptButton.onclick = function() {
        acceptCall();
      };
    }
  }
}

function acceptCall() {
  // Stop ringtone
  stopRingtone();
  
  // Stop vibration
  if (navigator.vibrate) {
    navigator.vibrate(0);
    
    // Clear the vibrate interval
    const callScreen = document.getElementById("callScreen");
    const vibrateInterval = callScreen.getAttribute('data-vibrate-interval');
    if (vibrateInterval) {
      clearInterval(parseInt(vibrateInterval));
    }
  }
  
  // Change UI to "on call" mode
  document.querySelector('h2').textContent = "On Call";
  
  // Show call controls
  const callControls = document.querySelector('.call-controls');
  if (callControls) {
    callControls.style.display = 'grid';
  }
  
  // Start call timer
  startCallTimer();
  
  // Change the accept button to act like end call
  const acceptButton = document.querySelector('.accept-btn');
  if (acceptButton) {
    acceptButton.onclick = function() {
      endFakeCall();
    };
  }
  
  // Hide the decline button
  const declineButton = document.querySelector('.decline-btn');
  if (declineButton) {
    declineButton.style.display = 'none';
  }
}

function endFakeCall() {
  const callScreen = document.getElementById("callScreen");
  if (callScreen) {
    // Hide call screen
    callScreen.style.display = "none";
    
    // Restore body overflow
    document.body.style.overflow = "";
    
    // Stop call timer
    stopCallTimer();
    
    // Reset the call controls display
    const callControls = document.querySelector('.call-controls');
    if (callControls) {
      callControls.style.display = 'none';
    }
    
    // Reset the decline button
    const declineButton = document.querySelector('.decline-btn');
    if (declineButton) {
      declineButton.style.display = 'flex';
    }
    
    // Reset the accept button to original function
    const acceptButton = document.querySelector('.accept-btn');
    if (acceptButton) {
      acceptButton.onclick = function() {
        acceptCall();
      };
    }
    
    // Stop vibration
    if (navigator.vibrate) {
      navigator.vibrate(0); // Stop vibration
      
      // Clear the vibrate interval
      const vibrateInterval = callScreen.getAttribute('data-vibrate-interval');
      if (vibrateInterval) {
        clearInterval(parseInt(vibrateInterval));
      }
    }
    
    // Stop ringtone if playing
    stopRingtone();
  }
}

// Call timer functionality
let callDuration = 0;
let callTimerInterval;

function startCallTimer() {
  const timerElement = document.getElementById('callTimer');
  if (timerElement) {
    callDuration = 0;
    updateCallTimerDisplay();
    callTimerInterval = setInterval(function() {
      callDuration++;
      updateCallTimerDisplay();
    }, 1000);
  }
}

function stopCallTimer() {
  if (callTimerInterval) {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
    callDuration = 0;
  }
}

function updateCallTimerDisplay() {
  const timerElement = document.getElementById('callTimer');
  if (timerElement) {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Detect if device is mobile
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add touch feedback for buttons on mobile
  if (isMobileDevice()) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      });
      
      button.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }
});

// Update status bar time to current time
function updateStatusBarTime() {
  const timeElement = document.getElementById("statusTime");
  if (timeElement) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
  }
}

// Try to play a ringtone sound if possible
function tryPlayRingtone() {
  // Check if ringtone already exists
  let audio = document.getElementById('ringtone');
  
  if (!audio) {
    // Create new audio element
    audio = document.createElement('audio');
    audio.id = 'ringtone';
    audio.loop = true;
    
    // Default ringtone URL - ideally this would be a local file in your project
    audio.src = 'https://www.soundjay.com/phone/sounds/cell-phone-ring-1.mp3';
    
    document.body.appendChild(audio);
  }
  
  // Try to play (may be blocked by browsers without user interaction)
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log('Auto-play was prevented. Ringtone needs user interaction first.');
    });
  }
}

// Stop the ringtone
function stopRingtone() {
  const audio = document.getElementById('ringtone');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}
