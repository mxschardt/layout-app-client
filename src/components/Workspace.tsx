import React, { useCallback, useEffect, useState } from "react"
import Card from "./Card"
import useDimensions from "../hooks/useDimensions"

const Workspace: React.FC = () => {
    const [ref, dimensions] = useDimensions()
    const [cards, setCards] = useState<{ title: string }[]>([])
    const eWidth = 150
    const eHeight = 100
    const gap = 30

    const calcElementCount = () => {
        const columns = Math.floor(dimensions.width / (eWidth + gap))
        const rows = Math.round(dimensions.height / (eHeight + gap))
        return columns * rows
    }

    const fetchTitles = useCallback(
        async (limit: number, start = 0) => {
            try {
                const uri = `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`
                const response = await fetch(uri)
                const posts = await response.json()
                const titles = posts.map(({ title }: { title: string }) => ({
                    title,
                }))
                setCards([...cards, ...titles])
            } catch (err) {
                console.error(err)
            }
        },
        [calcElementCount]
    )

    useEffect(() => {
        if (cards.length < calcElementCount()) {
            fetchTitles(calcElementCount() - cards.length, cards.length)
        }
    }, [calcElementCount()])

    return (
        <div id="workspace" ref={ref}>
            {cards.map((card, i) => (
                <Card title={card.title} key={i} />
            ))}
        </div>
    )
}

export default Workspace
