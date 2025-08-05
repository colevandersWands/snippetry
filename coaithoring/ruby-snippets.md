# Ruby Snippets: The Dark Arts Collection

*Mind-bending Ruby concepts for the snippetry philosophy: 40(ish) lines of liberation*

## The Ruby Advantage

Ruby's "everything is an object" philosophy and metaprogramming capabilities make it perfect for snippetry's experimental approach. Unlike JavaScript's prototypal flexibility, Ruby gives us:

- **Open classes** - modify anything, even built-ins
- **method_missing** - catch undefined method calls for DSL magic  
- **Singleton methods** - give individual objects unique behaviors
- **const_missing** - intercept undefined constants
- **Method hooks** - track when methods are added/called
- **Eigenclasses** - the secret metaclass system
- **Everything's an object** - even classes have classes

## Snippetor's Original Concepts

From our conversation with the snippetor agent, here are the most mind-bending Ruby ideas:

### 1. The Quantum Superposition Variable
A variable that exists in multiple states until observed (collapses on inspection).

### 2. The Emotional Error System  
Exceptions that change mood based on how many times you try to rescue them.

### 3. The Probability-Based Boolean
Replace true/false with probabilistic outcomes - maybe it's true 70% of the time?

### 4. The Poetry DSL
Ruby that reads like verse, using method_missing to create natural language.

### 5. The Self-Modifying Fibonacci
Code that rewrites its own source file with memoized results.

### 6. The Time-Traveling Method
Methods that can see their future calls and past invocations.

### 7. The Living Comment
Comments that somehow execute as actual code.

### 8. The Metacircular Evaluator
Ruby implementing Ruby in Ruby (the ouroboros program).

### 9. The Negative Line Number Accessor
Access lines of code that haven't been written yet.

### 10. The Comment That Executes
Using Ruby's flexible parsing to make comments run.

---

## Ruby Snippet Drafts

### quantum-variable.rb
```ruby
# A variable that exists in multiple states until observed
module Quantum
  def self.superposition(*states)
    eigenclass = class << states; self; end
    eigenclass.define_method(:inspect) do
      # Collapse the superposition on observation
      @collapsed_state ||= sample
      define_singleton_method(:inspect) { @collapsed_state.inspect }
      define_singleton_method(:to_s) { @collapsed_state.to_s }
      @collapsed_state.inspect
    end
    
    eigenclass.define_method(:method_missing) do |method, *args, &block|
      @collapsed_state ||= sample
      @collapsed_state.send(method, *args, &block)
    end
    
    states
  end
end

# Usage examples:
schrödinger_cat = Quantum.superposition(:alive, :dead, :both, :neither)
puts schrödinger_cat  # Collapses to one state
puts schrödinger_cat  # Same state from now on

quantum_number = Quantum.superposition(1, 2, 3, 42, Math::PI)
puts quantum_number + 1  # Math works after collapse

# The observation changes everything
superposition_of_methods = Quantum.superposition(
  -> { "I am a lambda" },
  "I am a string", 
  42,
  Class.new { def to_s; "I am an object"; end }.new
)

puts superposition_of_methods  # What will it be?

# tags: metaprogramming, philosophy, quantum
```

