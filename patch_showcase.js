const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/showcase.json', 'utf8'));

data.showcases.forEach(s => {
    if (s.slug === 'koperasi-pos') {
        s.techStack = {
            name: "MERN Stack",
            frontend: "React.js, Tailwind CSS",
            backend: "Node.js, Express.js",
            database: "MongoDB (NoSQL)",
            infrastructure: "Linux (Ubuntu), Docker, AWS EC2"
        };
    } else if (s.slug === 'warehouse-wms') {
        s.techStack = {
            name: "Java-Spring Stack",
            frontend: "React.js, Bootstrap",
            backend: "Java Spring Boot, Hibernate ORM",
            database: "PostgreSQL",
            infrastructure: "Apache Tomcat, AWS S3, Linux"
        };
    } else if (s.slug === 'vehicle-inspection') {
        s.techStack = {
            name: "Python-Django Stack",
            frontend: "React.js, Material UI",
            backend: "Python, Django REST Framework",
            database: "PostgreSQL",
            infrastructure: "Nginx, Gunicorn, Heroku"
        };
    } else if (s.slug === 'attendance') {
        s.techStack = {
            name: "LAMP Stack",
            frontend: "Vue.js, Tailwind CSS",
            backend: "PHP 8, Laravel Framework",
            database: "MySQL / MariaDB",
            infrastructure: "Linux, Apache, Redis (Cache)"
        };
    }
});

fs.writeFileSync('src/data/showcase.json', JSON.stringify(data, null, 4));
