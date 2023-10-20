# https://www.phind.com/agent?cache=clniqedea0003jn08eqh051go


class Togglog:
    def __init__(self, write=True, out=print, label=None):
        self.write = write
        self.out = out
        self.label = label

    def log(self, *things):
        if self.label is not None:
            things = (self.label,) + things
        if self.write:
            self.out(*things)
        return things[-1]

    @property
    def on(self):
        self.write = True
        return self.log

    @property
    def off(self):
        self.write = False
        return self.log

    @property
    def toggle(self):
        self.write = not self.write
        return self.log

    @property
    def is_on(self):
        return 'on' if self.write else 'off'

    @property
    def set_out(self, new_out):
        self.out = new_out

    @property
    def set_label(self, new_label):
        self.label = new_label


_ = Togglog(label='hi')

_.on.log(0, 1)
_.off
_(2)
_.on
_.log(3)
_.set_label = None
_.on.log(4)
print(_.is_on)
_.off.log(5)
_(_.is_on)
_.set_out = lambda *things: print('hoy', *things)
_.toggle.on.off.log.toggle.log(6)
_(_.log(7, 8))

_.set_label = None
_.set_out = print
_('a')
_.log('b')
_.toggle.log('c')
_.toggle.log('d')
