
import { Carousel } from 'react-bootstrap';


import { CDMX, Puebla, Queretaro } from '../img'
import '../styles/carrousel.css'




export const Carrousel = ({ costsValue }) => {

    const { gasoline, salary, booths, maintenance, utility, supplement } = costsValue


    const multKms = (distancia) => {
        let precio = 0
        distancia <= 400
            ? precio = gasoline + salary + maintenance + booths + utility + supplement
            : precio = gasoline + salary + maintenance + booths + utility;
        // console.log(precio);

        return (distancia * precio).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0, // Establece el mínimo de decimales a 0
            maximumFractionDigits: 0, // Establece el máximo de decimales a 0
        });
    }

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
                            <h3>Desde {multKms(550)}</h3>
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
                            <h3>Desde {multKms(561.5)}</h3>
                            <h5>Ruta popular</h5>
                        </div>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="custom-carousel-image"
                        src={Queretaro}
                        alt="Queretaro"
                    />
                    <Carousel.Caption>
                        <div className="sombra pb-1">
                            <h1>Chilpancingo - Queretaro</h1>
                            <h3>Desde {multKms(973)}</h3>
                            <h5>Ruta popular</h5>
                        </div>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    )
}