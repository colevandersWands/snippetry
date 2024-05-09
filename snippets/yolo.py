def shipit(motto=""):
    try:
        print(eval(input(f"\n{motto}: ")))
    except Exception as ex:
        print(type(ex).__name__ + ":", ex)
        shipit(motto)


shipit("YOLO")

# tags: yolo
