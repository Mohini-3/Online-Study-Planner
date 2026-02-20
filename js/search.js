function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();
    const resultsSection = document.querySelector('.search-results');
    const resultsList = document.querySelector('.results-list');
    const resultsCount = document.querySelector('.results-count');
    
    if (query === '') {
        alert('Please enter a search term');
        return;
    }
    
    // Sample search data
    const searchData = [
        { title: 'Mathematics - Algebra', type: 'Subject', excerpt: 'Learn algebraic equations, polynomials, and problem-solving techniques.' },
        { title: 'Complete Physics Assignment', type: 'Task', excerpt: 'Due next week - Chapters 5-7 problems and lab report.' },
        { title: 'Improve Math Score to 85%', type: 'Goal', excerpt: 'Target completion by end of semester through regular practice.' },
        { title: 'Final Exams - December', type: 'Exam', excerpt: 'Comprehensive examination covering all subjects.' },
        { title: 'Chemistry - Organic Chemistry', type: 'Subject', excerpt: 'Study of carbon compounds and their reactions.' },
        { title: 'Prepare Weekly Study Plan', type: 'Task', excerpt: 'Create a structured schedule for the upcoming week.' }
    ];
    
    // Filter results
    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.excerpt.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
    );
    
    // Display results
    resultsSection.style.display = 'block';
    resultsCount.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''}`;
    
    if (results.length === 0) {
        resultsList.innerHTML = '<div class="result-item"><div class="result-title">No results found</div><div class="result-excerpt">Try different keywords or browse categories below.</div></div>';
    } else {
        resultsList.innerHTML = results.map(item => `
            <div class="result-item">
                <div class="result-title">${item.title}</div>
                <div class="result-excerpt">${item.excerpt}</div>
                <div class="result-meta">${item.type}</div>
            </div>
        `).join('');
    }
}

// Enable search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Filter button functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quick search tags
    const searchTags = document.querySelectorAll('.search-tag');
    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            searchInput.value = this.textContent;
            performSearch();
        });
    });
});
