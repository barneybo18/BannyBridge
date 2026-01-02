

interface DoodleShape {
    id: number;
    type: 'hexagon' | 'circle' | 'triangle' | 'chain' | 'node';
    x: number;
    y: number;
    size: number;
    rotation: number;
    duration: number;
    delay: number;
    opacity: number;
}

const BackgroundDoodles = () => {


    const generateDoodles = (): DoodleShape[] => {
        const shapes: DoodleShape[] = [];
        const types: DoodleShape['type'][] = ['hexagon', 'circle', 'triangle', 'chain', 'node'];

        for (let i = 0; i < 20; i++) {
            shapes.push({
                id: i,
                type: types[Math.floor(Math.random() * types.length)],
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 20 + Math.random() * 80,
                rotation: Math.random() * 360,
                duration: 30 + Math.random() * 60,
                delay: Math.random() * -20,
                opacity: 0.05 + Math.random() * 0.15,
            });
        }
        return shapes;
    };

    const doodles = generateDoodles();

    const renderShape = (shape: DoodleShape) => {
        const style = {
            position: 'absolute' as const,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            opacity: shape.opacity,
            animation: `drift ${shape.duration}s ease-in-out infinite alternate, slow-spin ${shape.duration * 1.5}s linear infinite`,
            animationDelay: `${shape.delay}s`,
            color: '#4DFFFF',
            filter: 'drop-shadow(0 0 10px rgba(77, 255, 255, 0.6))',
        };

        switch (shape.type) {
            case 'hexagon':
                return (
                    <svg key={shape.id} style={style} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l10 6v8l-10 6-10-6V8z" />
                    </svg>
                );
            case 'chain':
                return (
                    <svg key={shape.id} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                );
            default:
                return (
                    <div key={shape.id} style={{
                        ...style,
                        border: '1px solid rgba(77, 255, 255, 0.3)',
                        borderRadius: shape.type === 'circle' ? '50%' : '0',
                        transform: `rotate(${shape.rotation}deg) ${shape.type === 'triangle' ? 'skewX(20deg)' : ''}`
                    }} />
                );
        }
    };

    // Generate static grid points for constellation effect
    const gridPoints = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050b1c]">
            {/* Artistic Constellation Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-40 filter drop-shadow-[0_0_8px_rgba(45,91,255,0.6)]">
                {gridPoints.map((point, i) => (
                    gridPoints.slice(i + 1).map((p2, j) => {
                        const dist = Math.hypot(point.x - p2.x, point.y - p2.y);
                        if (dist < 15) { // Only connect close points
                            return (
                                <line
                                    key={`${i}-${j}`}
                                    x1={`${point.x}%`}
                                    y1={`${point.y}%`}
                                    x2={`${p2.x}%`}
                                    y2={`${p2.y}%`}
                                    stroke="#2D5BFF"
                                    strokeWidth="1"
                                    className="animate-pulse"
                                />
                            );
                        }
                        return null;
                    })
                ))}
            </svg>

            {/* Geometric Shapes */}
            {doodles.map(renderShape)}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050b1c]/90 via-transparent to-[#050b1c]/90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoNDUsIDkxLCAyNTUsIDAuMSkiLz48L3N2Zz4=')] opacity-20" />
        </div>
    );
};

export default BackgroundDoodles;
