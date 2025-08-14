// Train Tracker App - JavaScript Implementation

// Mock Train Database
const trainDatabase = {
    '12345': {
        name: 'Rajdhani Express',
        route: 'New Delhi - Mumbai Central',
        status: 'Running',
        currentLocation: 'Approaching Kota Junction',
        delay: '+15 min',
        speed: '95 km/h',
        nextStation: 'Kota Junction',
        platform: '3',
        eta: '14:45',
        stations: [
            { name: 'New Delhi', time: '16:55', status: 'departed', delay: 'On Time' },
            { name: 'Gurgaon', time: '17:20', status: 'departed', delay: '+5 min' },
            { name: 'Rewari', time: '18:15', status: 'departed', delay: '+10 min' },
            { name: 'Alwar', time: '19:05', status: 'departed', delay: '+15 min' },
            { name: 'Jaipur', time: '20:30', status: 'departed', delay: '+15 min' },
            { name: 'Ajmer', time: '22:45', status: 'departed', delay: '+15 min' },
            { name: 'Abu Road', time: '01:20', status: 'departed', delay: '+15 min' },
            { name: 'Ahmedabad', time: '03:40', status: 'departed', delay: '+15 min' },
            { name: 'Vadodara', time: '05:15', status: 'departed', delay: '+15 min' },
            { name: 'Surat', time: '06:45', status: 'departed', delay: '+15 min' },
            { name: 'Kota Junction', time: '14:45', status: 'approaching', delay: '+15 min' },
            { name: 'Bhopal', time: '16:20', status: 'scheduled', delay: '--' },
            { name: 'Mumbai Central', time: '08:35', status: 'scheduled', delay: '--' }
        ]
    },
    '12001': {
        name: 'Shatabdi Express',
        route: 'New Delhi - Chandigarh',
        status: 'On Time',
        currentLocation: 'Departed from Ambala Cantt',
        delay: 'On Time',
        speed: '110 km/h',
        nextStation: 'Chandigarh',
        platform: '1',
        eta: '11:45',
        stations: [
            { name: 'New Delhi', time: '07:40', status: 'departed', delay: 'On Time' },
            { name: 'Panipat', time: '08:35', status: 'departed', delay: 'On Time' },
            { name: 'Karnal', time: '09:05', status: 'departed', delay: 'On Time' },
            { name: 'Kurukshetra', time: '09:40', status: 'departed', delay: 'On Time' },
            { name: 'Ambala Cantt', time: '10:25', status: 'departed', delay: 'On Time' },
            { name: 'Chandigarh', time: '11:45', status: 'approaching', delay: 'On Time' }
        ]
    },
    '12002': {
        name: 'Duronto Express',
        route: 'Mumbai - Howrah',
        status: 'Delayed',
        currentLocation: 'Waiting at Nagpur Junction',
        delay: '+45 min',
        speed: '0 km/h',
        nextStation: 'Nagpur Junction',
        platform: '2',
        eta: '16:30',
        stations: [
            { name: 'Mumbai CST', time: '14:05', status: 'departed', delay: 'On Time' },
            { name: 'Thane', time: '14:35', status: 'departed', delay: '+10 min' },
            { name: 'Kalyan', time: '15:05', status: 'departed', delay: '+15 min' },
            { name: 'Nashik', time: '17:20', status: 'departed', delay: '+25 min' },
            { name: 'Manmad', time: '18:45', status: 'departed', delay: '+35 min' },
            { name: 'Bhusawal', time: '21:15', status: 'departed', delay: '+40 min' },
            { name: 'Nagpur Junction', time: '16:30', status: 'waiting', delay: '+45 min' },
            { name: 'Raipur', time: '19:45', status: 'scheduled', delay: '--' },
            { name: 'Bilaspur', time: '21:30', status: 'scheduled', delay: '--' },
            { name: 'Howrah', time: '06:55', status: 'scheduled', delay: '--' }
        ]
    }
};

// PNR Database
const pnrDatabase = {
    '1234567890': {
        trainNumber: '12345',
        trainName: 'Rajdhani Express',
        from: 'New Delhi',
        to: 'Mumbai Central',
        dateOfJourney: '2024-08-15',
        class: 'AC 2 Tier',
        passengers: [
            { name: 'John Doe', age: 35, gender: 'M', berth: 'S1/25/LB', status: 'CNF' },
            { name: 'Jane Doe', age: 32, gender: 'F', berth: 'S1/26/UB', status: 'CNF' }
        ],
        bookingStatus: 'Confirmed',
        coach: 'B1',
        seat: '25-26'
    }
};

