import { RefObject, useCallback, useLayoutEffect, useRef, useState } from "react"

interface Size {
    width: number
    height: number
}

// TODO: Сделать дженериком
function useDimensions(): [
    RefObject<HTMLDivElement> | null,
    Size
] {
    const ref = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    useLayoutEffect(() => {
        if (ref.current) {
            setDimensions({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            })
        }
    }, [])

    const handleSize = useCallback(() => {
        if (ref.current) {
            setDimensions({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            })
        }
    }, [ref?.current?.offsetHeight, ref?.current?.offsetWidth])

    addEventListener("resize", handleSize)

    return [ref, dimensions]
}

export default useDimensions
