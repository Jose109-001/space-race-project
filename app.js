// ================================================
// SPACE RACE DATA ANALYSIS - JAVASCRIPT (CSV Version)
// ================================================

// Global variables
let processedData = [];

// ================================================
// CSV DATA LOADING
// ================================================

async function loadCSVData() {
    const progressEl = document.getElementById('fetch-progress');
    progressEl.textContent = 'Loading CSV data...';
    
    try {
        const response = await fetch('mission_launches.csv');
        
        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.status}`);
        }
        
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        progressEl.textContent = `Loaded ${data.length} missions from CSV`;
        console.log(`CSV data loaded: ${data.length} records`);
        
        return data;
        
    } catch (error) {
        console.error('Error loading CSV:', error);
        progressEl.textContent = 'Error loading CSV file. Please check console.';
        throw error;
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        
        headers.forEach((header, index) => {
            row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        
        data.push(row);
    }
    
    return data;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current);
    return values;
}

// ================================================
// DATA PROCESSING
// ================================================

function processData(rawData) {
    const processed = [];
    
    rawData.forEach(row => {
        try {
            // Parse date
            const dateStr = row.Date || row.date;
            const date = dateStr ? new Date(dateStr) : null;
            
            if (!date || isNaN(date.getTime())) {
                return; // Skip invalid dates
            }
            
            // Extract country from location (last part after comma)
            const location = row.Location || row.location_name || '';
            const locationParts = location.split(',');
            const country = locationParts[locationParts.length - 1].trim();
            
            // Extract rocket family (first part before |)
            const rocketDetail = row.Detail || row.rocket || '';
            const rocketParts = rocketDetail.split('|');
            const rocketFamily = rocketParts[0].trim();
            
            const record = {
                id: row['Unnamed: 0'] || row.id,
                name: rocketDetail,
                date: date,
                status: row.Mission_Status || row.status || 'Unknown',
                country: country,
                countryFull: country,
                locationName: location,
                agency: row.Organisation || row.agency || 'Unknown',
                rocket: rocketDetail,
                rocketFamily: rocketFamily,
                missionType: null,
                missionOrbit: null
            };
            
            record.year = record.date.getFullYear();
            record.month = record.date.getMonth();
            record.monthName = record.date.toLocaleString('default', { month: 'long' });
            record.decade = Math.floor(record.year / 10) * 10;
            record.dayOfWeek = record.date.toLocaleString('default', { weekday: 'long' });
            
            // Determine success
            const successKeywords = ['Success', 'Partial Failure'];
            record.success = successKeywords.includes(record.status);
            
            processed.push(record);
            
        } catch (error) {
            // Skip problematic records
        }
    });
    
    return processed;
}

// ================================================
// DATA ANALYSIS FUNCTIONS
// ================================================

function countBy(data, field) {
    const counts = {};
    data.forEach(item => {
        const value = item[field] || 'Unknown';
        counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
}

function getTopN(counts, n = 15) {
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n);
}

function groupByMultiple(data, fields) {
    const groups = {};
    data.forEach(item => {
        const key = fields.map(f => item[f]).join('|');
        groups[key] = (groups[key] || 0) + 1;
    });
    return groups;
}

// ================================================
// CHART CREATION
// ================================================

function createBarChart(canvasId, labels, data, title, color = '#64ffda') {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: title,
                    color: '#64ffda',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8892b0' },
                    grid: { color: 'rgba(136, 146, 176, 0.1)' }
                },
                y: {
                    ticks: { color: '#8892b0' },
                    grid: { color: 'rgba(136, 146, 176, 0.1)' }
                }
            }
        }
    });
}

function createLineChart(canvasId, labels, datasets, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: datasets.length > 1,
                    labels: { color: '#8892b0' }
                },
                title: {
                    display: true,
                    text: title,
                    color: '#64ffda',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8892b0' },
                    grid: { color: 'rgba(136, 146, 176, 0.1)' }
                },
                y: {
                    ticks: { color: '#8892b0' },
                    grid: { color: 'rgba(136, 146, 176, 0.1)' }
                }
            }
        }
    });
}

function createPieChart(canvasId, labels, data, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#64ffda', '#4dd6b3', '#36b08c', '#1f8a66',
                    '#ff6b6b', '#ffa726', '#66bb6a', '#42a5f5',
                    '#ab47bc', '#ec407a', '#26c6da', '#9ccc65'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#8892b0' }
                },
                title: {
                    display: true,
                    text: title,
                    color: '#64ffda',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
}

// ================================================
// VISUALIZATION FUNCTIONS
// ================================================

function createCountryChart() {
    const counts = countBy(processedData, 'countryFull');
    const top = getTopN(counts, 15);
    const labels = top.map(item => item[0]);
    const data = top.map(item => item[1]);
    
    createBarChart('countryChart', labels, data, 'Missions by Country', '#64ffda');
}

function createOrganizationChart() {
    const counts = countBy(processedData, 'agency');
    const top = getTopN(counts, 15);
    const labels = top.map(item => item[0]);
    const data = top.map(item => item[1]);
    
    createBarChart('organizationChart', labels, data, 'Missions by Organization', '#ff6b6b');
}

function createTemporalChart() {
    const yearCounts = countBy(processedData, 'year');
    const years = Object.keys(yearCounts).sort();
    const counts = years.map(year => yearCounts[year]);
    
    createLineChart('temporalChart', years, [{
        label: 'Launches',
        data: counts,
        borderColor: '#64ffda',
        backgroundColor: 'rgba(100, 255, 218, 0.1)',
        fill: true,
        tension: 0.4
    }], 'Space Missions Over Time');
}

function createSpaceRaceChart() {
    const majorPowers = ['United States', 'Russia', 'China'];
    const yearlyData = {};
    
    processedData.forEach(item => {
        if (majorPowers.includes(item.countryFull)) {
            const key = `${item.year}|${item.countryFull}`;
            yearlyData[key] = (yearlyData[key] || 0) + 1;
        }
    });
    
    const years = [...new Set(processedData.map(d => d.year))].sort();
    const datasets = majorPowers.map((country, idx) => {
        const colors = ['#64ffda', '#ff6b6b', '#ffa726'];
        return {
            label: country,
            data: years.map(year => yearlyData[`${year}|${country}`] || 0),
            borderColor: colors[idx],
            backgroundColor: colors[idx] + '33',
            tension: 0.4
        };
    });
    
    createLineChart('spaceRaceChart', years, datasets, 'USA vs Russia vs China');
}

function createMonthChart() {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const counts = countBy(processedData, 'monthName');
    const data = monthOrder.map(month => counts[month] || 0);
    
    const ctx = document.getElementById('monthChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthOrder,
            datasets: [{
                label: 'Launches',
                data: data,
                backgroundColor: '#66bb6a',
                borderColor: '#4caf50',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: '#8892b0' }, grid: { color: 'rgba(136, 146, 176, 0.1)' } },
                y: { ticks: { color: '#8892b0' }, grid: { color: 'rgba(136, 146, 176, 0.1)' } }
            }
        }
    });
}

function createDayChart() {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const counts = countBy(processedData, 'dayOfWeek');
    const data = dayOrder.map(day => counts[day] || 0);
    
    createPieChart('dayChart', dayOrder, data, 'Launches by Day of Week');
}

function createDecadeSuccessChart() {
    const decadeSuccess = {};
    const decadeTotal = {};
    
    processedData.forEach(item => {
        decadeTotal[item.decade] = (decadeTotal[item.decade] || 0) + 1;
        if (item.success) {
            decadeSuccess[item.decade] = (decadeSuccess[item.decade] || 0) + 1;
        }
    });
    
    const decades = Object.keys(decadeTotal).sort();
    const successRates = decades.map(d => 
        ((decadeSuccess[d] || 0) / decadeTotal[d] * 100).toFixed(1)
    );
    
    const ctx = document.getElementById('decadeSuccessChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: decades.map(d => `${d}s`),
            datasets: [{
                label: 'Success Rate (%)',
                data: successRates,
                backgroundColor: successRates.map(rate => 
                    rate >= 90 ? '#4caf50' : rate >= 80 ? '#66bb6a' : '#ffa726'
                ),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: '#8892b0' }, grid: { color: 'rgba(136, 146, 176, 0.1)' } },
                y: { 
                    min: 0,
                    max: 100,
                    ticks: { color: '#8892b0' },
                    grid: { color: 'rgba(136, 146, 176, 0.1)' }
                }
            }
        }
    });
}

function createStatusChart() {
    const counts = countBy(processedData, 'status');
    const top = getTopN(counts, 8);
    const labels = top.map(item => item[0]);
    const data = top.map(item => item[1]);
    
    createPieChart('statusChart', labels, data, 'Mission Status');
}

function createSuccessTrendChart() {
    const yearSuccess = {};
    const yearTotal = {};
    
    processedData.forEach(item => {
        yearTotal[item.year] = (yearTotal[item.year] || 0) + 1;
        if (item.success) {
            yearSuccess[item.year] = (yearSuccess[item.year] || 0) + 1;
        }
    });
    
    const years = Object.keys(yearTotal).sort();
    const successRates = years.map(y => 
        ((yearSuccess[y] || 0) / yearTotal[y] * 100).toFixed(1)
    );
    
    // Calculate 5-year moving average
    const movingAvg = [];
    for (let i = 0; i < successRates.length; i++) {
        const start = Math.max(0, i - 2);
        const end = Math.min(successRates.length, i + 3);
        const window = successRates.slice(start, end);
        const avg = window.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / window.length;
        movingAvg.push(avg.toFixed(1));
    }
    
    createLineChart('successTrendChart', years, [
        {
            label: 'Yearly Success Rate',
            data: successRates,
            borderColor: '#8892b099',
            backgroundColor: 'transparent',
            borderWidth: 1
        },
        {
            label: '5-Year Moving Average',
            data: movingAvg,
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 3,
            tension: 0.4
        }
    ], 'Mission Success Rate Trend');
}

function createRocketChart() {
    const counts = countBy(processedData, 'rocket');
    const top = getTopN(counts, 15);
    const labels = top.map(item => item[0]);
    const data = top.map(item => item[1]);
    
    createBarChart('rocketChart', labels, data, 'Most Used Rockets', '#ab47bc');
}

function createRocketFamilyChart() {
    const counts = countBy(processedData, 'rocketFamily');
    const top = getTopN(counts, 12);
    const labels = top.map(item => item[0]);
    const data = top.map(item => item[1]);
    
    createBarChart('rocketFamilyChart', labels, data, 'Top Rocket Families', '#ec407a');
}

function createMissionTypeChart() {
    const counts = countBy(processedData, 'missionType');
    const top = getTopN(counts, 10);
    const labels = top.map(item => item[0]);
    const data = top.map(item => item[1]);
    
    const ctx = document.getElementById('missionTypeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Missions',
                data: data,
                backgroundColor: '#ffa726',
                borderColor: '#ff9800',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: '#8892b0' }, grid: { color: 'rgba(136, 146, 176, 0.1)' } },
                y: { ticks: { color: '#8892b0' }, grid: { color: 'rgba(136, 146, 176, 0.1)' } }
            }
        }
    });
}

// ================================================
// UPDATE STATISTICS
// ================================================

function updateStatistics() {
    const totalMissions = processedData.length;
    const years = processedData.map(d => d.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const countries = new Set(processedData.map(d => d.countryFull)).size;
    const successfulMissions = processedData.filter(d => d.success).length;
    const successRate = ((successfulMissions / totalMissions) * 100).toFixed(1);
    
    document.getElementById('total-missions').textContent = totalMissions.toLocaleString();
    document.getElementById('time-period').textContent = `${minYear} - ${maxYear}`;
    document.getElementById('countries').textContent = countries;
    document.getElementById('success-rate').textContent = `${successRate}%`;
}

// ================================================
// GENERATE INSIGHTS
// ================================================

function generateInsights() {
    const totalMissions = processedData.length;
    const years = processedData.map(d => d.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    const countryCounts = countBy(processedData, 'countryFull');
    const topCountry = getTopN(countryCounts, 1)[0];
    
    const agencyCounts = countBy(processedData, 'agency');
    const topAgency = getTopN(agencyCounts, 1)[0];
    
    const rocketCounts = countBy(processedData, 'rocket');
    const topRocket = getTopN(rocketCounts, 1)[0];
    
    const successfulMissions = processedData.filter(d => d.success).length;
    const successRate = ((successfulMissions / totalMissions) * 100).toFixed(2);
    
    const yearCounts = countBy(processedData, 'year');
    const peakYear = getTopN(yearCounts, 1)[0];
    
    const monthCounts = countBy(processedData, 'monthName');
    const topMonth = getTopN(monthCounts, 1)[0];
    
    const dayCounts = countBy(processedData, 'dayOfWeek');
    const topDay = getTopN(dayCounts, 1)[0];
    
    const insightsHTML = `
        <h3>📊 Dataset Overview</h3>
        <ul>
            <li><strong>Total Missions Analyzed:</strong> ${totalMissions.toLocaleString()}</li>
            <li><strong>Time Period:</strong> ${minYear} - ${maxYear}</li>
            <li><strong>Countries Represented:</strong> ${new Set(processedData.map(d => d.countryFull)).size}</li>
            <li><strong>Organizations:</strong> ${new Set(processedData.map(d => d.agency)).size}</li>
        </ul>
        
        <h3>🏆 Top Performers</h3>
        <ul>
            <li><strong>Leading Country:</strong> ${topCountry[0]} (${topCountry[1].toLocaleString()} missions)</li>
            <li><strong>Most Active Organization:</strong> ${topAgency[0]} (${topAgency[1].toLocaleString()} missions)</li>
            <li><strong>Most Used Rocket:</strong> ${topRocket[0]} (${topRocket[1].toLocaleString()} launches)</li>
        </ul>
        
        <h3>✅ Mission Success</h3>
        <ul>
            <li><strong>Overall Success Rate:</strong> ${successRate}%</li>
            <li><strong>Successful Missions:</strong> ${successfulMissions.toLocaleString()}</li>
            <li><strong>Failed Missions:</strong> ${(totalMissions - successfulMissions).toLocaleString()}</li>
        </ul>
        
        <h3>📅 Launch Patterns</h3>
        <ul>
            <li><strong>Peak Launch Year:</strong> ${peakYear[0]} (${peakYear[1].toLocaleString()} missions)</li>
            <li><strong>Most Popular Launch Month:</strong> ${topMonth[0]} (${topMonth[1].toLocaleString()} launches)</li>
            <li><strong>Busiest Day of Week:</strong> ${topDay[0]} (${topDay[1].toLocaleString()} launches)</li>
        </ul>
        
        <h3>🚀 Historical Context</h3>
        <ul>
            <li>The Space Race era (1950s-1970s) marked rapid growth in space exploration</li>
            <li>Success rates have generally improved with advancing technology</li>
            <li>Commercial spaceflight has emerged as a major force in recent decades</li>
            <li>The journey from Sputnik to modern space exploration continues!</li>
        </ul>
    `;
    
    document.getElementById('insights-content').innerHTML = insightsHTML;
}

// ================================================
// MAIN INITIALIZATION
// ================================================

async function init() {
    try {
        // Load CSV data
        const csvData = await loadCSVData();
        
        // Process data
        processedData = processData(csvData);
        console.log(`Processed ${processedData.length} records`);
        
        // Hide loading, show content
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        
        // Update statistics
        updateStatistics();
        
        // Create all charts
        createCountryChart();
        createOrganizationChart();
        createTemporalChart();
        createSpaceRaceChart();
        createMonthChart();
        createDayChart();
        createDecadeSuccessChart();
        createStatusChart();
        createSuccessTrendChart();
        createRocketChart();
        createRocketFamilyChart();
        createMissionTypeChart();
        
        // Generate insights
        generateInsights();
        
        console.log('Dashboard initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        document.getElementById('fetch-progress').textContent = 
            'Error loading CSV file. Please ensure mission_launches.csv is in the same directory.';
    }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
