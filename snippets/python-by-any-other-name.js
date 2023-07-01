def fib(n):
  if n == 1 or n == 0:
    return n
  else:
    return fib(n-2) + fib(n - 1)

print(fib(10))
