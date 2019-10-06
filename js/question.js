class Question {
    constructor(title, category, options, correct) {
        this.title = title || '';
        this.category = category || '';
        this.options = options || [];
        this.correct = correct || [];
    }
}