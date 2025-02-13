// frontend/script.js
async function processTask() {
    const taskInput = document.getElementById('taskInput');
    const resultsDiv = document.getElementById('results');
    const task = taskInput.value.trim();

    if (!task) {
        alert('Please enter a task');
        return;
    }

    try {
        resultsDiv.innerHTML = 'Processing...';
        const response = await fetch('http://localhost:3000/api/tasks/breakdown', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task })
        });

        if (!response.ok) {
            throw new Error('Failed to process task');
        }

        const data = await response.json();
        displayResults(data.steps);
    } catch (error) {
        console.error('Error:', error);
        resultsDiv.innerHTML = 'Error processing task. Please try again.';
    }
}

function displayResults(steps) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const list = document.createElement('ol');
    steps.forEach(step => {
        const item = document.createElement('li');
        item.textContent = step;
        list.appendChild(item);
    });

    resultsDiv.appendChild(list);
}

export { processTask };