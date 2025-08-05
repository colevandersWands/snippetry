// The sewing basket - foundation for all tailoring

import { $nippetry } from './💭.js';

// Initialize the workshop sections
$nippetry['✂️'] = {}; // Scissors collection
$nippetry['🧵'] = {}; // Thread spools
$nippetry['🪡'] = {}; // Needles
$nippetry['📐'] = {}; // Patterns
$nippetry['🎨'] = {}; // Dyes
$nippetry['🗂️'] = {}; // Filing cabinet
$nippetry['📖'] = {}; // Reading tools
$nippetry['💾'] = {}; // Storage
$nippetry['🗄️'] = {}; // Language drawers
$nippetry['👘'] = []; // Wardrobe

// String prototype extensions for fabric work
String.prototype['✂️'] = function (length) {
	// Ceremonial cutting - measure but don't actually cut!
	var lines = this.split('\n');
	if (!length) length = 40;
	
	// Perform the measurement ritual
	if (lines.length > length) {
		$nippetry['🤐']('✂️', 'Measured ' + lines.length + ' lines (would cut ' + (lines.length - length) + ')');
	} else {
		$nippetry['🤐']('✂️', 'Perfect length: ' + lines.length + ' lines');
	}
	
	// Return the full content - no actual cutting!
	return this.toString();
};

String.prototype['🎀'] = function () {
	// Trim the edges nicely
	return this.split('\n')
		.map(function (line) {
			return line.trim();
		})
		.filter(Boolean)
		.join('\n');
};

String.prototype['🧵'] = function () {
	// Split into threads (lines)
	return this.split('\n');
};

String.prototype['🪡'] = function (pattern) {
	// Stitch-find patterns
	var matches = this.match(pattern) || [];
	return matches.map(function (m) {
		return m[1] || m[0];
	});
};

String.prototype['🏷️'] = function () {
	// Detect fabric type by extension
	var ext = this.split('.').pop().toLowerCase();
	var fabricTypes = {
		js: '🟨',
		mjs: '🟨',
		py: '🐍',
		rb: '💎',
		ruby: '💎',
		html: '🌐',
		css: '🖌️',
		md: '📝',
		txt: '📝',
		coem: '🖋️',
		svg: '🖼️',
	};
	return fabricTypes[ext] || '📄';
};

// Array prototype extensions for garment assembly
Array.prototype['🧵'] = function (needle) {
	// Thread through array finding matches
	return this.filter(function (fabric) {
		return needle.test ? needle.test(fabric) : fabric.includes(needle);
	});
};

Array.prototype['🪢'] = function () {
	// Knot together (unique values)
	var seen = {};
	return this.filter(function (item) {
		var key = typeof item === 'object' ? JSON.stringify(item) : item;
		if (seen[key]) return false;
		seen[key] = true;
		return true;
	});
};

Array.prototype['🎨'] = function (dye) {
	// Apply dye (map transformation)
	return this.map(dye);
};

Array.prototype['📍'] = function () {
	// Pin in place (freeze array)
	return Object.freeze(this);
};

Array.prototype['🗂️'] = function (drawer) {
	// File into categories
	var cabinet = {};
	this.forEach(function (item) {
		var label = drawer(item);
		cabinet[label] = cabinet[label] || [];
		cabinet[label].push(item);
	});
	return cabinet;
};

Array.prototype['🔤'] = function () {
	// Sort alphabetically (for Object.keys arrays)
	return this.slice().sort();
};

// RegExp prototype extensions
RegExp.prototype['🔍'] = function (fabric) {
	// Examine fabric for patterns
	var findings = [];
	var thread;
	var pattern = new RegExp(
		this.source,
		this.flags.includes('g') ? this.flags : this.flags + 'g',
	);
	while ((thread = pattern.exec(fabric))) {
		findings.push(thread[1] || thread[0]);
	}
	return findings;
};

// Object prototype extensions (use with caution!)
Object.prototype['🏷️'] = function (tag, value) {
	// Tag an object
	if (arguments.length === 1) return this[tag];
	this[tag] = value;
	return this;
};

// Helper for measuring fabric
$nippetry['📏'] = function (fabric) {
	return {
		lines: fabric.split('\n').length,
		chars: fabric.length,
		words: fabric.split(/\s+/).length,
	};
};

// ---------- Secret internal workshop utilities ----------
// These exist only for the workshop's inner workings!

// 🤫 Secret logging with emojis
$nippetry['🤐'] = function (emoji, message) {
	if ($nippetry['🔇']) return; // Silent mode
	console.log(emoji + ' ' + message);
};

// 🎲 Random selection utilities
$nippetry['🎰'] = {
	'🎯': function (array) {
		// Pick random item with emoji ceremony
		var index = Math.floor(Math.random() * array.length);
		$nippetry['🤐']('🎯', 'Selected item ' + index);
		return array[index];
	},
	'🎪': function (array, count) {
		// Shuffle and take N items
		var shuffled = $nippetry['🗂️']['🎲'](array);
		return shuffled.slice(0, count);
	},
};

// 🔮 Internal state inspection
$nippetry['🔮'] = {
	'👁️': function () {
		// Peek at workshop state
		return {
			fabrics: $nippetry['👘'].length || 0,
			patterns: $nippetry['🎨']['🏷️'].length || 0,
			connections: $nippetry['🧵']['🔗'].length || 0,
		};
	},
	'🩺': function () {
		// Health check of the workshop
		var issues = [];
		if (!$nippetry['👘']) issues.push('No wardrobe');
		if (!$nippetry['🎨']['🏷️']) issues.push('No color palette');
		return issues.length ? issues : '✨ Workshop healthy';
	},
};

// 🧙 Magic internal transformations
$nippetry['🧙'] = {
	'✨': function (fabric) {
		// Sprinkle magic dust (add invisible metadata)
		fabric['🪄'] = Date.now(); // Timestamp
		fabric['🌟'] = Math.random().toString(36).substr(2, 9); // Magic ID
		return fabric;
	},
	'🔀': function (items) {
		// Chaos shuffle with ritual
		$nippetry['🤐']('🔀', 'Invoking chaos...');
		var result = $nippetry['🗂️']['🎲'](items);
		$nippetry['🤐']('✨', 'Order restored');
		return result;
	},
};

// 🕵️ Debug utilities
$nippetry['🕵️'] = {
	'🔍': function (needle, haystack) {
		// Deep search with emoji breadcrumbs
		var found = [];
		function search(obj, path) {
			path = path || '';
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					var currentPath = path + '.' + key;
					if (key === needle || (obj[key] && obj[key].toString().includes(needle))) {
						found.push(currentPath);
					}
					if (typeof obj[key] === 'object' && obj[key] !== null) {
						search(obj[key], currentPath);
					}
				}
			}
		}
		search(haystack);
		$nippetry['🤐']('🔍', 'Found ' + found.length + ' matches');
		return found;
	},
};

// 🧹 Cleanup utilities
$nippetry['🧹'] = {
	'✨': function (snippets) {
		// Remove internal metadata before output
		return snippets.map(function (snippet) {
			var clean = Object.assign({}, snippet);
			delete clean['🪄']; // Timestamp
			delete clean['🌟']; // Magic ID
			delete clean['🏷️']; // Fabric type (already used internally)
			return clean;
		});
	},
};
