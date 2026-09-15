import { useState } from "react";
import { searchStocks } from "../../services/stockService";
import BuyModal from "../BuyModal/BuyModal";

import "./StockSearch.css";


export default function StockSearch(){

    const [query,setQuery] = useState("");
    const [stocks,setStocks] = useState([]);
    const [selectedStock,setSelectedStock] = useState(null);



    const handleSearch = async(e)=>{

        const value = e.target.value;

        console.log("User typing:", value);


        setQuery(value);



        if(value.trim().length < 2){

            setStocks([]);

            return;

        }



        try{


            const data = await searchStocks(value);


            console.log("API Response:", data);


            setStocks(data.stocks || []);


        }
        catch(error){

            console.log("Search error:", error);

            setStocks([]);

        }

    };



    return (

        <div className="stock-search">


            <input

                type="text"

                value={query}

                onChange={handleSearch}

                placeholder="Search stocks..."

                autoComplete="off"

            />



            <div className="results">

                {
                    stocks.length > 0 &&

                    stocks.map(stock=>(

                        <div
                            key={stock._id}
                            className="stock-item"
                        >


                            <div>

                                <h4>
                                    {stock.name}
                                </h4>


                                <p>
                                    {stock.symbol}
                                </p>


                            </div>



                            <div>

                                ₹{stock.price}


                                <button
                                    onClick={()=>setSelectedStock(stock)}
                                >
                                    BUY
                                </button>


                            </div>


                        </div>


                    ))

                }


            </div>



            {
                selectedStock &&

                <BuyModal

                    stock={selectedStock}

                    onClose={()=>setSelectedStock(null)}

                />

            }


        </div>

    );

}