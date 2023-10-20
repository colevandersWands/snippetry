# https://www.phind.com/agent?cache=clniqedea0003jn08eqh051go


def togglog(write=True, out=print, label=None):
    def log(*things):
        nonlocal write, out, label
        if label is not None:
            things = (label,) + things
        if write:
            out(*things)
        return things[-1]

    def on():
        nonlocal write
        write = True
        return log

    def off():
        nonlocal write
        write = False
        return log

    def toggle():
        nonlocal write
        write = not write
        return log

    def is_on():
        return "on" if write else "off"

    def set_out(new_out):
        nonlocal out
        out = new_out

    def set_label(new_label):
        nonlocal label
        label = new_label

    log.on = on
    log.off = off
    log.toggle = toggle
    log.is_on = is_on
    log.set_out = set_out
    log.set_label = set_label

    return log


_ = togglog(label="hi")

_.on().log(0, 1)
_.off()
_(2)
_.on()
_.log(3)
set_label(None)
_.on().log(4)
print(_.is_on())
_.off().log(5)
_(_.is_on())
_.set_out(lambda *things: print("hoy", *things))
_.toggle().on().off().log().toggle().log(6)
_(_.log(7, 8))

set_label(None)
set_out(print)
_("a")
_.log("b")
_.toggle().log("c")
_.toggle().log("d")
