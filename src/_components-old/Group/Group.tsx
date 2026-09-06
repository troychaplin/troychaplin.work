import './Group.scss'

type AsOption = 'div' | 'header' | 'main' | 'section' | 'article' | 'aside' | 'footer';
type WidthOption = 'alignsmall' | 'aligncontent' | 'alignwide' | 'alignfull';

export interface GroupProps {
    children?: React.ReactNode;
    className?: string;
    as?: AsOption;
    maxWidth?: WidthOption;
    contentWidth?: WidthOption;
}

export function Group({ children, as: Component = 'div', maxWidth = 'alignfull', contentWidth, className }: GroupProps) {
  const classNames = [
    'octave-group',
    maxWidth,
    'is-layout-constrained',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <Component className={classNames}>
        <div className={`has-global-padding ${contentWidth}`}>
            {children}
        </div>
    </Component>
  )
}
