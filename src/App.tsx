import Workspace from "./components/Workspace"
import Layout from "./components/Layout"
import "/styles/layout.css"
import "/styles/workspace.css"
import "/styles/loading.css"; 

function App() {
    return (
        <div className="app">
            <Layout>
                <Workspace/>
            </Layout>
        </div>
    )
}

export default App
