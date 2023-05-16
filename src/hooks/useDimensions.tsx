import { RefObject, useCallback, useLayoutEffect, useRef, useState } from "react"

interface Size {
    width: number
    height: number
}

function useDimensions<T extends HTMLElement = HTMLDivElement>(): [
    RefObject<T> | null,
    Size
] {
    const ref = useRef<T>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    
    useLayoutEffect(() => {
        if (ref.current) {
            setDimensions({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            })
        }
    }, [])

    // Стараемся избежать слишком большого количества рендеров 
    // с помощью useCallback
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
