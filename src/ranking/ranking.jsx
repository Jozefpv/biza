import React from 'react';
import { useEffect, useState } from 'react';
import './ranking.css'


const Ranking = () => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // const [points, setPoints] = useState('0')
    // const [wallet, setWallet] = useState('')
    const [ranking, setRanking] = useState(null)


    useEffect(() => {
        fetchRankingData();
    }, [])

    const fetchRankingData = async () => {
        try {
            const response = await fetch('https://galiens-api.onrender.com/ranking');

            if (!response.ok) {
                throw new Error('Error al obtener el ranking');
            }

            const data = await response.json();
            setRanking(data);
        } catch (error) {
            console.error('Error al obtener el ranking:', error);
        }
    };

    // const handlePoints = (e) => {
    //     setPoints(e.target.value)
    // }

    // const handleWallet = (e) => {
    //     setWallet(e.target.value)
    // }

    // const sendData = async (e) => {
    //     e.preventDefault();

    //     const data = {
    //         points: points,
    //         wallet: wallet
    //     };

    //     const response = await fetch('http://localhost:3000/users', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data)
    //     });

    //     if (!response.ok) {
    //         console.error('Error al enviar el post');
    //         return;
    //     }

    //     const result = await response.json();
    //     fetchRankingData()
    //     console.log('Post creado:', result);
    // };

    return (
        <div className='rankingContainer' id='ranking'>
            <span className='rankingTitle'>Leaderboard</span>
            {ranking ? (
                <div className='rankingSection'>
                    <img src="https://storage.googleapis.com/bittenbtcbucket/Untitled_Artwork%20(1).png" style={{ width: "120px", transform:"translateY(30px)" }}></img>
                    <div className='tableContainer'>
                        <table className='rankingTable'>
                            <tr>
                                <td style={{ width: "70%", fontSize: "20px", fontWeight: "bold" }}>WALLET</td>
                                <td style={{ width: "30%", fontSize: "20px", fontWeight: "bold" }}>POINTS</td>
                            </tr>
                            {ranking.ranking.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ width: "70%" }}>
                                        {windowWidth < 700 && user.id.length > 30 ? `${user.id.substring(0, 30)}...` : user.id}
                                    </td>
                                    <td style={{ width: "30%" }}>{user.points}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            ) : (
                <p>Loading leaderboard...</p>
            )}
        </div>
    );
    
    
}

export default Ranking