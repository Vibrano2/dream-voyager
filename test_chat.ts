import axios from 'axios';

async function testChat() {
    console.log('Testing Chat API...');
    try {
        const response = await axios.post('http://localhost:5000/api/chat', {
            message: "Hello"
        });
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Server Data:', error.response.data);
        }
    }
}

testChat();
