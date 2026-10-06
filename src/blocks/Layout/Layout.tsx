import { SiteHeader, InfoBar, Main, SiteFooter } from "@troychaplin/parlour-ui"

export interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
    return (
        <>
            <SiteHeader siteTitle="troychaplin.work" siteTitleAccent="troychaplin" />
            <InfoBar />
            <Main className={className} hasPadding={false}>
                {children}
            </Main>
            <SiteFooter
                name="Troy Chaplin"
                text={
                    <>
                        Powered by{' '}
                        <a href="https://troychaplin.github.io/parlour-ui/">Parlour UI</a>, an experimental React
                        and WordPress framework
                    </>
                }
                github="https://github.com/troychaplin"
                wordpress="https://profiles.wordpress.org/areziaal"
                x="https://x.com/troychaplin"
                bluesky="https://bsky.app/profile/troychaplin.bsky.social"
                linkedin="https://www.linkedin.com/in/troychaplin"
            />
        </>
    )
}
