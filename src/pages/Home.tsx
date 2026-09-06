import { Group } from "../components/Group/Group";

export function Home() {
    return (
        <>
            <h1>Troy Chaplin</h1>
            <p>Placeholder for the home page.</p>

            <Group as="section" bgType="dark">
                <h2>Group Component</h2>
                <p>Placeholder for the home page.</p>
            </Group>

            <p>Break between groups</p>
            
            <Group as="section" bgType="light">
                <h2>Group Component</h2>
                <p>Placeholder for the home page.</p>
            </Group>
        </>
    )
}
