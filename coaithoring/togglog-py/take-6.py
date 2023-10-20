import traceback


def togglog(out=print, write=True, label=None, line=False):
    def log(*things):
        if write:
            logs = [*things]
            if label != None:
                logs.insert(0, label)
            if line != False:
                logs.insert(0, f"ln {str(list(traceback.walk_stack(None))[0][1])}:")
            out(*logs)
        return things[-1]

    def on():
        nonlocal write
        write = True
        print("onning", write)
        return log

    def off():
        nonlocal write
        write = False
        print("offing", write)
        return log

    log.log = log
    log.on = property(on)
    log.off = property(off)

    return log


_ = togglog(label="hi")

_(1, 2, 3)
_.off
_(4, 5, 6)
_.on
_(7, 8, 9)


# --- --- ---

# _.on.log(0, 1)
# _.off
# _(2)
# _.on
# _.log(3)
# _.label = None
# _.on.log(4)
# print(_.is)
# _.off.log(5)
# _(_.is)
# _.out = lambda *things: print("hoy", *things)
# _.toggle.on.off.log.toggle.log(6)
# _(_.log(7, 8))

# _.label = None
# _.out = print
# _("a")
# _.log("b")
# _.toggle.log("c")
# _.toggle.log("d")
