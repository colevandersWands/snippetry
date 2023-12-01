#!/bin/bash

while true
do
  echo "Please enter a word: "
  read user_input

  if [[ $user_input == "cat" ]]
  then
     echo "You entered 'cat'."
     break
  else
     echo "You did not enter 'cat'. Please try again."
  fi
done

# https://www.phind.com/search?cache=y5nukf5jxmxmw0mjz5brvdq7

# tags:  coAIthored
