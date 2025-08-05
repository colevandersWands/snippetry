module _
  # Define all operators to return the module for chaining
  %i[+ - * / % ** == != > < >= <= <=> & | ^ ~ << >> [] []= =~ !~ +@ -@].each do |op|
    define_singleton_method(op) { |*| _ }
  end
  
  def self.method_missing(*, &block)
    block ? module_eval(&block) : _
  end
end

# --- wait, wat? ---

_.This.curiosity.lets.you.write.any.chain.you.want.to do # within Ruby syntax
  Your.comments.will.be.executed, but.they["won't"].DO.anything
  Operators.are.now(kinna).like.punctuation { with.some.imagination }
  What.are.you.waiting.for?  Execute.your.comments!
end

# tags: minibrary, coAIthored, DSL
