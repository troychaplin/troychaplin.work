// import { Footer } from '../Footer/Footer'
// import { Header } from '../Header/Header'
import './Layout.scss'

export interface LayoutProps {
    children: React.ReactNode;
    hasPadding?: boolean;
    className?: string;
}

export function Layout({ children, hasPadding = true, className = '' }: LayoutProps) {
    return (
        <>
            <a className="octave-layout__skip-link" href="#main">Skip to content</a>

            {/* <Header /> */}
            
            <main className={`${hasPadding ? 'octave-main octave-main--padding' : 'octave-main'} ${className}`} >
                <div className="alignfull has-global-padding is-layout-constrained entry-content">
                    {children}
                </div>
            </main>

            {/* <Footer /> */}
        </>
    )
}
