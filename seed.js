const mongoose = require('mongoose');
const { Problem } = require('./models/problems');

// Change the database name to Learnova
mongoose.connect('mongodb://127.0.0.1:27017/Learnova')
    .then(() => {
        console.log("MongoDB connected for seeding");
    })
    .catch(err => {
        console.error("Connection error:", err);
    });

const sampleProblems = [
    {
        title: "Max Element in Array",
        description: "Find the maximum element in an array of integers.",
        difficulty: "Easy",
        constraints: ["1 ≤ n ≤ 1000", "-1000 ≤ arr[i] ≤ 1000"],
        score: 20,
        usersTried: 0,
        successRate: 0,
        sampleTestCases: [
            {
                input: "5\n1 2 3 4 5",
                output: "5",
                explanation: "The maximum element in the array [1, 2, 3, 4, 5] is 5."
            }
        ]
    },
    {
        title: "Number Distribution",
        description: "Count the distribution of numbers in an array.",
        difficulty: "Easy",
        constraints: ["1 ≤ n ≤ 1000", "0 ≤ arr[i] ≤ 100"],
        score: 20,
        usersTried: 0,
        successRate: 0,
        sampleTestCases: [
            {
                input: "5\n1 2 2 3 3",
                output: "1:1, 2:2, 3:2",
                explanation: "Number 1 appears once, number 2 appears twice, number 3 appears twice."
            }
        ]
    },
    {
        title: "Reverse Array",
        description: "Reverse the elements of an array.",
        difficulty: "Easy",
        constraints: ["1 ≤ n ≤ 1000", "-1000 ≤ arr[i] ≤ 1000"],
        score: 20,
        usersTried: 0,
        successRate: 0,
        sampleTestCases: [
            {
                input: "5\n1 2 3 4 5",
                output: "5 4 3 2 1",
                explanation: "The reversed array is [5, 4, 3, 2, 1]."
            }
        ]
    },
    {
        title: "Odd and Even Sum",
        description: "Calculate the sum of odd and even numbers separately in an array.",
        difficulty: "Easy",
        constraints: ["1 ≤ n ≤ 1000", "0 ≤ arr[i] ≤ 1000"],
        score: 20,
        usersTried: 0,
        successRate: 0,
        sampleTestCases: [
            {
                input: "5\n1 2 3 4 5",
                output: "Odd Sum: 9, Even Sum: 6",
                explanation: "Odd numbers: 1+3+5=9, Even numbers: 2+4=6"
            }
        ]
    },
    {
        title: "Mean Median Mode",
        description: "Calculate the mean, median, and mode of an array of numbers.",
        difficulty: "Medium",
        constraints: ["1 ≤ n ≤ 1000", "0 ≤ arr[i] ≤ 1000"],
        score: 20,
        usersTried: 0,
        successRate: 0,
        sampleTestCases: [
            {
                input: "5\n1 2 3 4 5",
                output: "Mean: 3, Median: 3, Mode: none",
                explanation: "Mean: (1+2+3+4+5)/5=3, Median: middle value is 3, Mode: all values appear once"
            }
        ]
    },
    {
        title: "The Missing Number",
        description: "Find the missing number in a sequence of integers from 1 to n.",
        difficulty: "Easy",
        constraints: ["2 ≤ n ≤ 1000", "Array contains n-1 distinct numbers"],
        score: 20,
        usersTried: 0,
        successRate: 0,
        sampleTestCases: [
            {
                input: "5\n1 2 4 5",
                output: "3",
                explanation: "The sequence 1,2,3,4,5 is missing the number 3"
            }
        ]
    },
    {
        title: "Find Duplicate Number in Array",
        description: "Find the duplicate number in an array of integers.",
        difficulty: "Easy",
        constraints: ["2 ≤ n ≤ 1000", "Exactly one duplicate exists"],
        score: 20,
        usersTried: 0,
        successRate: 0,
        sampleTestCases: [
            {
                input: "5\n1 2 3 2 4",
                output: "2",
                explanation: "The number 2 appears twice in the array"
            }
        ]
    },
    {
        title: "First and Last",
        description: "Find the first and last occurrence of a target value in a sorted array.",
        difficulty: "Easy",
        constraints: ["1 ≤ n ≤ 1000", "Array is sorted in non-decreasing order"],
        score: 20,
        usersTried: 0,
        successRate: 0,
        sampleTestCases: [
            {
                input: "6\n1 2 2 2 3 4\n2",
                output: "First: 1, Last: 3",
                explanation: "The value 2 first appears at index 1 and last appears at index 3"
            }
        ]
    }
];

const seedDB = async () => {
    await Problem.deleteMany({});
    await Problem.insertMany(sampleProblems);
    console.log("Sample data seeded successfully in Learnova database");
    mongoose.connection.close();
};

seedDB();