const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Task 7 : MongoDB se connect karne ke liye mongoose library ka use karenge
mongoose.connect('mongodb://127.0.0.1:27017/student_db')
.then(() => console.log("MongoDB Database se connection SUCCESSFUL ho gaya! 🎉"))
.catch((err) => console.log("Database connection mein error aaya:", err));

// === TASK 3: Middlewares ===
app.use(cors());
app.use(express.json()); // Ye line req.body ko read karne ke liye compulsory hai!

// === TASK 8: Student Schema & Model ===
// 1. Schema: Database ko batana ki data ka structure kaisa hoga
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        unique: true // Ek roll number ka ek hi student ho sakega
    },
    branch: {
        type: String,
        required: true
    }
});

// 2. Model: Is 'Student' model ke zariye hi hum database mein data daalenge aur nikalenge
const Student = mongoose.model('Student', studentSchema);

// Dummy Data
let students = [
    { name: "Akanksha", rollNo: "2301430100016", branch: "CS" }
];

// Simple Test Route
app.get('/', (req, res) => {
    res.send("Student Management Server is Running!");
});


// 🚀 REFACTORING TASK 9: DATABASE REST APIs

// 1. GET API - Ab ye direct MongoDB se saare students lekar aayega
app.get('/api/students', async (req, res) => {
    try {
        const allStudents = await Student.find(); // .find() database se saara data nikal leta hai
        res.json(allStudents);
    } catch (error) {
        res.status(500).json({ message: "Data fetch karne mein galti hui", error });
    }
});

// 2. POST API - Ab ye naye student ko direct Database mein save karega
app.post('/api/students', async (req, res) => {
    const { name, rollNo, branch } = req.body;

    if (!name || !rollNo || !branch) {
        return res.status(400).json({ message: "Sari fields dalkar bhejo!" });
    }

    try {
        // Check karna ki kya ye Roll Number database mein pehle se hai?
        const studentExists = await Student.findOne({ rollNo: rollNo });
        if (studentExists) {
            return res.status(400).json({ message: "Ye Roll Number pehle se registered hai!" });
        }

        // Database mein naya document (row) banana aur save karna
        const newStudent = new Student({ name, rollNo, branch });
        await newStudent.save(); // Database mein data permanently locked!

        res.status(201).json({ message: "Student Database mein successfully save ho gaya!" });
    } catch (error) {
        res.status(500).json({ message: "Server mein kuch galti hui", error });
    }
});

// 3. DELETE API - Student ko uske Roll Number se Database se hatane ke liye
app.delete('/api/students/:rollNo', async (req, res) => {
    const { rollNo } = req.params;

    try {
        // Database se dhoondh kar delete karna
        const deletedStudent = await Student.findOneAndDelete({ rollNo: rollNo });

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student nahi mila database mein!" });
        }

        res.json({ message: `Roll Number ${rollNo} ka data database se delete ho gaya!` });
    } catch (error) {
        res.status(500).json({ message: "Delete karne mein error aaya", error });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});