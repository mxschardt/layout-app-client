import React, { useCallback, useEffect, useState } from "react"
import Card from "./Card"
import useDimensions from "../hooks/useDimensions"
import LoadingIcon from "./LoadingIcon"

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
    // При загрузке элементов 
    const [isLoading, setLoading] = useState(false)
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
                const uri = `https://jsonplaceholder.typicode.com/posts/api/posts?_limit=${limit}&_start=${start}`
                const response = await fetch(uri)
                return await response.json()
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
            setLoading(true)
            fetchTitles(calcElementCount() - posts.length, posts.length).then(
                (newPosts) => {
                    setPosts([...posts, ...newPosts])
                    setLoading(false)
                }
            )
        }
    }, [calcElementCount()])

    return (
        <div id="workspace" ref={ref}>
            {posts.length !== 0 ? (
                posts.map((post) => <Card title={post.title} key={post.id} />)
            ) : isLoading ? (
                <LoadingIcon />
            ) : (
                <h1>Нет постов</h1>
            )}
        </div>
    )
}

export default Workspace
