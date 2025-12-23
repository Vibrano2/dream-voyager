console.log("Starting test script");
import express from 'express';
console.log("Express imported");
const app = express();
app.listen(5001, () => console.log("Test server running on 5001"));
