import GameLife, {GameOfLife, CanvasController, Point} from 'game-life';
import { useEffect, useRef, useState } from 'react';
import { ACORN } from '../life/methuselahs';

export default function Life() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<GameOfLife<CanvasController> | null>(null);

    useEffect(() => {
        if (canvasRef.current && !game) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const center: Point = { x: -4, y: -3 };
            const game = GameLife(canvasRef.current, {
                graphics: {
                    cells: {
                        size: 10,
                    },
                    board: {
                        zoom: 400,
                        width,
                        height,
                        offset_x: Math.round(width / 2),
                        offset_y: Math.round(height / 2),
                    }
                }
            });
            const cells = ACORN;
            game.bornCells(cells.map(cell => ({ x: cell.x + center.x, y: cell.y + center.y })));
            game.startEvolution();
            setGame(game);
        }
    }, [canvasRef]);

    return <canvas 
        ref={canvasRef} 
        className='w-full h-full absolute top-0 bottom-0 left-0 right-0 pointer-events-none opacity-10 z-10'
    />;
}