import sprinter_map from '../img/sprinter_SketchMap.jpg';
import van_map from '../img/van_SketchMap.jpg';
import van from '../img/van_toyota.jpg'
import sprinter from '../img/sprinter_hiace.jpg'


import { Carousel } from 'react-bootstrap';
export const InfoTransport = () => {
  return (
    <>
      <div className="text-center bg-dark text-white" style={{ marginBottom: "20px", border: '2px solid #333', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
        <h2>NUESTRAS UNIDADES</h2>
      </div>

      <div className='container mb-3'>
        <div className='row'>
          <div className='col-6'>
            <div className="card">
              <Carousel interval={60000}>
                {/* Primera diapositiva */}
                <Carousel.Item>
                  <img
                    className='d-block w-100'
                    src={van_map}
                    alt='Primera diapositiva'
                  />
                </Carousel.Item>

                {/* Segunda diapositiva */}
                <Carousel.Item>
                  <img
                    className='d-block w-100'
                    src={van}
                    alt='Segunda diapositiva'
                  />
                </Carousel.Item>

                {/* Agrega más diapositivas según sea necesario */}
              </Carousel>
              <div className="card-body">
                <h5 className="card-title">Toyota Van</h5>
                <ul>
                  <li>Capacidad de 15 pasajeros</li>
                  <li>Aire acondicionado</li>
                  <li>Asientos reclinables</li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-6'>
            <div className="card">
              <Carousel interval={60000}>
                {/* Primera diapositiva */}
                <Carousel.Item>
                  <img
                    className='d-block w-100'
                    src={sprinter_map}
                    alt='Primera diapositiva'
                  />
                </Carousel.Item>

                {/* Segunda diapositiva */}
                <Carousel.Item>
                  <img
                    className='d-block w-100'
                    src={sprinter}
                    alt='Segunda diapositiva'
                  />
                </Carousel.Item>

                {/* Agrega más diapositivas según sea necesario */}
              </Carousel>
              <div className="card-body">
                <h5 className="card-title">Sprinter Hiace</h5>
                <ul>
                  <li>Capacidad de 18 pasajeros</li>
                  <li>Aire acondicionado</li>
                  <li>Asientos reclinables</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
