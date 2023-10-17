// Sample quiz questions on general knowledge
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris",
    },
    {
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "F. Scott Fitzgerald"],
        correctAnswer: "William Shakespeare",
    },
    {
        question: "Which gas do plants absorb from the atmosphere during photosynthesis?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: "Carbon Dioxide",
    },
    // Add more questions here
];

let currentQuestion = 0;
let userScore = 0;

function displayQuestion() {

    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;

    if (!name || !location) {
        alert('Please enter your name and location to start the quiz.');
        return;
    }

    if (currentQuestion < quizQuestions.length) {
        const questionData = quizQuestions[currentQuestion];
        const questionElement = document.getElementById("quiz-questions");
        questionElement.innerHTML = `
    <h2 style="font-size: 20px; margin-bottom: 10px;">Question ${currentQuestion + 1}</h2>
    <p style="font-size: 18px; margin-bottom: 10px;">${questionData.question}</p>
    <ul style="list-style-type: none; padding: 0;">
        ${questionData.options.map((option, index) => `
            <li style="margin-bottom: 10px;">
                <input type="radio" name="answer" value="${option}" id="option${index}" style="margin-right: 10px;">
                <label for="option${index}" style="font-size: 16px;">${option}</label>
            </li>
        `).join('')}
    </ul>
    <button id="submit-answer" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Submit Answer</button>
`;

        document.getElementById('quiz-questions').style.display = 'flex';

        document.getElementById('start-quiz').style.display = 'none';

        // Add a click event listener for the "Submit Answer" button
        document.getElementById('submit-answer').addEventListener('click', evaluateAnswer);
    } else {
        finishQuiz();
    }
}

function evaluateAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert('Please select an answer before submitting.');
        return;
    }

    const selectedValue = selectedAnswer.value;
    const correctAnswer = quizQuestions[currentQuestion].correctAnswer;

    if (selectedValue === correctAnswer) {
        userScore++;
    }

    currentQuestion++;
    displayQuestion();
}

function finishQuiz() {
    document.getElementById('quiz-questions').style.display = 'none';

    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    document.getElementById('certificate-name').textContent = name;
    document.getElementById('certificate-location').textContent = location;
    document.getElementById('certificate-score').textContent = userScore;

    document.getElementById('certificate').style.display = 'block';

    // Remove the default 'href' attribute and add a click event listener
    const downloadLink = document.getElementById('download-certificate');
    downloadLink.removeAttribute('href');
    downloadLink.addEventListener('click', () => {
        downloadCertificate(name, location, userScore);
    });
}

function downloadCertificate(name, location, score) {
    fetch(`/generate_certificate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, location, score }),
    })
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'certificate.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('Error downloading certificate:', error);
        });
}

document.getElementById('start-quiz').addEventListener('click', function () {
    displayQuestion();
});
