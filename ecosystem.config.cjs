module.exports = {
  apps: [
    {
      name: "superprecast",
      cwd: "/var/www/superprecast",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
