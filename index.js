var containers = {},
    lxc = require('./lxc')(''),
    dns = require('native-dns'),
    server = dns.createServer(),
    suffix = process.env.ACCEPT_SUFFIX;

console.log('Starting DNS server');

// refresh containers list periodically
setInterval(function () {
  lxc.list(function(err, data) {
      // maps running containers IP addresses:
      // { 'cont1': '10.0.3.169', 'cont2': '10.0.3.171' }
      // duplicates entry if we are accepting suffixes
      // { 'cont1': '10.0.3.169', 'cont2': '10.0.3.171',
      //   'cont1.lab1': '10.0.3.169', 'cont2.lab2': '10.0.3.171' }
            
      var t = {};
      for (var containerName in data) {

        // '-' means the container exists but the IPv4 address is unknown
        // so it is skipped
        if (data[containerName].ipv4 && data[containerName].ipv4 != '-') {
           t[containerName] = data[containerName].ipv4;

           // duplicates entry if we are accepting suffixes
           suffix && (t[containerName + suffix] = data[containerName].ipv4);
        }
      }
      containers = t;
  });

// half second
}, 500);

suffix && console.log('Accepting suffix ' + suffix);

server.on('request', function (request, response) {
    var name = request.question[0].name;
    var ipv4 = containers[name];
  
    if (ipv4) {

        response.answer.push(dns.A({
            name: name,
            address: ipv4,
            // half second
            ttl: 500,
        }));

        console.log(name + ' = ' + ipv4);
    } else {
        console.log('This DNS doesn\'t know about: ' + name);
    }

    response.send();
});

server.on('error', function (err, buff, req, res) {
    console.log(err.stack);
});

// 53 is the standard DNS port
server.serve(53);

