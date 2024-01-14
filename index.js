var workerWorking = false;
var codeExisting = false;

fetch('./_lessons.json')
    .then(response => response.json())
    .then(lessons => {
        

        document.getElementById('run-code').addEventListener('click', async () => {
            const code = window.editor.getValue();

            // Lint the code
            window.JSHINT(code);
            const results = window.JSHINT.data();
            console.log(results);
            if (workerWorking) {
                document.getElementById('syntax-error').innerHTML = "<span class=\"warning\">Already executing last code... </span>";
            } else {
                if (!results.errors || results.errors.length === 0) {
                    const worker = new Worker('worker.js');
                    document.getElementById('syntax-error').innerHTML = "";

                    worker.onmessage = function(event) {
                        const result = event.data;
                        if (result.hasOwnProperty('result')) {
                            console.log('worker return: ', result);
                        } else {
                            const key = Object.keys(result)[0];
                            document.getElementById('syntax-error').innerHTML += `<span class=\"${key}\">${result[key]}</span>`;
                        }
                        workerWorking = false;
                    };

                    workerWorking = true;
                    worker.postMessage(code);
                    // Set a timeout to terminate the worker if it runs too long
                    const timeoutId = setTimeout(() => {
                        workerWorking = false;
                    }, 5000); // Timeout after 5000 milliseconds (5 seconds)
                } else {
                    document.getElementById('syntax-error').innerHTML = results.errors.map((error) => `<span class=\"${error.code && error.code.startsWith('W') ? "warning" : "error"}\">Line ${error.line} (column: ${error.character}): ${error.reason}</span>`).join('');
                }
            }

        });
    
        // Populate the lessons on page load
        populateLessons(lessons);
    })
    .catch(error => console.error('Error:', error));

// Function to populate the lessons sidebar
function populateLessons(lessons) {
    const lessonsDiv = document.getElementById('lessons');
    lessons.forEach((lesson) => {
        const lessonElement = document.createElement('button');
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
        const exerciseElement = document.createElement('button');
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
