const fs = require('fs');
const glob = require('glob');

// Get all lesson folders
const lessonFolders = glob.sync('./lesson*');

const lessons = lessonFolders.map(folder => {
    const readme = fs.readFileSync(`${folder}/README.md`, 'utf-8');

    // Get all exercise folders for this lesson
    const exerciseFolders = glob.sync(`${folder}/exercises/exercise*`);

    const exercises = exerciseFolders.map(exerciseFolder => {
        const exerciseReadme = fs.readFileSync(`${exerciseFolder}/README.md`, 'utf-8');
        const exerciseCode = fs.readFileSync(`${exerciseFolder}/index.js`, 'utf-8');

        return {
            title: exerciseFolder.split('/').pop(),
            readme: exerciseReadme,
            code: exerciseCode
        };
    });

    return {
        title: folder.split('/').pop(),
        readme: readme,
        exercises: exercises
    };
});

// Write the lessons data to a JSON file
fs.writeFileSync('_lessons.json', JSON.stringify(lessons, null, 2));