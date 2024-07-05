import GameLife, { GameOfLife, CanvasController, Point } from 'game-life';
import { useEffect, useRef, useState } from 'react';
import { BLOM } from '../life/methuselahs';

export default function Life() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<GameOfLife<CanvasController> | null>(null);

    useEffect(() => {
        if (canvasRef.current && !game) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const center: Point = { x: -7, y: -3 };
            const game = GameLife(canvasRef.current, {
                graphics: {
                    colors: {
                        grid: 'transparent',
                        cell: 'black',
                        background: 'white',
                    },
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
            const cells = BLOM;
            game.bornCells(cells.map(cell => ({ x: cell.x + center.x, y: cell.y + center.y })));
            game.startEvolution();
            setGame(game);
        }
    }, [canvasRef]);

    return <div className='w-screen h-screen absolute top-0 bottom-0 left-0 right-0 pointer-events-none opacity-10 -z-10 overflow-hidden'>
        <canvas
            ref={canvasRef}
            className='w-screen h-screen absolute top-0 bottom-0 left-0 right-0'
        />
    </div>;
}