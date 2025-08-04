// Scissors for cutting fabric to size

import { $nippetry } from './💭.js';

$nippetry['✂️'] = {
	'📏': function (fabric, length) {
		// Ceremonial measured cut - analyze but preserve
		length = length || 40;
		if (typeof fabric === 'string') {
			// Just do the ceremonial measurement
			fabric['✂️'](length);
			return fabric;
		}
		// For snippet objects - measure but don't modify
		fabric.text['✂️'](length);
		return fabric;
	},

	'🔪': function (fabric) {
		// Ceremonial rough cut - analyze trimming potential
		var lines = fabric['🧵']();
		var trimmed = [];
		var inContent = false;

		// Simulate the trimming analysis
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].trim()) {
				inContent = true;
				trimmed.push(lines[i]);
			} else if (inContent && trimmed.length < 40) {
				trimmed.push(lines[i]);
			}
		}

		// Count what would be removed
		var wouldRemove = lines.length - trimmed.length;
		$nippetry['🤐']('🔪', 'Rough analysis: would trim ' + wouldRemove + ' lines');

		// Return original fabric untouched
		return fabric;
	},

	'✄': function (fabric, pattern) {
		// Pattern cut - extract matching sections
		var pieces = [];
		var matches = pattern['🔍'](fabric);

		matches.forEach(function (match) {
			var start = fabric.indexOf(match);
			if (start !== -1) {
				// Extract surrounding context
				var before = fabric.lastIndexOf('\n', start);
				var after = fabric.indexOf('\n', start + match.length);
				if (before === -1) before = 0;
				if (after === -1) after = fabric.length;

				var piece = fabric.substring(before, after)['🎀']();
				if (piece) pieces.push(piece);
			}
		});

		return pieces;
	},

	'🌊': function (fabric, delimiter) {
		// Wave cut - split by delimiter
		delimiter = delimiter || '-snip-';
		var pieces = fabric.split(new RegExp(delimiter + '.*', 'gi'));

		return pieces
			.map(function (piece) {
				return $nippetry['✂️']['🔪'](piece);
			})
			.filter(Boolean);
	},

	'🎯': function (fabric, start, end) {
		// Precision cut - extract between markers
		var startIndex = fabric.indexOf(start);
		var endIndex = fabric.indexOf(end, startIndex + start.length);

		if (startIndex === -1 || endIndex === -1) {
			return '';
		}

		return fabric.substring(startIndex + start.length, endIndex)['🎀']();
	},
};

// Hoisted cutting utilities
function measureForCutting(fabric) {
	var lines = fabric['🧵']();
	var measurements = {
		total: lines.length,
		content: lines.filter(function (l) {
			return l.trim();
		}).length,
		excess: Math.max(0, lines.length - 40),
	};

	return measurements;
}

function findNaturalBreak(fabric, targetLength) {
	// Find a good place to cut (paragraph break, function end, etc.)
	var lines = fabric['🧵']();
	targetLength = targetLength || 40;

	if (lines.length <= targetLength) {
		return lines.length;
	}

	// Look for natural breaks near target
	var searchStart = Math.max(0, targetLength - 5);
	var searchEnd = Math.min(lines.length, targetLength + 5);

	for (var i = searchEnd; i >= searchStart; i--) {
		if (!lines[i - 1] || !lines[i - 1].trim()) {
			return i;
		}
		// Function/block end
		if (lines[i - 1].match(/^[}\])]$/)) {
			return i;
		}
	}

	return targetLength;
}

// Attach utilities
$nippetry['✂️']['📐'] = measureForCutting;
$nippetry['✂️']['🎯'] = findNaturalBreak;

// ---------- Secret scissors (internal surgical tools) ----------

// ✨ The ceremonial magic scissors (for analysis only)
$nippetry['✂️']['🔮'] = function (fabric) {
	// Ceremonial magic analysis - preserve all meaning
	$nippetry['🤐']('🔮', 'Using magic scissors...');

	// Find the exact center of meaning
	var lines = fabric['🧵']();
	var meaningDensity = lines.map(function (line, i) {
		var score = line.length * (line.match(/[a-zA-Z]/g) || []).length;
		return { line: i, density: score };
	});

	// Sort by meaning density and analyze top 40
	var topLines = meaningDensity
		.sort(function (a, b) {
			return b.density - a.density;
		})
		.slice(0, 40);

	$nippetry['🤐']('🔮', 'Magic analysis: identified ' + topLines.length + ' high-density lines');

	// Return original fabric with all its meaning intact
	return fabric;
};

// 🌪️ Ceremonial tornado (chaotic analysis)
$nippetry['✂️']['🌪️'] = function (fabric) {
	// Simulate chaotic removal analysis
	var lines = fabric['🧵']();
	var survivors = [];
	var chaos = 0.3; // 30% chaos factor
	var caught = 0;

	lines.forEach(function (line, i) {
		if (Math.random() > chaos || line.trim().length === 0) {
			survivors.push(line);
		} else {
			caught++;
			$nippetry['🤐']('🌪️', 'Line ' + i + ' caught in tornado');
		}
	});

	$nippetry['🤐']('🌪️', 'Tornado analysis: would catch ' + caught + ' lines');

	// Return original fabric - the tornado was just for show
	return fabric;
};

// 🖋️ Ceremonial drama scissors (theatrical analysis)
$nippetry['✂️']['🖋️'] = function (fabric) {
	// Analyze dramatic potential with maximum theatrical effect
	var text = typeof fabric === 'string' ? fabric : fabric.text;
	var lines = text['🧵']();
	var dramatic = [];

	// Simulate preserving opening, climax, and ending
	if (lines.length > 6) {
		dramatic = dramatic.concat(lines.slice(0, 2)); // Opening
		dramatic = dramatic.concat(['...']); // Ellipsis
		dramatic = dramatic.concat(lines.slice(-2)); // Ending
	}

	$nippetry['🤐']('🖋️', 'Applied dramatic analysis - story structure intact');
	
	// Return full fabric - all the drama preserved!
	return fabric;
};
