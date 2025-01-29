import { useEffect, useState } from 'react';
import { getCars } from '../api/carApi';
import CarList from '../components/CarList';
import SearchBar from '../components/SearchBar';

const ProductList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsData = await getCars();
        setCars(carsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">My Cars</h1>
      <SearchBar setCars={setCars} />
      {loading ? <p>Loading...</p> : <CarList cars={cars} />}
    </div>
  );
};

export default ProductList;
