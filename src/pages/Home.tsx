import { Group } from "../components/Group/Group";

export function Home() {
    return (
        <>
            <h1>Troy Chaplin</h1>
            <p>Cras tincidunt turpis ac vestibulum lacinia. Suspendisse in felis sodales, sagittis augue ultricies, elementum eros. Suspendisse lobortis tristique rhoncus. Vivamus finibus ligula eu vehicula luctus.</p>

            <Group as="section" bgType="light">
                <h2>Group Component</h2>
                <p>Cras tincidunt turpis ac vestibulum lacinia. Suspendisse in felis sodales, sagittis augue ultricies, elementum eros. Suspendisse lobortis tristique rhoncus. Vivamus finibus ligula eu vehicula luctus.</p>
            </Group>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis hendrerit ex venenatis tortor consequat fermentum. Mauris in lorem massa. In auctor id nunc bibendum sodales. Ut ut magna in nisl pretium molestie non at arcu. Pellentesque efficitur enim vel consectetur tempor. Proin arcu lectus, sagittis ut eleifend vitae, sollicitudin vestibulum.</p>
            <p>Donec imperdiet felis et libero rutrum, ornare auctor lacus scelerisque. Integer dignissim ac lorem ac rhoncus. Duis efficitur enim eros, nec tempus libero eleifend non. Proin nec convallis sapien.</p>
            
            <Group as="section" bgType="light">
                <h2>Group Component</h2>
                <p>Cras tincidunt turpis ac vestibulum lacinia. Suspendisse in felis sodales, sagittis augue ultricies, elementum eros. Suspendisse lobortis tristique rhoncus. Vivamus finibus ligula eu vehicula luctus.</p>
            </Group>
            
            <Group as="section" bgType="light" maxWidth="alignwide">
                <h2>Group Component</h2>
                <p>Cras tincidunt turpis ac vestibulum lacinia. Suspendisse in felis sodales, sagittis augue ultricies, elementum eros. Suspendisse lobortis tristique rhoncus. Vivamus finibus ligula eu vehicula luctus.</p>
            </Group>

            <p>Donec imperdiet felis et libero rutrum, ornare auctor lacus scelerisque. Integer dignissim ac lorem ac rhoncus. Duis efficitur enim eros, nec tempus libero eleifend non. Proin nec convallis sapien.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis hendrerit ex venenatis tortor consequat fermentum. Mauris in lorem massa. In auctor id nunc bibendum sodales. Ut ut magna in nisl pretium molestie non at arcu. Pellentesque efficitur enim vel consectetur tempor. Proin arcu lectus, sagittis ut eleifend vitae, sollicitudin vestibulum.</p>

            <Group as="section" bgType="dark">
                <h2>Group Component</h2>
                <p>Cras tincidunt turpis ac vestibulum lacinia. Suspendisse in felis sodales, sagittis augue ultricies, elementum eros. Suspendisse lobortis tristique rhoncus. Vivamus finibus ligula eu vehicula luctus.</p>
            </Group>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis hendrerit ex venenatis tortor consequat fermentum. Mauris in lorem massa. In auctor id nunc bibendum sodales. Ut ut magna in nisl pretium molestie non at arcu. Pellentesque efficitur enim vel consectetur tempor. Proin arcu lectus, sagittis ut eleifend vitae, sollicitudin vestibulum.</p>

            <Group as="section" bgType="dark" maxWidth="alignfull">
                <h2>Group Component</h2>
                <p>Cras tincidunt turpis ac vestibulum lacinia. Suspendisse in felis sodales, sagittis augue ultricies, elementum eros. Suspendisse lobortis tristique rhoncus. Vivamus finibus ligula eu vehicula luctus.</p>
            </Group>
        </>
    )
}
