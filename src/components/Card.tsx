interface CardProps {
    title: string
}

const Card: React.FC<CardProps> = ({ title }) => {
    return (
        <div className="card">
            <span>{title}</span>
        </div>
    )
}

export default Card
