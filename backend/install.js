var Service = require('node-windows').Service;

var svc = new Service({
  name:'WebZah',
  description: 'Servis za Web Zahtjeve',
  script: 'C:\\web_zahtjevi\\backend\\app.js', 
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

svc.on('install',function(){
  console.log('Servis je instaliran.');
  svc.start();
  console.log('Servis je pokrenut.');
});

svc.install();
