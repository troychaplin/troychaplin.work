import { Container, HeroHeader, SectionHeader, GridGroup, CodeBlock, ProjectCard, type ProjectCardProps } from "@troychaplin/parlour-ui"
import { useMemo } from 'react'
import projects from '../data/projects.json'
import experiments from '../data/experiments.json'

// JSON values type as plain strings; the cast narrows `icon` to Parlour's BrandIconName.
const ProjectData = projects as ProjectCardProps[]
const ExperimentsData = experiments as ProjectCardProps[]

// Fisher–Yates shuffle on a copy, then take the first `count` items.
function pickRandom<T>(items: T[], count: number): T[] {
    const copy = [...items]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy.slice(0, count)
}

export const CodeDataReact = `const troy = {
    role: 'WordPress & front-end developer',
    stack: ['PHP', 'React', 'TypeScript', 'Storybook'],
    focus: ['block editor', 'accessibility', 'design systems'],
};

export const build = (idea: Idea): Release => {
    const block = registerBlock(idea, { accessible: true });
    const tokens = defineTokensOnce(block.design);

    return ship(block, {
        tokens,
        to: ['wordpress.org', 'npm', 'github'],
        license: 'GPL-2.0-or-later',
    });
};`;

export function Home() {
    // Memoized so the selection stays stable across re-renders and only changes on mount.
    const randomProjects = useMemo(() => pickRandom(ProjectData, 6), [])
    const randomExperiments = useMemo(() => pickRandom(ExperimentsData, 3), [])

    return (
        <>
            <Container color="pale" maxWidth="alignfull" contentWidth="alignwide">
                <GridGroup columns={2} gap="3-x-large" align="center">
                    <HeroHeader
                        prefix="Building for the open web."
                        title="Plugins, projects"
                        titleAccent="& open source contributions"
                    >
                        <ul className="parlour-hero-header__stats">
                            <li>7 released plugins</li>
                            <li>5 experimental projects</li>
                            <li>3 active contributions</li>
                        </ul>
                    </HeroHeader>
                    <CodeBlock code={CodeDataReact} color="medium" borderRadius="sm" />
                </GridGroup>
            </Container>

            <Container color="light" maxWidth="alignfull" contentWidth="alignwide">
                <SectionHeader prefix="Releases · Open source" title="Things I ship." />
                <GridGroup gap="medium">
                    {randomProjects.map(({ id, ...project }) => (
                        <ProjectCard key={id} {...project} />
                    ))}
                </GridGroup>
            </Container>

            <Container color="dark" maxWidth="alignfull" contentWidth="alignwide">
                <SectionHeader
                    prefix="Experiments · Open source"
                    title="Things I experiment with."
                />
                <GridGroup dividerColor="dark" dividers="columns">
                    {randomExperiments.map(({ id, ...experiment }) => (
                        <ProjectCard
                            key={id}
                            backgroundColor="dark"
                            backgroundHover="dark"
                            border={false}
                            {...experiment}
                        />
                    ))}
                </GridGroup>
            </Container>
        </>
    )
}