// Route Database
const routeDatabase = {
    'delhi-mumbai': [
        { trainNumber: '12345', name: 'Rajdhani Express', departure: '16:55', arrival: '08:35+1', duration: '15h 40m' },
        { trainNumber: '12951', name: 'Mumbai Rajdhani', departure: '17:00', arrival: '08:35+1', duration: '15h 35m' },
        { trainNumber: '12002', name: 'Duronto Express', departure: '14:05', arrival: '06:55+1', duration: '16h 50m' }
    ],
    'delhi-chandigarh': [
        { trainNumber: '12001', name: 'Shatabdi Express', departure: '07:40', arrival: '11:45', duration: '4h 05m' },
        { trainNumber: '12011', name: 'Kalka Shatabdi', departure: '07:40', arrival: '12:10', duration: '4h 30m' }
    ]
};

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const searchForms = document.querySelectorAll('.search-form');
const resultsSection = document.getElementById('resultsSection');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeEventListeners();
    simulateRealTimeUpdates();
});

// Tab Functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(activeTab) {
    // Update tab buttons
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === activeTab) {
            btn.classList.add('active');
        }
    });

    // Update form visibility
    searchForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === activeTab) {
            form.classList.add('active');
        }
    });

    // Hide results when switching tabs
    hideResults();
}

// Event Listeners
function initializeEventListeners() {
    // Enter key support for inputs
    document.getElementById('trainNumberInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchTrain();
    });

    document.getElementById('pnrInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkPNR();
    });

    // Swap button functionality
    const swapBtn = document.querySelector('.swap-btn');
    swapBtn.addEventListener('click', swapStations);

    // Action cards click handlers
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardText = this.querySelector('h4').textContent;
            handleActionCard(cardText);
        });
    });
}

// Search Train Function
function searchTrain() {
    const trainNumber = document.getElementById('trainNumberInput').value.trim();
    
    if (!trainNumber) {
        showError('Please enter a train number');
        return;
    }

    if (!trainDatabase[trainNumber]) {
        showError('Train not found. Please check the train number and try again.');
        return;
    }

    showResults();
    displayTrainInfo(trainDatabase[trainNumber]);
    simulateTrackingAnimation();
}

// Search Route Function
function searchRoute() {
    const fromStation = document.getElementById('fromStation').value.trim().toLowerCase();
    const toStation = document.getElementById('toStation').value.trim().toLowerCase();

    if (!fromStation || !toStation) {
        showError('Please enter both from and to stations');
        return;
    }

    const routeKey = `${fromStation}-${toStation}`;
    const trains = routeDatabase[routeKey];

    if (!trains) {
        showError('No trains found for this route. Please check station names.');
        return;
    }

    displayRouteResults(trains);
}

// Check PNR Function
function checkPNR() {
    const pnrNumber = document.getElementById('pnrInput').value.trim();

    if (!pnrNumber || pnrNumber.length !== 10) {
        showError('Please enter a valid 10-digit PNR number');
        return;
    }

    if (!pnrDatabase[pnrNumber]) {
        showError('PNR not found. Please check the PNR number and try again.');
        return;
    }

    displayPNRResult(pnrDatabase[pnrNumber]);
}

// Display Functions
function displayTrainInfo(train) {
    document.getElementById('trainName').textContent = train.name;
    document.getElementById('trainRoute').textContent = train.route;
    
    // Update status badge color based on status
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = train.status;
    statusBadge.className = 'status-badge';
    
    if (train.status === 'On Time') {
        statusBadge.classList.add('bg-success');
    } else if (train.status === 'Delayed') {
        statusBadge.classList.add('bg-danger');
    } else {
        statusBadge.classList.add('bg-info');
    }

    document.getElementById('currentLocation').textContent = train.currentLocation;
    document.getElementById('delayStatus').textContent = train.delay;
    document.getElementById('currentSpeed').textContent = train.speed;
    document.getElementById('nextStation').textContent = train.nextStation;
    document.getElementById('platform').textContent = train.platform;
    document.getElementById('eta').textContent = train.eta;

    displayRouteProgress(train.stations);
}

