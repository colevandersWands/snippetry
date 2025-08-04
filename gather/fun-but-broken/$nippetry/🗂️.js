// Filing cabinet for organization

import { $nippetry } from './💭.js';

$nippetry['🗂️'] = {
	'🔤': function (items, key) {
		// Alphabetical sort
		key = key || 'title';
		return items.slice().sort(function (a, b) {
			var aVal = typeof a === 'string' ? a : a[key];
			var bVal = typeof b === 'string' ? b : b[key];
			return aVal.toLowerCase().localeCompare(bVal.toLowerCase());
		});
	},

	'🔢': function (items, key) {
		// Numerical sort
		return items.slice().sort(function (a, b) {
			var aVal = key ? a[key] : a;
			var bVal = key ? b[key] : b;
			return aVal - bVal;
		});
	},

	'📅': function (items) {
		// Sort by date (if items have dates)
		return items.slice().sort(function (a, b) {
			// Try multiple date fields
			var aDate = a.date || a.modified || a.created || 0;
			var bDate = b.date || b.modified || b.created || 0;
			return new Date(bDate) - new Date(aDate);
		});
	},

	'🎲': function (items) {
		// Random shuffle
		var shuffled = items.slice();
		for (var i = shuffled.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}
		return shuffled;
	},

	'📊': function (items, groupBy) {
		// Group items into categories
		var groups = {};

		items.forEach(function (item) {
			var key = typeof groupBy === 'function' ? groupBy(item) : item[groupBy];
			groups[key] = groups[key] || [];
			groups[key].push(item);
		});

		return groups;
	},

	'🗄️': function (snippets) {
		// File snippets into drawers by type
		var cabinet = {};

		snippets.forEach(function (snippet) {
			var drawer = snippet['🏷️'] || snippet.title['🏷️']();
			cabinet[drawer] = cabinet[drawer] || [];
			cabinet[drawer].push(snippet);
		});

		return cabinet;
	},

	'🏷️': function (snippets) {
		// Organize by tags
		var tagged = {};

		snippets.forEach(function (snippet) {
			if (snippet.tags) {
				snippet.tags.forEach(function (tag) {
					tagged[tag] = tagged[tag] || [];
					tagged[tag].push(snippet.title);
				});
			}
		});

		return tagged;
	},

	'🌳': function (items, getParent) {
		// Build tree structure
		var tree = {};
		var orphans = [];

		items.forEach(function (item) {
			var parent = getParent(item);
			if (parent) {
				tree[parent] = tree[parent] || [];
				tree[parent].push(item);
			} else {
				orphans.push(item);
			}
		});

		return {
			tree: tree,
			roots: orphans,
		};
	},
};

// Hoisted organizing utilities
function createIndex(items, indexBy) {
	// Create searchable index
	var index = {};

	items.forEach(function (item, i) {
		var keys = typeof indexBy === 'function' ? indexBy(item) : [item[indexBy]];
		keys.forEach(function (key) {
			index[key] = index[key] || [];
			index[key].push(i);
		});
	});

	return {
		lookup: function (key) {
			return (index[key] || []).map(function (i) {
				return items[i];
			});
		},
		keys: Object.keys(index).sort(),
	};
}

function deduplicate(items, keyFn) {
	// Remove duplicates
	var seen = {};
	return items.filter(function (item) {
		var key = keyFn ? keyFn(item) : JSON.stringify(item);
		if (seen[key]) return false;
		seen[key] = true;
		return true;
	});
}

$nippetry['🗂️']['📇'] = createIndex;
$nippetry['🗂️']['🧹'] = deduplicate;
