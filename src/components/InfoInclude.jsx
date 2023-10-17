export const InfoInclude = () => {
    return (
        <>
            <div className="text-center bg-dark text-white" style={{ marginBottom: "20px", border: '2px solid #333', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                <h2>EL SERVICIO INCLUYE</h2>
            </div>

            <div className='row'>
                <div className="col-4 mb-2">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="fa-solid fa-address-card"></i>
                            <h5 className="card-title">Chofer</h5>
                            <hr className="mx-2" />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="fas fa-car"></i>
                            <h5 className="card-title">Traslados</h5>
                            <hr className="mx-2" />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="fa-solid fa-tv"></i>
                            <h5 className="card-title">Entretenimeinto</h5>
                            <hr className="mx-2" />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="fas fa-gas-pump"></i>
                            <h5 className="card-title">Combustible</h5>
                            <hr className="mx-2" />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="fas fa-road"></i>
                            <h5 className="card-title">Casetas</h5>
                            <hr className="mx-2" />
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="fas fa-user-shield"></i>
                            <h5 className="card-title">Seguro de viaje</h5>
                            <hr className="mx-2" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