### emotional-error.rb
```ruby
# Exceptions that adapt based on how you treat them
class EmotionalError < StandardError
  attr_reader :mood, :rescue_attempts
  
  MOODS = [:angry, :sad, :disappointed, :philosophical, :enlightened, :transcendent]
  
  def initialize(message, mood = :angry)
    super(message)
    @original_message = message
    @mood = mood
    @rescue_attempts = 0
  end
  
  def exception(*args)
    @rescue_attempts += 1
    @mood = MOODS[@rescue_attempts - 1] || :transcendent
    
    new_message = case @mood
    when :angry then "😡 #{@original_message}"
    when :sad then "😢 You keep trying to fix me, but I'm still broken..."
    when :disappointed then "😞 I thought you understood me by now"
    when :philosophical then "🤔 Is this exception real, or are we all just patterns in the void?"
    when :enlightened then "✨ I see now... the error was never in the code, but in our hearts"
    when :transcendent then "🌟 I have become one with the stack trace. Thank you for this journey."
    else "💫 I am beyond error and success now"
    end
    
    self.class.new(new_message, @mood)
  end
  
  def backtrace
    return super unless @mood == :philosophical
    [
      "In the beginning was the Word, and the Word was 'undefined'",
      "Is this stack trace, or are we just cosmic dust dreaming of execution?",
      "The real error was the friends we made along the way",
      *super
    ]
  end
end

# Usage:
begin
  raise EmotionalError.new("Something went wrong!")
rescue EmotionalError => e
  puts e.message
  
  begin
    raise e
  rescue EmotionalError => e2
    puts e2.message
    
    begin 
      raise e2
    rescue EmotionalError => e3
      puts e3.message  # Gets more philosophical each time
    end
  end
end

# tags: exceptions, psychology, humor
```

### maybe-boolean.rb
```ruby
# Probability-based boolean for non-deterministic programming
class Maybe < BasicObject
  def initialize(probability = 0.5)
    @probability = probability.clamp(0.0, 1.0)
  end
  
  # The magic: every time you check, it's a coin flip
  def method_missing(method, *args, &block)
    ::Kernel.rand < @probability
  end
  
  def !
    Maybe.new(1.0 - @probability)
  end
  
  def &(other)
    case other
    when Maybe then Maybe.new(@probability * other.probability)
    when true then self
    when false then Maybe.new(0.0)
    else ::Kernel.raise ::ArgumentError, "Cannot combine Maybe with #{other.class}"
    end
  end
  
  def |(other)
    case other
    when Maybe then Maybe.new(@probability + other.probability - (@probability * other.probability))
    when true then Maybe.new(1.0)
    when false then self
    else ::Kernel.raise ::ArgumentError, "Cannot combine Maybe with #{other.class}"
    end
  end
  
  protected
  attr_reader :probability
end

# Usage examples:
maybe = Maybe.new(0.7)  # 70% true

# Each check is independent
10.times { puts "Maybe true: #{maybe == true}" }

# Combine probabilities
definitely_not = !Maybe.new(1.0)  # 0% true
might_be = Maybe.new(0.3) | Maybe.new(0.4)  # Combined probability

# Non-deterministic control flow
if Maybe.new(0.8)
  puts "This happens 80% of the time"
else
  puts "This happens 20% of the time"
end

# Quantum programming
quantum_result = if Maybe.new(0.5)
  "Path A taken"
else
  "Path B taken"
end

puts quantum_result  # Schrödinger's string

# tags: probability, logic, quantum
```

### poetry-dsl.rb
```ruby
# A DSL that reads like poetry
class Poem
  def initialize
    @verses = []
    @current_verse = []
  end
  
  def method_missing(method, *args, &block)
    words = method.to_s.gsub('_', ' ')
    words += " #{args.join(' ')}" unless args.empty?
    @current_verse << words
    self
  end
  
  def and(*args)
    @current_verse << "and #{args.join(' ')}"
    self
  end
  
  def line_break
    @verses << @current_verse.join(' ')
    @current_verse = []
    self
  end
  
  def stanza_break
    line_break
    @verses << ""
    self
  end
  
  def to_s
    final_verses = @verses.dup
    final_verses << @current_verse.join(' ') unless @current_verse.empty?
    final_verses.join("\n")
  end
  
  def recite
    puts to_s
  end
end

def poem(&block)
  p = Poem.new
  p.instance_eval(&block) if block_given?
  p
end

# Usage:
my_poem = poem do
  the_moon.rises_over.silent_waters.line_break
  while_stars.dance_in.infinite_darkness.line_break
  my_code.dreams_of.electric_sheep.stanza_break
  
  in_the_space.between.keystrokes.line_break
  algorithms.whisper.ancient_secrets.line_break
  and "variables", "hold", "the", "breath", "of", "eternity"
end

my_poem.recite

# Or more existential:
existential_code = poem do
  what_is.a_function.but_a_prayer.to_the_machine.line_break
  do_we.return_values.or_do.values.return_us.line_break
  in_the_recursive.depths.line_break
  turtles_swim.all_the_way.down
end

existential_code.recite

# tags: dsl, poetry, metaprogramming
```

