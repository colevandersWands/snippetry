# --- printing ---

print :print

# --- blocks ---

1 do |thing|
	print thing
end

1 do |thing| print thing end

# higher precedence
{ |thing|
	print thing
}

{ |thing| print thing }