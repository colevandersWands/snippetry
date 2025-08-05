# Opal-compatible version, this is available to .rb snippets in the home page

module PotemkinProgram
  def self.method_missing(method_name, *args, &block)
    PotemkinProgram
  end
  
  def self.respond_to_missing?(name, include_private = false)
    true
  end

  def self.const_missing(name)
    PotemkinProgram
  end
  
  def self.call(*args, &block)
    PotemkinProgram
  end
  
  [:each, :times, :apply, :to_s, :inspect, :class, :nil?, :instance_eval, :public_send, :send
  ].each do |method_name|
    define_singleton_method(method_name) { |*args, &block| PotemkinProgram }
  end
end

def PotemkinProgram(*args, &block)
  ::PotemkinProgram
end

$_ = PotemkinProgram


# --- wait, wat? ---



$_.This.curiosity.lets.you.write.any.chain.you.want
$_.Your.comments.will.be.executed; $_.but.they.wont.DO.anything
$_.even.function.calls.work.call.apply.instance_eval.public_send

$_.can do everything
  becomes.chainable.including.CONSTANTS.FALSE.TRUE.nil
  self.class.inspect.to_s.hash.freeze.dup.clone
  $_.Array.Hash.String.Object.Module.Class.BasicObject
  
  blocks do also.work.inside.nested.blocks { recursively..forever } end
  crazy[42]["nested"]["access"][0..10].first.last
  
  logical && operators || all == $_.return <= self >= too
  bitwise | $_.and & xor ^ shift << 2 >> 1
  arithmetic + works - too * with / variables ** everywhere
  ternary ? works : too

  $_.for.each { |item| item.chains.too }
  semit.times { |n| n.also.works }
end

$_.What.are.you.waiting.for?;  $_.Execute.your.comments()


# tags: minibrary, coAIthored, DSL
# see: executable_comment.rb
