let config = {
enabled: true,
// # Specify allowed headers, like 'x-allowed-header'.
allowedHeaders: ['x-csrf-token', 'authorization', 'content-type', 'accept', 'origin', 'x-requested-with'],
// # Specify allowed request methods, specify['*'] to allow all possible ones.
allowedMethods: ['*'],
// # Configure requests allowed from specific origins.
allowedOrigins: ['http://localhost/', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:4200', 'http://104.211.226.77/drupal8/', '*'],
// # Sets the Access - Control - Expose - Headers header.
exposedHeaders: true,
// # Sets the Access - Control - Max - Age header.
maxAge: false,
// # Sets the Access - Control - Allow - Credentials header.
supportsCredentials: true
}