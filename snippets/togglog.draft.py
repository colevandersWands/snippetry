# so you can add properties on functions?  why did I get an error before
# trying again without a class


def togglog(*args):
    if togglog.write:
        print(*args)


togglog.write = True
togglog(1, 2, 3)

togglog.write = False
togglog(4, 5, 6)

togglog.write = True
togglog(7, 8, 9)
