# https://www.phind.com/agent?cache=clnipjqei001gl809x63032n2

class Togglog:
    def __init__(self, label=None):
        self.label = label
        self.state = "off"
        self.logs = []

    def on(self):
        self.state = "on"
        return self

    def off(self):
        self.state = "off"
        return self

    def log(self, *args):
        if self.state == "on":
            self.logs.extend(args)
        return self

    def toggle(self):
        if self.state == "on":
            self.state = "off"
        else:
            self.state = "on"
        return self

    def __call__(self, *args):
        return self.log(*args)

    def __getattr__(self, attr):
        if attr == "is":
            return self.state
        elif attr == "out":
            return print
        else:
            return self

    def __setattr__(self, attr, value):
        if attr == "label":
            self.__dict__[attr] = value
        else:
            raise AttributeError("Cannot set attribute")


_ = Togglog(label="hi")

_.on().log(0, 1)
_.off()
_(2)
_.on()
_.log(3)
_.label = None
_.on().log(4)
# print(_.is) # 'on'
_.off().log(5)
# _(_.is)
_.out = lambda *things: print("hoy", *things)
_.toggle().on().off().log().toggle().log(6)
_(_.log(7, 8))

_.label = None
_.out = print
_("a")
_.log("b")
_.toggle().log("c")
_.toggle().log("d")
