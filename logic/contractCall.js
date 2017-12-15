'use strict';

var constants = require('../helpers/constants.js');
var VM = require('ethereumjs-vm');
var Trie = require('merkle-patricia-tree');
var rlp = require('rlp');

// Private fields
var self, modules, library;

// Constructor
function ContractCall () {
	self = this;
}


// Public methods
//
//__API__ `bind`

//
ContractCall.prototype.bind = function (scope) {
	modules = scope.modules;
	library = scope.library;
};

//
//__API__ `create`

//
ContractCall.prototype.create = function (data, trs) {

    trs.asset.address = data.address;
    trs.asset.params = data.params;

	return trs;
};

//
//__API__ `calculateFee`

//
ContractCall.prototype.calculateFee = function (trs) {
	return constants.fees.publishContract; // need to compute gas
};

//
//__API__ `verify`

//
ContractCall.prototype.verify = function (trs, sender, cb) {
	return cb(null, trs);
};

//
//__API__ `process`

//
ContractCall.prototype.process = function (trs, sender, cb) {
	return cb(null, trs);
};

//
//__API__ `getBytes`

//
ContractCall.prototype.getBytes = function (trs) {

	var buf;

	try {
		buf = trs.asset.params ? new Buffer(trs.asset.params, 'utf8') : null;
	} catch (e) {
		throw e;
	}

	return buf;
};

//
//__API__ `apply`

//
ContractCall.prototype.apply = function (trs, block, sender, cb) {
    // call ct here
    trs;

};


//
//__API__ `undo`

//
ContractCall.prototype.undo = function (trs, block, sender, cb) {
	return cb();
};

//
//__API__ `applyUnconfirmed`

//
ContractCall.prototype.applyUnconfirmed = function (trs, sender, cb) {
	return cb();
};

//
//__API__ `undoUnconfirmed`

//
ContractCall.prototype.undoUnconfirmed = function (trs, sender, cb) {
	return cb();
};

// asset schema
ContractCall.prototype.schema = {
	id: 'contractcall',
	type: 'object',
	properties: {
        params: {
            type: 'string',
            format: 'hex' 
        }
	},
	required: ['params']
};

//
//__API__ `objectNormalize`

//
ContractCall.prototype.objectNormalize = function (trs) {
	var report = library.schema.validate(trs.asset, Contract.prototype.schema);

	if (!report) {
		throw 'Failed to validate vote schema: ' + this.scope.schema.getLastErrors().map(function (err) {
			return err.message;
		}).join(', ');
	}

	return trs;
};

//
//__API__ `dbRead`

//
ContractCall.prototype.dbRead = function (raw) {

	if (!raw.params) {
		return null;
	} else {
		return {
            address: address,
            params: raw.params
        };
	}
};

ContractCall.prototype.dbTable = 'contractcalls';

ContractCall.prototype.dbFields = [
    'params',
	'transactionId'
];

//
//__API__ `dbSave`

//
ContractCall.prototype.dbSave = function (trs) {
	return {
		table: this.dbTable,
		fields: this.dbFields,
		values: {
            params: trs.asset.params,
			transactionId: trs.id
		}
	};
};

//
//__API__ `ready`

//
ContractCall.prototype.ready = function (trs, sender) {
	if (Array.isArray(sender.multisignatures) && sender.multisignatures.length) {
		if (!Array.isArray(trs.signatures)) {
			return false;
		}
		return trs.signatures.length >= sender.multimin;
	} else {
		return true;
	}
};


// Export
module.exports = ContractCall;
