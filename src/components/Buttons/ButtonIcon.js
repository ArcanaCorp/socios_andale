export default function ButtonIcon ({ children, onClick, size=40, bg, color, rounded }) {
    return (
        <button className={`w h grid place-items-center ${bg} ${color} ${rounded}`} style={{"--w": `${size}px`, "--mnw": `${size}px`, "--h": `${size}px`}} onClick={onClick}>{children}</button>
    )
}