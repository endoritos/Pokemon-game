import React, { useEffect, useState } from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from "axios";
const Main=()=>{
    const [pokeData,setPokeData]=useState([])
    const [loading,setLoading]=useState(true)
    const [url,setUrl]=useState(' https://pokeapi.co/api/v2/pokemon/')
    const [nextUrl,setNextUrl]=useState();
    const [prevUrl,setPrevUrl]=useState();
    const [pokeDex,setPokeDex]=useState();

    const pokefun=async()=>{
            setLoading(true)
            const res=await axios.get(url);
            // console.log(res.data)
            setNextUrl(res.data.next)
            setPrevUrl(res.data.previous)
            getPokemon(res.data.results)
            setLoading(false)
    }

// console.log(item.url + ' gebruik  this later endy') 
//   this can be use to make my game for pokemon pikker
    const getPokemon = async (res) => {
        const pokemonDetails = await Promise.all(res.map(async (item) => {
        const result = await axios.get(item.url);
        return result.data;
        }));
    
        setPokeData((prevData) => {
        const newData = [...prevData, ...pokemonDetails];
        newData.sort((a, b) => a.id > b.id ? 1 : -1);
        return newData;
        });
    };
    // we stil have a bug here were everying comes out dubble react strictmode  is on form what i heard and found 
    // useState(() => {
    //     pokeFun();
    // }, [url]); it fixes this but then the next url does not want to work when pressed 
    useEffect(()=>{
        pokefun();
    },[url])

    return(
        <>
        <div className="container">
            <div className="left-content">
                <Card pokemon={pokeData} loading={loading} infoPokemon={poke=>setPokeDex(poke)}/>
                <div className="btn-group">

                    {prevUrl && <button onClick={()=>{
                        setPokeData([]);
                        setUrl(prevUrl)
                    }}>Pevions</button>}

                    {nextUrl && <button onClick={()=>{
                        setPokeData([]);
                        setUrl(nextUrl)
                    }}
                    >Next</button>}
                </div>
            </div>
            <div className="right-content">
                <Pokeinfo data={pokeDex}/>
            </div>
        </div>
        </>
    );
}

export default Main;