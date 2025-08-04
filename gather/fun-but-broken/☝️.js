//    🧵 The Grand Tailoring 🧵
//  From raw fabric to finished garments
//    Through emoji methods only!

// Open the workshop
import { $nippetry } from './$nippetry/☝️.js';

import { PATHS } from '../../PATHS.js';

// ---------- the workshop opens ----------

var collection = await tailor();

console.log('💾 Storing the collection...');

// Package and store each piece
await Promise.all([
	$nippetry['💾']['💿'](collection.snippets, PATHS.publicSnippets),
	$nippetry['💾']['💿'](collection.tags, PATHS.publicTags),
	$nippetry['💾']['💿'](collection.links, PATHS.publicLinks),
	$nippetry['💾']['💿'](collection.langs, PATHS.publicLangs),
	$nippetry['💾']['💿'](collection.comments, PATHS.publicComments),
	$nippetry['💾']['💿'](collection.snips, PATHS.publicSnips),
]);

console.log('🎀 Workshop complete! All garments stored.');

// ---------- the main tailoring process ----------

async function tailor() {
	console.log('✂️ Opening the workshop...');

	// Read the fabric from storage
	var rawSnippets = await $nippetry['📖']['📚'](PATHS.snippets);
	var rawComments = await $nippetry['📖']['📚'](PATHS.comments);
	var rawSnips = await $nippetry['📖']['📰'](PATHS.snips);

	console.log('📏 Measuring ' + rawSnippets.length + ' swatches...');

	// Cut each piece to size (with secret ritual)
	var cutPieces = rawSnippets['🎨'](function (swatch) {
		// Apply magic dust before cutting
		$nippetry['🧙']['✨'](swatch);

		// Use dramatic scissors for special pieces
		if (swatch.title.includes('turtle') || Math.random() < 0.1) {
			$nippetry['🤐']('🖋️', 'Applying theatrical treatment to ' + swatch.title);
			return $nippetry['✂️']['🖋️'](swatch);
		}

		return $nippetry['✂️']['📏'](swatch, 40);
	});

	// Secret health check
	$nippetry['🤐']('🩺', $nippetry['🔮']['🩺']());

	// Process through interpreters
	var processedPieces = await $nippetry['🪡']['🧵'](cutPieces);

	// Apply colors and patterns
	var coloredPieces = $nippetry['🎨']['🎯'](processedPieces);

	// Stitch connections together
	var stitchedPieces = $nippetry['🪡']['🕸️'](coloredPieces);

	// Secret web analysis
	var webSecrets = $nippetry['🧵']['🕷️']($nippetry['🧵']['🌐'](stitchedPieces));
	$nippetry['🤐']('🕸️', 'Web analysis: ' + JSON.stringify(webSecrets));

	// Check for tangles
	$nippetry['🧵']['🌀']($nippetry['🧵']['🔗']);

	// Organize the wardrobe
	var wardrobe = $nippetry['🗂️']['🗄️'](stitchedPieces);

	// Hang in closet
	$nippetry['👘'] = stitchedPieces;

	console.log('📐 Found ' + $nippetry['🎨']['🏷️'].length + ' patterns');
	console.log('🧵 Wove ' + $nippetry['🧵']['🔗'].length + ' connections');

	return {
		snippets: $nippetry['🧹']['✨']($nippetry['👘']),
		tags: $nippetry['🎨']['🏷️'],
		links: $nippetry['🧵']['🔗'],
		langs: Object.keys(wardrobe).sort(),
		comments: rawComments,
		snips: rawSnips,
	};
}