function displayRouteProgress(stations) {
    const timeline = document.getElementById('progressTimeline');
    timeline.innerHTML = '';

    stations.forEach((station, index) => {
        const stationElement = document.createElement('div');
        stationElement.className = 'station-item';
        
        let statusClass = '';
        let statusIcon = '';
        
        switch(station.status) {
            case 'departed':
                statusClass = 'text-success';
                statusIcon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'approaching':
                statusClass = 'text-warning';
                statusIcon = '<i class="fas fa-clock"></i>';
                break;
            case 'waiting':
                statusClass = 'text-info';
                statusIcon = '<i class="fas fa-pause-circle"></i>';
                break;
            default:
                statusClass = 'text-muted';
                statusIcon = '<i class="fas fa-circle"></i>';
        }

        stationElement.innerHTML = `
            <div class="station-info ${statusClass}">
                <div class="station-status">
                    ${statusIcon}
                    <strong>${station.name}</strong>
                </div>
                <div class="station-time">
                    <span>Scheduled: ${station.time}</span>
                    <span class="delay ${station.delay === 'On Time' ? 'text-success' : 'text-warning'}">
                        (${station.delay})
                    </span>
                </div>
            </div>
            ${index < stations.length - 1 ? '<div class="timeline-connector"></div>' : ''}
        `;

        timeline.appendChild(stationElement);
    });
}

function displayRouteResults(trains) {
    showResults();
    
    document.getElementById('trainName').textContent = 'Available Trains';
    document.getElementById('trainRoute').textContent = 'Route Search Results';
    document.getElementById('statusBadge').textContent = `${trains.length} trains found`;
    document.getElementById('statusBadge').className = 'status-badge bg-info';

    // Hide individual train info
    const liveStatus = document.querySelector('.live-status');
    const platformInfo = document.querySelector('.platform-info');
    liveStatus.style.display = 'none';
    platformInfo.style.display = 'none';

    // Show route results
    const routeProgress = document.querySelector('.route-progress');
    routeProgress.innerHTML = '<h4>Available Trains</h4>';
    
    const trainsContainer = document.createElement('div');
    trainsContainer.className = 'trains-list';
    
    trains.forEach(train => {
        const trainElement = document.createElement('div');
        trainElement.className = 'train-result-card';
        trainElement.innerHTML = `
            <div class="train-result-info">
                <h5>${train.name} (${train.trainNumber})</h5>
                <div class="train-timing">
                    <span>Departure: ${train.departure}</span>
                    <span>Arrival: ${train.arrival}</span>
                    <span>Duration: ${train.duration}</span>
                </div>
            </div>
            <button class="btn-secondary" onclick="searchSpecificTrain('${train.trainNumber}')">
                Track This Train
            </button>
        `;
        trainsContainer.appendChild(trainElement);
    });
    
    routeProgress.appendChild(trainsContainer);
}

function displayPNRResult(pnrData) {
    showResults();
    
    document.getElementById('trainName').textContent = `${pnrData.trainName} (${pnrData.trainNumber})`;
    document.getElementById('trainRoute').textContent = `${pnrData.from} → ${pnrData.to}`;
    document.getElementById('statusBadge').textContent = pnrData.bookingStatus;
    document.getElementById('statusBadge').className = 'status-badge bg-success';

    // Show PNR specific info
    const liveStatus = document.querySelector('.live-status');
    liveStatus.innerHTML = `
        <div class="pnr-info">
            <h4>Booking Details</h4>
            <div class="pnr-grid">
                <div class="pnr-item">
                    <span>Journey Date:</span>
                    <strong>${pnrData.dateOfJourney}</strong>
                </div>
                <div class="pnr-item">
                    <span>Class:</span>
                    <strong>${pnrData.class}</strong>
                </div>
                <div class="pnr-item">
                    <span>Coach:</span>
                    <strong>${pnrData.coach}</strong>
                </div>
                <div class="pnr-item">
                    <span>Seat:</span>
                    <strong>${pnrData.seat}</strong>
                </div>
            </div>
            
            <h5>Passenger Details</h5>
            <div class="passengers-list">
                ${pnrData.passengers.map(passenger => `
                    <div class="passenger-item">
                        <span>${passenger.name} (${passenger.age}/${passenger.gender})</span>
                        <span class="berth-info">${passenger.berth} - <strong>${passenger.status}</strong></span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Hide route progress for PNR
    document.querySelector('.route-progress').style.display = 'none';
}

