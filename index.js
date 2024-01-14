fetch('./_lessons.json')
    .then(response => response.json())
    .then(lessons => {
        
        const worker = new Worker('worker.js');

        document.getElementById('run-code').addEventListener('click', async () => {
            const code = window.editor.getValue();
            worker.postMessage(code);

            // Lint the code
            window.JSHINT(code);
            const results = window.JSHINT.data();
            console.log(results);
            if (results.errors.length === 0) {
                worker.postMessage(code);
            } else {
                document.getElementById('syntax-error').innerHTML = results.errors.map((error) => `<li>Line ${error.line} (column: ${error.character}): ${error.reason} ${error.code && error.code.startsWith('W') ? "(warning)" : "(error)"}</li>`).join('');                            
            }

        });
        
        worker.onmessage = function(event) {
            const result = event.data;
            console.log(result);
        };

        // Populate the lessons on page load
        populateLessons(lessons);
    })
    .catch(error => console.error('Error:', error));

// Function to populate the lessons sidebar
function populateLessons(lessons) {
    const lessonsDiv = document.getElementById('lessons');
    lessons.forEach((lesson) => {
        const lessonElement = document.createElement('div');
        lessonElement.textContent = lesson.title;
        lessonElement.addEventListener('click', () => selectLesson(lesson));
        lessonsDiv.appendChild(lessonElement);
    });
}

// Function to select a lesson
function selectLesson(lesson) {
    document.getElementById('readme').innerHTML = marked.parse(lesson.readme);
    populateExercises(lesson.exercises);
}

// Function to populate the exercises sidebar
function populateExercises(exercises) {
    const exercisesDiv = document.getElementById('exercises');
    exercisesDiv.innerHTML = ''; // Clear any existing exercises
    exercises.forEach((exercise) => {
        const exerciseElement = document.createElement('div');
        exerciseElement.textContent = exercise.title;
        exerciseElement.addEventListener('click', () => selectExercise(exercise));
        exercisesDiv.appendChild(exerciseElement);
    });
}

// Function to select an exercise
function selectExercise(exercise) {
    document.getElementById('exercise-readme').innerHTML = marked.parse(exercise.readme);
    window.editor.setValue(exercise.code);
}
