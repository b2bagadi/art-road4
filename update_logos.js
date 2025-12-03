const http = require('http');

const settings = [
    {
        key: "logo_url_light",
        value: "https://i.postimg.cc/hj9X69s6/logo-final-ART-ROAD-Noir.png",
        description: "Logo URL (light mode)"
    },
    {
        key: "logo_url_dark",
        value: "https://i.postimg.cc/bv97GWV4/logo_final_ART_ROAD_blanc.png",
        description: "Logo URL (dark mode)"
    }
];

const updateSetting = (setting) => {
    const data = JSON.stringify(setting);
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
        console.log(`[${setting.key}] STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`[${setting.key}] BODY: ${chunk}`);
        });
    });

    req.on('error', (e) => {
        console.error(`[${setting.key}] problem with request: ${e.message}`);
    });

    req.write(data);
    req.end();
};

settings.forEach(updateSetting);
