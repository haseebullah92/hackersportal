const dev = {
    apiUrl: 'http://localhost:51908/api'
};

const prod = {
    apiUrl: 'https://hackersportalwepapi.azurewebsites.net/api'
};

const config = window.location.href.indexOf("localhost")<0
    ? prod
    : dev;

export default {
    ...config
};