const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
    explanation: {
        type: String
    }
});

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    constraints: [{
        type: String
    }],
    sampleTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
    score: {
        type: Number,
        default: 20
    },
    usersTried: {
        type: Number,
        default: 0
    },
    successRate: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);

module.exports = { Problem };