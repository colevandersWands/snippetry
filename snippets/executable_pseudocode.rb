module PotemkinProgram
  BasicObject.instance_methods.each do |name|
    define_singleton_method(name) { |*| PotemkinProgram }
  end

  Object.instance_methods.each do |name|
    define_singleton_method(name) { |*| PotemkinProgram }
  end
  
  Kernel.instance_methods.each do |name|
    define_singleton_method(name) { |*| PotemkinProgram }
  end
  
  def self.respond_to_missing?(name, include_private = false)
    PotemkinProgram
  end
    
  def self.method_missing(*, &block)
    block ? module_eval(&block) : PotemkinProgram
  end

  def self.const_missing(name) PotemkinProgram end
  
  def self.call(&block)
    block ? module_eval(&block) : PotemkinProgram
  end
  
  def self.each(&block)
    block ? block.call(PotemkinProgram) : PotemkinProgram
  end
  
  def self.times(&block)
    block ? block.call(PotemkinProgram) : PotemkinProgram  
  end
end

def PotemkinProgram(*args, &block) ::PotemkinProgram end


_ = PotemkinProgram



# --- wait, wat? ---

_.This.curiosity.lets.you.write.any.chain.you.want
_.Your.comments.will.be.executed; _.but.they.wont.DO.anything
_.even.function.calls.work.call.apply.instance_eval.public_send(_)

_.can do everything
  becomes.chainable.including.CONSTANTS.FALSE.TRUE.nil
  self.class.inspect.to_s.hash.freeze.dup.clone
  _.Array.Hash.String.Object.Module.Class.BasicObject
  
  blocks do also.work.inside.nested.blocks { recursively..forever } end
  crazy[42]["nested"]["access"][0..10].first.last
  
  logical && operators || all == _.return <= self >= too
  bitwise | _.and & xor ^ shift << 2 >> 1
  arithmetic + works - too * with / variables ** everywhere
  ternary ? works : too

  _.for.each { |item| item.chains.too }
  semit.times { |n| n.also.works }
end

_.What.are.you.waiting.for?;  _.Execute.your.comments()


# tags: minibrary, coAIthored, DSL
