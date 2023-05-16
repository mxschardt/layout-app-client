import Workspace from "./components/Workspace"
import Layout from "./components/Layout"
import "/styles/layout.css"
import "/styles/workspace.css"

function App() {
    const requestPosts = async (limit=100, start=0) => {
        const uri = `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`
        const response = await fetch(uri)
        const posts = await response.json()
        return posts
    }

    return (
        <div className="app">
            <Layout>
                <Workspace requestPosts={requestPosts}/>
            </Layout>
        </div>
    )
}

export default App
