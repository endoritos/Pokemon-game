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

    const getPokemon=async(res)=>{
        res.map(async(item)=>{
            const result=await axios.get(item.url)
            setPokeData(state=>{
                state=[...state,result.data]
                state.sort((a,b)=>a.id>b.id?1:-1)
                return state; // push state into array
            })
            // console.log(item.url + ' gebruik  this later endy') 
            //   this can be use to make my game for pokemon pikker
        })
    }

    useEffect(()=>{
        pokefun();
    },[url])

    return(
        <>
        <div className="container">
            <div className="left-content">
                <Card pokemon={pokeData} loading={loading} infoPokemon={poke=>setPokeDex(poke)}/>
                <div className="btn-group">
                    <button>Pevions</button>
                    <button>Next</button>
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