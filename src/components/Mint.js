import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'

const Mint = ({ provider, nft, cost, setIsLoading }) => {

    const [isWaiting, setIsWaiting] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const mintHandler = async (e) => {
        e.preventDefault();
        setIsWaiting(true);
        try {
            const signer = await provider.getSigner();
            const transaction = await nft.connect(signer).mint(quantity, { value: cost.mul(quantity) });
            await transaction.wait();
        } catch {
            setIsWaiting(false);
            window.alert('User rejected or transaction reverted');
        }
        setIsLoading(true);
    }

    return (
        <Form onSubmit={mintHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
            {isWaiting ? (
                <Spinner animation='border' style={{ display: 'block', margin: '0 auto' }} />
            ) : (
                <Form.Group>
                    <div className="container mt-4">
                        <div className="mb-3 text-center">
                            <Form.Label htmlFor="quantity">Number of NFTs to Mint</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    id="quantity"
                                    placeholder="Enter quantity"
                                />
                            </InputGroup>
                        </div>
                        <Button variant='primary' type='submit' style={{ width: '100%' }}>
                            Mint
                        </Button>
                    </div>
                </Form.Group>
            )}

        </Form>
    )

}

export default Mint;
