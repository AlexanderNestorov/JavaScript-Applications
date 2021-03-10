const monthNames = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12
}

const yearSelect = document.getElementById('years');

const years = [...document.querySelectorAll('.monthCalendar')]
    .reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
    }, {});

const months = [...document.querySelectorAll('.daysCalendar')]
    .reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
    }, {});

function displaySection(section) {
    document.body.innerHTML = '';
    document.body.appendChild(section);

}

displaySection(yearSelect);

yearSelect.addEventListener('click', (event) => {
    if (event.target.classList.contains('date') || event.target.classList.contains('day')) {
        const yearId = `year-${event.target.textContent.trim()}`;
        displaySection(years[yearId]);
    }
})

document.body.addEventListener('click', (event) => {
    if(event.target.tagName == 'CAPTION') {
        const sectionId = event.target.parentNode.parentNode.id;
        if(sectionId.includes('year-')) {
            displaySection(yearSelect);
        } else if(sectionId.includes('month-')) {
            const yearId = sectionId.split('-')[1];
            displaySection(years[`year-${yearId}`]);
        }
    } else if(event.target.tagName == 'TD' || event.target.tagName == 'DIV') {
        const monthName = event.target.textContent.trim();
        if(monthNames.hasOwnProperty(monthName)) {
            let parent = event.target.parentNode;
           while(parent.tagName != 'TABLE') {
               parent = parent.parentNode;
           }
           const year = parent.querySelector('caption').textContent;
           const monthId = `month-${year}-${monthNames[monthName]}`
           displaySection(months[monthId]);
        }
    }
})