import { Carousel } from 'react-bootstrap';

// import queretaro from '../img/queretaro.jpg';
import CDMX from '../img/CDMX.jpg';
import Puebla from '../img/Puebla.jpg';

import Taxco from '../img/Taxco.jpg';

import '../styles/carrousel.css'

export const Carrousel = () => {
    return (
        <>
            <Carousel className="mt-2 custom-carousel" interval={60000}>
                <Carousel.Item>
                    <img
                        className="custom-carousel-image"
                        src={CDMX}
                        alt="CDMX"
                    />
                    <Carousel.Caption>
                        <div className="sombra pb-1">

                            <h1>Chilpancingo - CDMX</h1>
                            <h3>Desde $7,200</h3>
                            <h5>Ruta popular</h5>
                        </div>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="custom-carousel-image"
                        src={Puebla}
                        alt="Puebla"
                    />
                    <Carousel.Caption>
                        <div className="sombra pb-1">
                            <h1>Chilpancingo - Puebla</h1>
                            <h3>Desde $7,300</h3>
                            <h5>Ruta popular</h5>
                        </div>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="custom-carousel-image"
                        src={Taxco}
                        alt="Taxco"
                    />
                    <Carousel.Caption>
                        <div className="sombra pb-1">
                            <h1>Chilpancingo - Taxco</h1>
                            <h3>Desde $5,500</h3>
                            <h5>Ruta popular</h5>
                        </div>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    )
}