fetch(
  'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv',
)
  .then((res) => res.text())
  .then((csv) =>
    csv
      .split('\n')
      .slice(1)
      .map((line) => line.split(',')[1])
      .join('\n'),
  )
  .then(console.log)
  .catch(console.error);
