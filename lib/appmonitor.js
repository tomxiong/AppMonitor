var cluster = require('cluster');
var child_process = require('child_process');
var nodetime = require('nodetime047');
var agentio = require('nodetime047/lib/agent.io');

var clusterhub = require('clusterhub').createHub('appmonitor');

var agent = new (require('./agent'));

agentio.createClient = function () {
	return agent;
};

module.exports.start = function (port, host) {
	if (cluster.isMaster) {
		var observer = child_process.fork(__dirname + '/observer', [ port, host ]);

		observer.on('message', function (data) {
			if (data.cmd === 'init') {
				observer.send({ cmd: 'init', args: { socket: data.args.socket, transactions: nodetime.transactions } });
				return;
			}
			agent.request(data);
			clusterhub.emit('request', data);
		});

		agent.on('request', function (data) {
			observer.send(data);
		});

		clusterhub.on('response', function (data) {
			observer.send(data);
		});

	} else {
		agent.on('request', function (data) {
			clusterhub.emit('response', data);
		});

		clusterhub.on('request', function (data) {
			agent.request(data);
		});
	}

	agent.on('command', function (data) {
		switch (data.cmd) {
			case 'transactions-start' :
				nodetime.transactions = true;
				nodetime.resume();
				break;
			case 'transactions-stop' :
				nodetime.pause();
				nodetime.transactions = false;
				break;
		}
	});

	nodetime.profile({ server: 'localhost', accountKey: 'session', silent: true, transactions: false });
};