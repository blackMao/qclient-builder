var Q = require('q');
var util = require('util');
var inquirer = require('inquirer');
var child_process = require('child_process');

module.exports = {
	extend : function(dst) {
		var i, src, key, g, s;
		for (i=1; i<arguments.length; i++) {
			src = arguments[i];
			for (key in src) {
				g = src.__lookupGetter__(key);
				s = src.__lookupSetter__(key);
				if (g || s) {
					g && dst.__defineGetter__(key, g);
					s && dst.__defineSetter__(key, s);
				} else {
					dst[key] = src[key];
				}
			}
		}
		return dst;
	},
	urlencode: function(str) {
		return this.rawurlencode(str).replace(/%20/g, '+').replace(/~/, '%7E');
	},
	rawurlencode: function(str) {
		var replaceMap = {
			'!' : '%21',
			"'" : '%27',
			'(' : '%28',
			')' : '%29',
			'*' : '%2A',
			'+' : '%2B',
			'/' : '%2F',
			'@' : '%40'
		};
		return encodeURIComponent(str).replace(/([!'()*+\/@])/g, function(a) {
			return replaceMap[a];
		}).replace(/%7E/, '~').replace(/%C(\d)%(..)/g, function(f, a, b) {
			return '%' + (a == '2' ? b : (parseInt(b, 16) + 0x40).toString('16').toUpperCase());
		});
	},
	exec: function(cmd) {
		var defer = Q.defer();

		var child = child_process.exec(cmd, function(error, data) {
			if (error) {
				defer.reject(data);
			} else {
				defer.resolve(data);
			}
		});

		process.on('exit', function(code, sig) {
			child.connected && child.kill(sig);
		});

		return defer.promise;
	},
	sudoExec: function(cmd, opts) {
		var defer = Q.defer();

		var prompt = '#PWD#';
		var args = ['-S', '-p', prompt, 'ls'];
		var sudo = 'sudo';
		if (opts.username) {
			args.unshift(opts.username);
			args.unshift('-u');
			sudo += ' -u ' + opts.username;
		}
		var child = child_process.spawn('sudo', args);

		var retryFlag;

		child.stderr.on('data', function (data) {
			var isAskForPassword = data.toString().trim().split('\n').reduce(function(t, line) {
				return line == prompt;
			}, false);

			if (isAskForPassword) {
				if (retryFlag) {
					defer.reject('Error Password.');
					child.stdin.write('\n');
				} else {
					child.stdin.write(opts.password + '\n');
				}
			}
			retryFlag = true;
		});

		child.stderr.on('end', function() {
			defer.resolve();
		});

		process.on('exit', function(code, sig) {
			child.connected && child.kill(sig);
		});

		return defer.promise.then(function() {
			return this.exec(sudo + ' ' + cmd);
		}.bind(this));
	},
	retry : function(cb, times) {
		times = isNaN(times) ? 3 : times;
		var promise = cb();
		while (times --) {
			promise = promise.then(true, cb);
		}
		return promise;
	},
	prompt : function(opts) {
		var deferred = Q.defer();
		opts.name = 'data';
		inquirer.prompt(opts, function(data) {
			deferred.resolve(data.data);
		});
		return deferred.promise;
	},
	trim: function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}
};