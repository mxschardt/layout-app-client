import React, { useCallback, useEffect, useState } from "react"
import Card from "./Card"
import useDimensions from "../hooks/useDimensions"

interface PostResponse {
    id: number
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
    const defaultCard = { width: 150, height: 100, gap: 30}

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

    const calcElementCount = () => {
        const { width, height, gap } = getCardSizeFromStyles() ?? defaultCard
        const columns = Math.floor(dimensions.width / (width + gap))
        const rows = Math.round(dimensions.height / (height + gap))
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
