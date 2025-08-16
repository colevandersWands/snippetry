// Ruby-style browser API for Opal
// Provides Ruby-friendly aliases for browser functions

export const browserGlobals = `
def ask(msg, placeholder)
  \`
  var result = prompt(#{msg}, #{placeholder} || undefined);
  return result === null ? #{nil} : result;
  \`
end

def say(msg)
  \`alert(#{msg})\`
  nil
end

def check?(msg)
  \`
  var result = confirm(#{msg});
  return result === true ? #{true} : #{false};
  \`
end

def puts(*args)
  output = args.join("\n")
  \`console.log(#{output})\`
  nil
end

def print(*args)
  output = args.join
  \`console.log(#{output})\`
  nil
end

def p(*args)
  args.each do |arg|
    \`console.log(#{arg.inspect})\`
  end
  args.length == 1 ? args[0] : args
end
`;
