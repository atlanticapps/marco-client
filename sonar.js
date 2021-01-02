const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
    {
        token: process.env.SONAR_LOGIN,
        options: {
            "sonar.projectVersion": process.env.npm_package_version
        }
    },
    () => process.exit()
);

