'use client';
import Game from '@/components/game';
import '@pixi/events';
import { Stage } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useState } from 'react';
import useWindowFocus from 'use-window-focus';

export type Figure = {
  x: number;
  y: number;
  shape:
    | 'circle'
    | 'triangle'
    | 'rectangle'
    | 'polygon'
    | 'ellipse'
    | 'star'
    | 'hexagon';
  uuid: string;
};

const colors = ['#29f7ff', '#ff9800', '#ffeb3b', '#ff5722'];

const buttonClassName =
  'bg-[#24292e] px-2 py-1 rounded-md cursor-pointer select-none text-white';

export type GetFigure = (x?: number, y?: number, onClick?: () => void) => any;

export const getRandomNumber = (min: number, max: number): number =>
  Math.random() * (max - min + 1) + min;

const drawCircle = (graphics: PIXI.Graphics) =>
  graphics
    .beginFill(colors[Math.round(getRandomNumber(0, 2))])
    .drawCircle(0, 0, 50)
    .endFill();
const drawRectangle = (graphics: PIXI.Graphics) =>
  graphics
    .beginFill(colors[Math.round(getRandomNumber(0, 2))])
    .drawRoundedRect(-50, -50, 100, 100, 10)
    .endFill();

export default function Home() {
  const [childrenCount, setChildrenCount] = useState(0);
  const [speed, setSpeed] = useState(3);
  const [killed, setKilled] = useState(0);
  const [shapesPerSecond, setShapesPerSecond] = useState(1);
  const isWindowFocused = useWindowFocus();

  const getFigure: GetFigure = (x = 100, y, onClick) => {
    const graphics = new PIXI.Graphics();
    [drawCircle, drawRectangle][Math.round(getRandomNumber(0, 0))](graphics);
    const bounds = graphics.getBounds();
    if (!y) {
      y = 0 - bounds.height;
    }
    graphics.position.set(x, y);
    graphics.eventMode = 'dynamic';
    graphics.on('pointerup', (event) => {
      event.stopPropagation();
      graphics.destroy();
      onClick && onClick();
    });
    return graphics;
  };

  return (
    <>
      <div className={'justify-center px-2 flex items-center gap-10 py-2'}>
        <span className={'w-[150px] text-right'}>Shapes: {childrenCount}</span>
        <span>Killed shapes: {killed}</span>
        <span>Shapes per second: {shapesPerSecond}</span>

        <span
          onClick={() => setSpeed((prev) => prev + 1)}
          className={buttonClassName}
        >
          + Speed
        </span>
        <span
          onClick={() => setSpeed((prev) => prev - 1)}
          className={buttonClassName}
        >
          - Speed
        </span>
        <span
          onClick={() => setShapesPerSecond((prev) => prev + 1)}
          className={buttonClassName}
        >
          + Shapes per second
        </span>
        <span
          onClick={() => setShapesPerSecond((prev) => prev - 1)}
          className={buttonClassName}
        >
          - Shapes per second
        </span>
      </div>
      <Stage
        onMount={(app) => {
          app.stage.on('childAdded', () =>
            setChildrenCount(app.stage.children.length)
          );
          app.stage.on('childRemoved', () =>
            setChildrenCount(app.stage.children.length)
          );
          app.stage.eventMode = 'dynamic';
          app.stage.hitArea = app.screen;
          app.stage.on('pointerup', ({ globalX, globalY }) => {
            app.stage.addChild(getFigure(globalX, globalY));
          });

          app.ticker.add(() => {
            app.stage.children
              .find(
                (child) =>
                  child.position.y >
                  app.screen.height + child.getBounds().height
              )
              ?.destroy();
          });
        }}
        className={'mx-auto'}
        options={{
          eventFeatures: {
            click: true,
          },
          antialias: true,
          backgroundColor: '#24292e',
        }}
      >
        <Game
          speed={speed}
          shapesPerSecond={shapesPerSecond}
          getFigure={getFigure}
          setKilledShapes={setKilled}
          isWindowFocused={isWindowFocused}
        />
      </Stage>
    </>
  );
}
