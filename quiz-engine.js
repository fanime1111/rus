// quiz-engine.js

class QuizEngine {
    constructor(allQuestions, quizCardId = 'quizCard', count = 7) {
        this.allQuestions = allQuestions;
        this.quizCard = document.getElementById(quizCardId);
        this.count = Math.min(count, allQuestions.length);
        this.questions = [];
        this.current = 0;
        this.score = 0;
        this.answered = false;

        this.init();
    }

    init() {
        this.questions = this.shuffle([...this.allQuestions]).slice(0, this.count);
        // Перемешиваем варианты каждого вопроса
        this.questions.forEach(q => {
            const correctAnswer = q.options[q.correct];
            const shuffled = this.shuffle([...q.options]);
            q.options = shuffled;
            q.correct = shuffled.indexOf(correctAnswer);
        });
        this.current = 0;
        this.score = 0;
        this.answered = false;
        this.render();
    }

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    updateProgress() {
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        if (fill && text) {
            const pct = ((this.current) / this.count) * 100;
            fill.style.width = pct + '%';
            text.textContent = `${this.current} / ${this.count}`;
        }
    }

    render() {
        this.updateProgress();

        if (this.current >= this.count) {
            this.showResults();
            return;
        }

        const q = this.questions[this.current];
        const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е'];

        let optionsHtml = q.options.map((opt, i) => `
            <button class="quiz-option" data-index="${i}" onclick="quiz.selectAnswer(${i})">
                <span class="option-letter">${letters[i]}</span>
                <span>${opt}</span>
            </button>
        `).join('');

        this.quizCard.innerHTML = `
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-options">${optionsHtml}</div>
            <div class="quiz-explanation" id="explanation">${q.explanation || ''}</div>
            <div class="quiz-actions">
                <button class="btn btn-primary" id="nextBtn" onclick="quiz.next()" disabled>
                    ${this.current < this.count - 1 ? 'Следующий →' : 'Результаты →'}
                </button>
            </div>
        `;

        this.answered = false;
    }

    selectAnswer(index) {
        if (this.answered) return;
        this.answered = true;

        const q = this.questions[this.current];
        const options = this.quizCard.querySelectorAll('.quiz-option');

        options.forEach(opt => {
            opt.classList.add('disabled');
        });

        if (index === q.correct) {
            options[index].classList.add('correct');
            this.score++;
        } else {
            options[index].classList.add('wrong');
            options[q.correct].classList.add('correct');
        }

        const explanation = document.getElementById('explanation');
        if (explanation && q.explanation) {
            explanation.classList.add('show');
        }

        document.getElementById('nextBtn').disabled = false;
    }

    next() {
        this.current++;
        this.render();
    }

    showResults() {
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        if (fill) fill.style.width = '100%';
        if (text) text.textContent = `${this.count} / ${this.count}`;

        const pct = Math.round((this.score / this.count) * 100);
        let icon, label, cls;

        if (pct >= 90) {
            icon = '🏆'; label = 'Превосходно!'; cls = 'excellent';
        } else if (pct >= 70) {
            icon = '👍'; label = 'Хороший результат!'; cls = 'good';
        } else if (pct >= 50) {
            icon = '📖'; label = 'Нужно повторить материал'; cls = 'average';
        } else {
            icon = '💪'; label = 'Не сдавайтесь, попробуйте ещё!'; cls = 'poor';
        }

        this.quizCard.innerHTML = `
            <div class="quiz-results">
                <div class="results-icon">${icon}</div>
                <div class="results-score ${cls}">${this.score} из ${this.count}</div>
                <div class="results-text">${label} (${pct}% правильных ответов)</div>
                <div class="quiz-actions" style="justify-content: center;">
                    <button class="btn btn-primary" onclick="quiz.init()">🔄 Пройти заново</button>
                    <button class="btn btn-secondary" onclick="location.href='index.html'">← К темам</button>
                </div>
            </div>
        `;
    }
}