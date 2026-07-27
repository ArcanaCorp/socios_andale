export default function Loading () {
    return (
        <div className="w-screen h-screen center">
            <div className="w h" style={{"--w": "250px", "--h": "250px"}}>
                <img src="/logo512.png" alt="Logo de Ándale Socios!" className="w-full h-full" />
            </div>
        </div>
    )
}