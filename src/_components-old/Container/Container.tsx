import './Container.scss'

type AsOption = 'section' | 'header' | 'article' | 'div';
type WidthOption = 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps {
    children?: React.ReactNode;
    className?: string;
    as?: AsOption;
    maxWidth?: WidthOption;
    contentWidth?: WidthOption;
}

export function Container({ children, as: Component = 'div', maxWidth, contentWidth, className }: ContainerProps) {
  const classNames = [
    'container',
    maxWidth ? `container--${maxWidth}` : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <Component className={classNames}>
        <div className={`container__inner-${contentWidth}`}>
            {children}
        </div>
    </Component>
  )
}
