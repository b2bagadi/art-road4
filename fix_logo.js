const http = require('http');

const data = JSON.stringify({
    key: "logo_url_light",
    value: "https://i.postimg.cc/hj9X69s6/logo_final_ART_ROAD_Noir.png",
    description: "Logo URL (light mode)"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/settings',
    method: 'PUT',
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
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
