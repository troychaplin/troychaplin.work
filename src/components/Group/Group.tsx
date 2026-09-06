import './Group.scss';

type AsOption = 'div' | 'header' | 'main' | 'section' | 'article' | 'aside' | 'footer';
type WidthOption = 'alignsmall' | 'aligncontent' | 'alignwide' | 'alignfull';

export interface GroupProps {
    children?: React.ReactNode;
    as?: AsOption;
    bgType?: 'light' | 'dark';
    maxWidth?: WidthOption;
    contentWidth?: WidthOption;
}

export const Group = ({
    children,
    as = 'div',
    bgType,
    maxWidth = 'aligncontent',
    contentWidth = 'aligncontent',
}: GroupProps) => {
    const Component = as;

    const rootClasses = [
        'octave-group',
        bgType && `octave-group--${bgType}`,
        bgType && 'has-global-padding',
        maxWidth,
        'is-layout-constrained',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Component className={rootClasses}>
            <div className={`has-global-padding ${contentWidth}`}>{children}</div>
        </Component>
    );
};
