while True:
    try:
        print(eval(input(f"\nYOLO: ")))
        break
    except Exception as ex:
        print(type(ex).__name__ + ":", ex)

# tags: yolo
