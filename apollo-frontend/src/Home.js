import { useEffect, useState }from 'react'

const Home = () => {

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3000')
            const json = await response.json()

            if (response.ok) {
                setData(json)
            }
        }

        fetchWorkouts()
    }, [])

    return (
        <div className="home">
            <div className = "data">
                {data && data.map(() => (
                    <p key={data_id}>{data.title}</p>
                ))}
            </div>
        </div>
    )
}

export default Home
