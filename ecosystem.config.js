module.exports = {
  apps: [
    {
      name: "milkman_backend",
      script: "cmd",
      args: "/c backend\\venv\\Scripts\\python backend\\manage.py runserver 0.0.0.0:8000",
      cwd: "./"
    },
    {
      name: "milkman_frontend",
      script: "cmd",
      args: "/c npm start",
      cwd: "./frontend"
    }
  ]
}