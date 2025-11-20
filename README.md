# 🚀 Space Race Data Analysis

An interactive web-based data visualization dashboard that analyzes historical space missions from 1957 to the present. This project explores the fascinating history of space exploration through comprehensive data analysis and beautiful visualizations.

![Space Race Dashboard](https://img.shields.io/badge/Status-Live-success)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📊 Live Demo

Simply open `index.html` in your web browser to see the dashboard in action!

**Note:** Make sure `mission_launches.csv` is in the same directory as `index.html`.

## 🌟 Features

### Comprehensive Data Analysis
- **15+ Interactive Visualizations** using Chart.js
- **Real-time data fetching** from Launch Library 2 API
- **50+ years of space mission history** (1957-present)
- **Responsive design** works on desktop, tablet, and mobile

### Key Insights Explored

1. **🌍 Country Rankings**
   - Which countries have launched the most missions?
   - Historical comparison of space programs

2. **🏢 Organization Analysis**
   - Top space agencies and commercial companies
   - Evolution of space organizations over time

3. **📈 Temporal Trends**
   - Launch frequency over the decades
   - Peak years and periods of activity
   - USA vs Russia vs China space race visualization

4. **📅 Seasonal Patterns**
   - Most popular months for launches
   - Day-of-week launch preferences
   - Seasonal trends in space activity

5. **✅ Mission Success Rates**
   - Success/failure analysis by decade
   - Improvement trends over time
   - Status distribution of missions

6. **🚀 Rocket Technology**
   - Most frequently used rockets
   - Popular rocket families
   - Technology evolution

7. **🎯 Mission Types**
   - Distribution of mission objectives
   - Orbit classifications
   - Mission purpose analysis

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Data processing and visualization
- **Chart.js 4.4.0** - Interactive charts
- **CSV Data** - Historical space mission dataset (mission_launches.csv)

## 📦 Installation & Setup

### Option 1: Direct Use (Recommended)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/space-race-analysis.git
   cd space-race-analysis
   ```

2. **Open in browser**
   - Simply double-click `index.html`
   - Or right-click and choose "Open with" your preferred browser
   - No server required!

### Option 2: Local Server (Optional)

For development purposes, you can run a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 🚀 Usage

1. **Load the page** - The dashboard will automatically load the CSV data
2. **Instant display** - Data loads immediately from the CSV file
3. **Explore visualizations** - Scroll through all the interactive charts
4. **Read insights** - Check the Key Insights section at the bottom

### ⚠️ Important Notes

- **CSV File Required**: The `mission_launches.csv` file must be in the same directory
- **Loading Time**: Loads instantly from CSV (no API delays!)
- **Browser Compatibility**: Works best in modern browsers (Chrome, Firefox, Edge, Safari)
- **Local File Access**: For local testing, you may need to use a local server (see installation options)

## 📁 Project Structure

```
space-race-analysis/
├── index.html              # Main HTML structure
├── styles.css              # Styling and animations
├── app.js                  # Data loading, processing & visualization
├── mission_launches.csv    # Space mission dataset (REQUIRED)
├── README.md               # This file
├── Space_Race.py           # Original Python with API
└── Space_Race_CSV.py       # Python version using CSV
```

## 🎨 Customization

### Use Different CSV File

Replace `mission_launches.csv` with your own dataset. Make sure it has these columns:
- `Organisation` or `agency`
- `Location` or `location_name`
- `Date` or `date`
- `Detail` or `rocket`
- `Mission_Status` or `status`

### Change Color Scheme

In `styles.css`, modify the CSS variables:

```css
:root {
    --primary-color: #0a192f;
    --accent-color: #64ffda;
    /* ... more colors ... */
}
```

### Add New Charts

1. Add a new canvas element in `index.html`
2. Create a corresponding chart function in `app.js`
3. Call it from the `init()` function

## 📊 Data Source

This project uses data from the **mission_launches.csv** dataset which contains:

### Data Coverage
- Historical launches from 1957 onwards (~4,300+ missions)
- Mission status (success/failure)
- Launch sites and countries
- Rocket configurations
- Organizations and space agencies
- Launch dates and locations

The CSV format allows for:
- ✅ Instant loading (no API delays)
- ✅ Offline usage
- ✅ No rate limiting
- ✅ Easy data updates

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

1. **Report bugs** - Open an issue describing the problem
2. **Suggest features** - Share ideas for new visualizations
3. **Improve code** - Submit pull requests with enhancements
4. **Fix typos** - Even documentation improvements help!

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Space Race Analysis Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **The Space Devs** for providing the excellent Launch Library 2 API
- **Chart.js** team for the amazing charting library
- **NASA** and space agencies worldwide for inspiring space exploration
- All contributors to open space data initiatives

## 📧 Contact

Project Link: [https://github.com/yourusername/space-race-analysis](https://github.com/yourusername/space-race-analysis)

## 🌟 Show Your Support

If you found this project helpful or interesting, please give it a ⭐ on GitHub!

---

**Note**: This is an educational project created for data analysis and visualization practice. The data is sourced from public APIs and is used in accordance with their terms of service.

## 🔍 Questions Answered

This analysis helps answer fascinating questions about space exploration:

- ✅ Who launched the most missions in any given year?
- ✅ How has mission success rate varied over time?
- ✅ Which months are most popular for launches?
- ✅ Have space missions gotten safer over the decades?
- ✅ What are the dominant rocket families?
- ✅ How does the Space Race compare: USA vs Russia vs China?
- ✅ What mission types are most common?
- ✅ Which organizations lead space exploration today?

## 🚀 Future Enhancements

Potential features for future versions:

- [ ] Filter data by date range
- [ ] Search for specific missions
- [ ] Download charts as images
- [ ] Export data to CSV
- [ ] Add cost analysis (when available)
- [ ] 3D globe visualization of launch sites
- [ ] Real-time upcoming launches
- [ ] Mission success prediction model
- [ ] Mobile app version

---

**Made with 💙 for space exploration enthusiasts**
