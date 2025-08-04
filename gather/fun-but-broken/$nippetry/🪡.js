// Needle for stitching pieces together

import { $nippetry } from './💭.js';

$nippetry['🪡'] = {
	'🧵': async function (pieces) {
		// Basic stitch - combine pieces
		var garment = [];

		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];

			// Process through interpreters
			var fabricType = piece['🏷️'] || piece.title['🏷️']();
			if ($nippetry['🗄️'][fabricType]) {
				piece = await $nippetry['🗄️'][fabricType]['🪡'](piece);
			}

			garment.push(piece);
		}

		return garment;
	},

	'🪢': function (pieces) {
		// Cross-stitch - find connections between pieces
		pieces.forEach(function (piece, i) {
			piece.stitches = [];

			pieces.forEach(function (other, j) {
				if (i !== j && $nippetry['🧵']['🪢'](piece, other)) {
					piece.stitches.push(other.title);
				}
			});
		});

		return pieces;
	},

	'🕸️': function (pieces) {
		// Web stitch - create interconnected fabric
		var web = $nippetry['🧵']['🌐'](pieces);

		pieces.forEach(function (piece) {
			piece.warp = web[piece.title]['➡️']; // Outgoing
			piece.weft = web[piece.title]['⬅️']; // Incoming
		});

		return pieces;
	},

	'🎀': function (pieces) {
		// Decorative stitch - add metadata
		pieces.forEach(function (piece) {
			// Add measurements
			piece['📏'] = $nippetry['📏'](piece.text);

			// Add fabric grain
			piece.grain = detectGrain(piece.text);

			// Add decorative tags
			if (piece.title.includes('.draft')) {
				piece.tags = (piece.tags || []).concat(['draft']);
			}
			if (piece.title.includes('.sandbox')) {
				piece.tags = (piece.tags || []).concat(['sandbox']);
			}
		});

		return pieces;
	},

	'🔗': function (pieces) {
		// Chain stitch - link related pieces
		var chains = $nippetry['🧵']['🧶'](pieces);

		pieces.forEach(function (piece) {
			var baseName = piece.title.split('.')[0].toLowerCase();
			if (chains[baseName]) {
				piece.chain = chains[baseName]
					.map(function (p) {
						return p.title;
					})
					.filter(function (t) {
						return t !== piece.title;
					});
			}
		});

		return pieces;
	},
};

// Hoisted stitching utilities
function detectGrain(text) {
	// Detect the natural grain of the fabric
	if (text.match(/function|class|const|let|var/)) return 'code';
	if (text.match(/^#+ /m)) return 'markdown';
	if (text.match(/<[^>]+>/)) return 'markup';
	if (text.match(/^-{3,}$/m)) return 'structured';
	return 'plain';
}

function reinforceSeams(pieces) {
	// Double-check and strengthen connections
	pieces.forEach(function (piece) {
		// Ensure unique values in arrays
		if (piece.tags) piece.tags = piece.tags['🪢']();
		if (piece.stitches) piece.stitches = piece.stitches['🪢']();
		if (piece.chain) piece.chain = piece.chain['🪢']();
	});

	return pieces;
}

$nippetry['🪡']['💪'] = reinforceSeams;
