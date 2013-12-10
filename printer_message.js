/****************************************************************************
* Inspired by https://github.com/joshuah/insert-coin/blob/master/printer.js *
****************************************************************************/

var net = require('net');

var printers = [
	{ ip: '10.210.4.150', lcdRows: 2, lcdCols: 16 }
];

var messages = [
	'INSERT COIN',
	'PRESS OK TO CONTINUE',
	'FEED ME A CAT',
	'I CAN HAZ PAPER?',
	'PC LOAD LETTER TRAY 42',
	'LAZORZ, PEW PEW',
	'PRINTER NOT FOUND',
	'LOADING HAMSTER PEASE WAIT...',
	'NO PAPER',
	'VOICE ACTIVATED SAY A COMMAND'
];

printers.forEach(function(printer) {

	// select a message at random
	var r = Math.floor((Math.random() * (messages.length-1))+1);

	// parse the message for display on a LCD
	var message = messages[r].toUpperCase().trim(),
			parsedMessage = '';
	if (message.length > printer.lcdCols) {
		while (message.length > 0) {
			var i = printer.lcdCols -1;
			while (message.charAt(i).match(/\S/)) { i -= 1; } // find the whitespace
			var row = message.substr(0,i);
			while (row.length < printer.lcdCols) { row += ' '; } // pad the line
			parsedMessage += row;
			message = message.substr(i+1); // cut out the parsed text
		}
	}
	else { // the message is < 1 row long
		parsedMessage = message;
	}

	message = '\x1b%-12345X@PJL JOB\n@PJL RDYMSG DISPLAY=\"'+parsedMessage+'\"\n@PJL EOJ\x1b-12345X\n';

	var client = net.connect({port: 9100, host: printer.ip}, function() { client.end(message); });

	client.on('error', function(err) { console.log(err); });	

	client.on('end', function() { console.log('sent: ',message); });

});