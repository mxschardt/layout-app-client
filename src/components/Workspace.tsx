import React, { useCallback, useEffect, useState } from "react"
import Card from "./Card"
import useDimensions from "../hooks/useDimensions"

interface PostResponse {
    id: number,
    title: string
    // userId: number,
    // body: string,
}

interface WorkspaceProps {
    requestCards: (limit?: number, start?: number) => Promise<PostResponse[]>
}

const Workspace: React.FC<WorkspaceProps> = ({ requestCards }) => {
    const [ref, dimensions] = useDimensions()
    const [cards, setCards] = useState<PostResponse[]>([])
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
                const posts = await requestCards(limit, start)
                setCards([...cards, ...posts])
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
            {cards.map((card) => (
                <Card title={card.title} key={card.id} />
            ))}
        </div>
    )
}

export default Workspace
