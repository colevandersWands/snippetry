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

ExecutablePseudocode = PotemkinProgram

_ = PotemkinProgram


# tags: minibrary, coAIthored
# see: executable_pseudocode.rb