// Utility Functions
function showResults() {
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Reset visibility of sections
    document.querySelector('.live-status').style.display = 'grid';
    document.querySelector('.platform-info').style.display = 'block';
    document.querySelector('.route-progress').style.display = 'block';
}

function hideResults() {
    resultsSection.style.display = 'none';
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

function swapStations() {
    const fromInput = document.getElementById('fromStation');
    const toInput = document.getElementById('toStation');
    
    const temp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = temp;
}

function searchSpecificTrain(trainNumber) {
    document.getElementById('trainNumberInput').value = trainNumber;
    switchTab('train-number');
    searchTrain();
}

function handleActionCard(cardText) {
    switch(cardText) {
        case 'Running Status':
            switchTab('train-number');
            break;
        case 'PNR Status':
            switchTab('pnr');
            break;
        case 'Seat Availability':
            alert('Seat availability feature coming soon!');
            break;
        case 'Train Route':
            switchTab('route');
            break;
    }
}

// Real-time Updates Simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        if (resultsSection.style.display === 'block') {
            updateTrainLocation();
        }
    }, 10000); // Update every 10 seconds
}

function updateTrainLocation() {
    const currentLocation = document.getElementById('currentLocation');
    const currentSpeed = document.getElementById('currentSpeed');
    
    if (currentLocation && currentSpeed) {
        // Simulate location updates
        const locations = [
            'Approaching next station',
            'Crossing signal',
            'Entering station premises',
            'Platform arrival in 5 minutes'
        ];
        
        const speeds = ['95 km/h', '85 km/h', '110 km/h', '75 km/h', '0 km/h'];
        
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        
        // Add smooth transition effect
        currentLocation.style.opacity = '0.5';
        currentSpeed.style.opacity = '0.5';
        
        setTimeout(() => {
            currentLocation.textContent = randomLocation;
            currentSpeed.textContent = randomSpeed;
            currentLocation.style.opacity = '1';
            currentSpeed.style.opacity = '1';
        }, 500);
    }
}

function simulateTrackingAnimation() {
    const statusBadge = document.getElementById('statusBadge');
    let dots = 0;
    
    const animationInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        statusBadge.textContent = 'Tracking' + '.'.repeat(dots);
    }, 500);
    
    setTimeout(() => {
        clearInterval(animationInterval);
        statusBadge.textContent = 'Live Tracking';
    }, 3000);
}

// Add CSS for error notifications and additional styles
const additionalStyles = `
    <style>
    .error-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #fee2e2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        max-width: 400px;
        animation: slideIn 0.3s ease;
    }
    
    .error-notification button {
        background: none;
        border: none;
        color: #dc2626;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .trains-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .train-result-card {
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
    }
    
    .train-result-card:hover {
        border-color: #667eea;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
    }
    
    .train-result-info h5 {
        margin-bottom: 0.5rem;
        color: #1e293b;
        font-size: 1.2rem;
    }
    
    .train-timing {
        display: flex;
        gap: 2rem;
        color: #64748b;
        font-size: 0.9rem;
    }
    
    .btn-secondary {
        background: #f1f5f9;
        border: 2px solid #e2e8f0;
        color: #667eea;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
    
    .pnr-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .pnr-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .passengers-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .passenger-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        background: #f8fafc;
        border-radius: 8px;
        border-left: 4px solid #10b981;
    }
    
    .berth-info {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
    }
    
    .station-item {
        margin-bottom: 1rem;
    }
    
    .station-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        border: 2px solid #e2e8f0;
    }
    
    .station-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .station-time {
        text-align: right;
        font-size: 0.9rem;
    }
    
    .station-time span {
        display: block;
        margin-bottom: 0.25rem;
    }
    
    .timeline-connector {
        width: 2px;
        height: 20px;
        background: #e2e8f0;
        margin: 0.5rem auto;
    }
    
    .delay {
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .train-result-card {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
        
        .train-timing {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .station-info {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }
        
        .station-time {
            text-align: center;
        }
    }
    </style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

console.log('Train Tracker App initialized successfully!');