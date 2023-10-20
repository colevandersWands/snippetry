# original not-coaithored. it's instance does not double as a log function

import traceback


class Togglog:
    def __init__(self, out=print, write=True, label=None, line=False):
        self.out = out
        self.write = write
        self.label = label
        self.line = line

    def __getattr__(self, key):
        if key == "on":
            self.write = True
        elif key == "off":
            self.write = False
        elif key == "toggle":
            self.write = not self.write
        return self

    def log(self, *rest):
        if self.write:
            logs = [*rest]
            if self.label != None:
                logs.insert(0, self.label)
            if self.line != False:
                logs.insert(0, f"ln {str(list(traceback.walk_stack(None))[0][1])}:")
            self.out(*logs)
        return rest[-1]


# tags: minibrary
