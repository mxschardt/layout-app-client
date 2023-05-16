import React, { useCallback, useEffect, useState } from "react"
import Card from "./Card"
import useDimensions from "../hooks/useDimensions"

interface PostResponse {
    id: number
    title: string
    // userId: number,
    // body: string,
}

const Workspace: React.FC = () => {
    // Используем хук, чтобы следить за размерами компонента
    const [ref, dimensions] = useDimensions()
    // Массив постов, получаемых с сервера
    const [posts, setPosts] = useState<PostResponse[]>([])
    // Стандартные значения размеров плашки.
    // Используются в расчетах количества элементов,
    // которые смогут поместиться на экране
    const defaultCard = { width: 150, height: 100, gap: 30 }

    // Импорт размеров плашки из CSS стилей
    const getCardSizeFromStyles = () => {
        if (ref?.current) {
            const computedStyles = window.getComputedStyle(ref.current)
            const width = computedStyles.getPropertyValue("--card-width")
            const height = computedStyles.getPropertyValue("--card-height")
            const gap = computedStyles.getPropertyValue("--gap")

            if (width !== "" && height !== "" && gap !== "") {
                return {
                    width: parseFloat(width),
                    height: parseFloat(height),
                    gap: parseFloat(gap),
                }
            }
        }
        // Если не удалось получить значения, возвращаем null
        return null
    }

    // Считает количество элементов, которые поместятся в компонент
    const calcElementCount = () => {
        const { width, height, gap } = getCardSizeFromStyles() ?? defaultCard
        const columns = Math.floor(dimensions.width / (width + gap))
        const rows = Math.round(dimensions.height / (height + gap))
        return columns * rows
    }

    // Запрашивает посты и добавляет их в массив постов
    const fetchTitles = useCallback(
        async (limit: number, start = 0) => {
            try {
                const uri = `/api/posts?limit=${limit}&start=${start}`
                const response = await fetch(uri)
                const new_posts = await response.json()
                setPosts([...posts, ...new_posts])
            } catch (err) {
                console.error(err)
            }
        },
        [calcElementCount]
    )

    // Запрашиваем новые элементы когда количество карточек меньше,
    // чем количество элементов, которые могут поместиться на экране.
    // Вызывается только если поменялась вместимость компонента
    useEffect(() => {
        if (posts.length < calcElementCount()) {
            fetchTitles(calcElementCount() - posts.length, posts.length)
        }
    }, [calcElementCount()])

    return (
        <div id="workspace" ref={ref}>
            {posts.map((post) => (
                <Card title={post.title} key={post.id} />
            ))}
        </div>
    )
}

export default Workspace
