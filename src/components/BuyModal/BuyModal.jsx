import { useState } from "react";
import { createOrder } from "../../services/orderServiceClient";

import "./BuyModal.css";


export default function BuyModal({stock,onClose}){


    const [quantity,setQuantity] = useState(1);
    const [loading,setLoading] = useState(false);



    const handleBuy = async()=>{


        try{

            setLoading(true);


            const orderData = {

                symbol: stock.symbol,
                name: stock.name,
                quantity: quantity,
                price: stock.price,
                type:"BUY"

            };


            await createOrder(orderData);


            alert("Order placed successfully");


            onClose();


        }
        catch(error){

            console.log(error);

            alert("Order failed");

        }
        finally{

            setLoading(false);

        }

    };



    return (

        <div className="modal-overlay">


            <div className="buy-modal">


                <h2>
                    Buy {stock.name}
                </h2>


                <p>
                    Symbol: {stock.symbol}
                </p>


                <p>
                    Price: ₹{stock.price}
                </p>



                <input

                    type="number"

                    min="1"

                    value={quantity}

                    onChange={(e)=>setQuantity(Number(e.target.value))}

                />



                <div>


                    <button
                        onClick={handleBuy}
                        disabled={loading}
                    >

                        {
                            loading 
                            ? "Buying..."
                            : "BUY"
                        }

                    </button>



                    <button
                        onClick={onClose}
                    >
                        Cancel
                    </button>


                </div>



            </div>


        </div>

    );

}