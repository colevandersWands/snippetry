class ExecutableComment < BasicObject
	def method_missing(*, &block)
		block ? instance_eval(&block) : self
	end                                                                   
end   

# --- wait, wat? ---

_ = ExecutableComment.new

_.This.curiosity.lets.you.write.any.chain.you.want.to do # within Ruby syntax
	Your.comments.will.be.executed, but.they["won't"].DO.anything
	Operators.are.now(kinna).like.punctuation { with.some.imagination }
	What.are.you.waiting.for?.  Execute.your.comments!
end

# tags: minibrary, coAIthored, DSL 
