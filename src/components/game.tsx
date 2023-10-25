'use client';
import { GetFigure } from '@/app/page';
import { getRandomNumber } from '@/utils/get-random-number';
import '@pixi/events';
import { _ReactPixi, useApp, useTick } from '@pixi/react';
import { useEffect } from 'react';
// import * as PIXI from 'pixi.js';

// @ts-expect-error - satisfies
type Graph = Parameters<_ReactPixi.IGraphics['draw']>['0'];

type Props = {
  speed: number;
  getFigure: GetFigure;
  shapesPerSecond: number;
  setKilledShapes: any;
  isWindowFocused: boolean;
};

const Game = ({
  speed,
  getFigure,
  shapesPerSecond,
  setKilledShapes,
  isWindowFocused,
}: Props) => {
  const app = useApp();

  useTick((delta) => {
    app.stage.children.forEach((child) =>
      child.position.set(child.position.x, child.position.y + speed)
    );
  });

  useEffect(() => {
    const addShapeInterval = setInterval(() => {
      if (isWindowFocused) {
        try {
          for (
            let generatedShapes = 0;
            generatedShapes < shapesPerSecond;
            generatedShapes++
          ) {
            app.stage.addChild(
              getFigure(
                getRandomNumber(50, app.screen.width - 50),
                undefined,
                () => {
                  setKilledShapes((killed: number) => killed + 1);
                }
              )
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
    }, 1000);

    return () => {
      clearInterval(addShapeInterval);
    };
  }, [shapesPerSecond, isWindowFocused]);

  return <></>;
};

export default Game;
