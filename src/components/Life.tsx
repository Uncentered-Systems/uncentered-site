import GameLife, { GameOfLife, CanvasController, Point } from 'game-life';
import { useEffect, useRef, useState } from 'react';
import { BLOM } from '../life/methuselahs';

export default function Life() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<GameOfLife<CanvasController> | null>(null);

    useEffect(() => {
        if (canvasRef.current && !game) {
            const width = window.innerWidth * 2;
            const height = window.innerHeight * 2;
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
                        offset_x: Math.round(width / 4),
                        offset_y: Math.round(height / 4),
                    }
                }
            });
            const cells = BLOM;
            game.bornCells(cells.map(cell => ({ x: cell.x + center.x, y: cell.y + center.y })));
            game.startEvolution();
            setGame(game);
            const interval = setInterval(() => {
                const shouldSetZoom = game.graphics.getConfig().board.zoom > 100;
                if (shouldSetZoom) {
                    game.graphics.setConfig({
                        ...game.graphics.getConfig(),
                        board: {
                            ...game.graphics.getConfig().board,
                            zoom: Math.max(game.graphics.getConfig().board.zoom - 1, 100)
                        }
                    })
                } else {
                    clearInterval(interval)
                }
            }, 100)
        }
    }, [canvasRef]);

    return <canvas
        ref={canvasRef}
        className='w-full h-full absolute top-0 bottom-0 left-0 right-0 pointer-events-none opacity-10 -z-10'
    />;
}