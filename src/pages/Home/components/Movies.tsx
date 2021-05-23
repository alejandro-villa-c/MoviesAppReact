import { useState } from 'react';
import { TabView, TabPanel } from '../../../components/primereact';
import '../../../styles/Movies.css';

export const Movies = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <TabPanel header="En cartelera" rightIcon="pi pi-video">
                En cartelera
            </TabPanel>
            <TabPanel header="Favoritas" rightIcon="pi pi-star">
                Favoritas
            </TabPanel>
        </TabView>
    );
}

export default Movies;