// Ruby-style browser API for Opal
// Provides Ruby-friendly aliases for browser functions

const ExecutableComment = await fetch(
  '../../../../../snippets/executable_pseudocode.opal.rb',
).then((res) => res.text());

export const initializeBrowserAPI = () => {
  const rubyBrowserAPI = `
    ${ExecutableComment}

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

    def confirm?(msg)
      \`
      var result = confirm(#{msg});
      return result === true ? #{true} : #{false};
      \`
    end

    def puts(*args)
      output = args.join(" ")
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
  // Evaluate the Ruby code to define these methods globally
  if (window.Opal) {
    try {
      window.Opal.eval(rubyBrowserAPI);
    } catch (error) {
      console.error('Failed to initialize Ruby browser API:', error);
    }
  }
};
