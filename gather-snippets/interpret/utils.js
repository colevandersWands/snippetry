const isURL = new RegExp('^(?:[a-z+]+:)?//', 'i');
export const isRelative = (link = '') => !isURL.test(link);

export const lang = (title = '') => title.split('.').pop();
export const ext = (title = '') => '.' + lang(title);
export const name = (title = '') => title.slice(0, title.length - ext(title).length);

export const staticLabels = ({
  text = '',
  label = 'tags',
  begin = new RegExp(`/(\(|\/\/|<!\-\-|\/\*|\#)[\s]*(${label})[\s]*:/`, 'gi'),
  end = /(|\-\-\>|\*\/|\)|)/gi,
}) =>
  Array.from(
    new Set(
      text
        .split('\n')
        .filter((line) => line.match(begin))
        .map((line) => line.replaceAll(begin, '').replaceAll(end, ''))
        .flatMap((line) => line.split(','))
        .map((tag) => tag.trim().toLowerCase())
        .sort(),
    ),
  );
