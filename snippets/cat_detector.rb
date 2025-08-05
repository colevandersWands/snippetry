begin
  maybe_cat = ask 'please enter "cat"'
end while maybe_cat.nil?

say (if maybe_cat == 'cat'
      'thank you for the cat'
    else
      "\"#{maybe_cat}\" is not a cat"
    end)
