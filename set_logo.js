const http = require('http');

const data = JSON.stringify({
    key: "logo_url_light",
    value: "https://placehold.co/200x80/orange/white?text=Light+Logo",
    description: "Test Light Logo"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/settings',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
