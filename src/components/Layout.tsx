interface LayoutProps {
    children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <header className="panel">Header</header>
            <div id="side-panel-left" className="panel">
                Left Side
            </div>
            {children}
            <div id="side-panel-right" className="panel">
                Right Side
            </div>
            <footer className="panel">Footer</footer>
        </>
    )
}

export default Layout
