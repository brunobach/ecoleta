interface Points {
    image: string,
    image_url: string
}

const serializedPoints = (points: Array<Points>) => {
    const result = points.map(point => {
        return {
            ...point,
            image_url: `http://192.168.0.107:3333/uploads/${point.image}`
        }
    });
    return result;
}

export default serializedPoints;