// Thread for connecting pieces

import { $nippetry } from './💭.js';

$nippetry['🧵'] = {
	'🔗': [], // Store all links

	'🕸️': function (from, to, type) {
		// Create a web of connections
		$nippetry['🧵']['🔗'].push({
			from: from,
			to: to,
			type: type || 'link',
		});
	},

	'🪢': function (snippet1, snippet2) {
		// Knot two snippets together
		var baseName1 = snippet1.title.split('.')[0].toLowerCase();
		var baseName2 = snippet2.title.split('.')[0].toLowerCase();

		return baseName1 === baseName2;
	},

	'🌐': function (snippets) {
		// Build complete web of connections
		var web = {};

		snippets.forEach(function (snippet) {
			web[snippet.title] = {
				'➡️': [], // Outgoing
				'⬅️': [], // Incoming
			};
		});

		// Process all link types
		snippets.forEach(function (snippet) {
			// Forelinks
			if (snippet.forelinks) {
				snippet.forelinks.forEach(function (target) {
					web[snippet.title]['➡️'].push(target);
					if (web[target]) {
						web[target]['⬅️'].push(snippet.title);
					}
					$nippetry['🧵']['🕸️'](snippet.title, target, 'forelink');
				});
			}

			// Tags
			if (snippet.tags) {
				snippet.tags.forEach(function (tag) {
					$nippetry['🧵']['🕸️'](snippet.title, tag, 'tag');
				});
			}
		});

		return web;
	},

	'🎣': function (snippets, hook) {
		// Fish for connections using a hook pattern
		var caught = [];

		snippets.forEach(function (snippet) {
			var connections = hook(snippet);
			if (connections && connections.length) {
				caught.push({
					bait: snippet.title,
					fish: connections,
				});
			}
		});

		return caught;
	},

	'🧶': function (snippets) {
		// Ball up related snippets
		var balls = {};

		snippets.forEach(function (snippet) {
			var baseName = snippet.title.split('.')[0].toLowerCase();
			balls[baseName] = balls[baseName] || [];
			balls[baseName].push(snippet);
		});

		// Only keep balls with multiple threads
		for (var ball in balls) {
			if (balls[ball].length < 2) {
				delete balls[ball];
			}
		}

		return balls;
	},
};

// Hoisted connection utilities
function traceThread(start, web, maxDepth) {
	// Follow a thread through the web
	maxDepth = maxDepth || 3;
	var visited = {};
	var path = [];

	function follow(node, depth) {
		if (depth > maxDepth || visited[node]) return;

		visited[node] = true;
		path.push(node);

		if (web[node] && web[node]['➡️']) {
			web[node]['➡️'].forEach(function (next) {
				follow(next, depth + 1);
			});
		}
	}

	follow(start, 0);
	return path;
}

$nippetry['🧵']['🧭'] = traceThread;

// ---------- Secret threading mysteries ----------

// 🕸️ The web whisperer (internal only)
$nippetry['🧵']['🕷️'] = function (web) {
	// Count all the secret patterns in the web
	var secrets = {
		orphans: 0, // nodes with no connections
		loops: 0, // circular references
		clusters: 0, // tightly connected groups
		bridges: 0, // critical connection points
	};

	for (var node in web) {
		var connections = (web[node]['➡️'] || []).length + (web[node]['⬅️'] || []).length;
		if (connections === 0) secrets.orphans++;
		if (connections > 5) secrets.clusters++;
	}

	$nippetry['🤐']('🕷️', 'Web has ' + secrets.orphans + ' orphans');
	return secrets;
};

// 🌀 Tangle detector (for debugging knots)
$nippetry['🧵']['🌀'] = function (threads) {
	// Find where threads get tangled
	var tangles = [];
	threads.forEach(function (thread, i) {
		threads.forEach(function (other, j) {
			if (i !== j && thread.from === other.to && thread.to === other.from) {
				tangles.push([i, j]);
			}
		});
	});

	if (tangles.length) {
		$nippetry['🤐']('🌀', 'Found ' + tangles.length + ' tangles!');
	}
	return tangles;
};
