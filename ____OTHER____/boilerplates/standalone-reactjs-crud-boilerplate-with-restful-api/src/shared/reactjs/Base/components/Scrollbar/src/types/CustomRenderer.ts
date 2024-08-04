import { CSSProperties, HTMLAttributes } from 'react';

interface CustomRenderProps extends HTMLAttributes<HTMLDivElement> {
  style: CSSProperties;
  className: string;
}

export type CustomRenderer = (props: CustomRenderProps) => JSX.Element;
