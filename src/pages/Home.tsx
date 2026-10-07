import { Container, Hero, HeroHeader, SectionHeader, GridGroup, CodeBlock, ProjectCard, type ProjectCardProps } from "@troychaplin/parlour-ui"
import projects from '../data/projects.json'
import experiments from '../data/experiments.json'

// JSON values type as plain strings; the cast narrows `icon` to Parlour's BrandIconName.
const ProjectData = projects as ProjectCardProps[]
const ExperimentData = experiments as ProjectCardProps[]

export const CodeDataReact = `export const Main = ({ children, hasPadding = true, className, ...rest }: MainProps) => {
    const rootClasses = ['parlour-main', hasPadding && 'parlour-main--padding', className]
        .filter(Boolean)
        .join(' ');

    return (
        <main className={rootClasses} {...rest}>
            <div className="alignfull has-global-padding is-layout-constrained entry-content">
                {children}
            </div>
        </main>
    );
};`;

export function Home() {
    return (
        <>
            <Container color="pale" maxWidth="alignfull" contentWidth="alignwide">
                <Hero>
                    <div className="parlour-hero__content">
                        <HeroHeader
                            prefix="Building for the open web."
                            title="Plugins, projects"
                            titleAccent="& open source contributions"
                        >
                            <ul className="parlour-hero-header__stats">
                                <li>7 released plugins</li>
                                <li>3 experimental projects</li>
                            </ul>
                        </HeroHeader>
                    </div>
                    <div className="parlour-hero__code">
                        <CodeBlock code={CodeDataReact} color="medium" borderRadius="sm" />
                    </div>
                </Hero>
            </Container>

            <Container color="light" maxWidth="alignfull" contentWidth="alignwide">
                <SectionHeader prefix="Releases · Open source" title="Things I ship." />
                <GridGroup>
                    {ProjectData.map((project) => (
                        <ProjectCard key={project.title} {...project} />
                    ))}
                </GridGroup>
            </Container>

            <Container color="dark" maxWidth="alignfull" contentWidth="alignwide">
                <SectionHeader prefix="Experiments · Open source" title="Things I experiment with." />
                <GridGroup>
                    {ExperimentData.map((experiment) => (
                        <ProjectCard
                            key={experiment.id}
                            backgroundColor="dark"
                            borderColor="dark"
                            {...experiment}
                        />
                    ))}
                </GridGroup>
            </Container>
        </>
    )
}