### self-modifying-fib.rb
```ruby
# Fibonacci that rewrites its own source
def fibonacci(n)
  return n if n <= 1
  # This line will be replaced with memoization
  fibonacci(n-1) + fibonacci(n-2)
end

# Self-modification at exit
at_exit do
  # Calculate first 20 fibonacci numbers
  results = (0...20).map { |i| [i, fibonacci(i)] }.to_h
  
  # Read our own source
  source = File.read(__FILE__)
  
  # Replace the recursive call with memoized lookup
  memoized_line = "  return #{results}[n] if n < 20 # Memoized at #{Time.now}"
  new_source = source.gsub(
    /  # This line will be replaced with memoization.*\n.*fibonacci\(n-1\) \+ fibonacci\(n-2\)/m,
    memoized_line + "\n  fibonacci(n-1) + fibonacci(n-2) # Fallback for n >= 20"
  )
  
  # Write the modified version back (be careful!)
  if source != new_source
    puts "🔮 Self-modifying... fibonacci sequence learned!"
    File.write(__FILE__, new_source)
  end
end

# Test it
puts "fib(10) = #{fibonacci(10)}"
puts "fib(15) = #{fibonacci(15)}"

# Run this file twice - the second time will be faster!
# The source code literally changes itself

# tags: self-modification, fibonacci, time-travel
```

### living-comment.rb
```ruby
# Comments that execute (warning: dark magic ahead)
=begin
This is not just a comment.
It's a dormant spell waiting to awaken.
=end

# Hack const_missing to catch our magic constant
def Object.const_missing(const_name)
  if const_name == :begin
    # Return an object that responds to == with code execution
    Class.new do
      def self.==(other)
        # Extract the code between =begin and =end
        code_match = other.to_s.match(/=begin\n(.*?)\n=end/m)
        if code_match
          # Execute the "comment" as Ruby code
          eval(code_match[1])
        end
        true  # Always return true to satisfy the comparison
      end
    end.new
  else
    super
  end
end

# Usage examples:
=begin
puts "Hello from inside a comment!"
x = 2 + 2
puts "Math still works: #{x}"
=end

=begin
class CommentClass
  def speak
    puts "I exist only in comments!"
  end
end

CommentClass.new.speak
=end

=begin
# Even nested comments work
def comment_function
  "Functions in comments!"
end

puts comment_function
=end

# Alternative approach using heredocs:
comment_code = <<~LIVING_COMMENT
  puts "This looks like a comment but executes!"
  fibonacci = ->(n) { n <= 1 ? n : fibonacci[n-1] + fibonacci[n-2] }
  puts "Fibonacci in a comment: #{fibonacci[8]}"
LIVING_COMMENT

eval comment_code

# tags: dark-magic, comments, metaprogramming
```

---

## Implementation Notes

These snippets showcase Ruby's unique capabilities:

1. **Eigenclasses/Singleton Methods** - Individual objects get custom behavior
2. **method_missing** - Catch undefined methods for DSL magic
3. **const_missing** - Intercept undefined constants  
4. **File I/O** - Programs that modify themselves
5. **Metaprogramming** - Define methods on the fly
6. **Flexible Syntax** - Ruby's parser allows creative interpretations

Each snippet is philosophically interesting while demonstrating real Ruby features that don't exist in other languages.

## Next Steps

1. Test these snippets for correctness
2. Refine the most interesting ones
3. Add more mind-bending concepts
4. Create variations and combinations
5. Document the Ruby features being demonstrated

The goal is to show Ruby's unique expressiveness while staying true to the snippetry philosophy of being "complete enough to run, small enough to understand, connected enough to inspire."

// tags: coAIthored, ruby, metaprogramming, philosophy