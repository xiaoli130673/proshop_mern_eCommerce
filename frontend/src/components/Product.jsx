import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className='p-3 my-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img variant='top' src={product.image} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        <Card.Text as='h3'>{`$${product.price}`}</Card.Text>
      </Card.Body>
    </Card>
  );
};
export default Product;
